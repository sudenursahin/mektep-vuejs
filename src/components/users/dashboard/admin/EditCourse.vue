<template>
    <div v-if="loading">
      <v-progress-linear indeterminate color="primary"></v-progress-linear>
    </div>
    <div v-else class="edit-course-container">
      <h2 class="page-title">Ders Tashîh</h2>
      
      <form @submit.prevent="handleSubmit" class="course-form">
        <div class="form-group">
          <label for="courseTitle">Ders Başlığı:</label>
          <input 
            type="text" 
            id="courseTitle"
            v-model="courseData.title"
            placeholder="Ders başlığını giriniz..."
            required
          >
        </div>
  
        <div class="form-group">
          <label for="description">Ders Açıklaması:</label>
          <Tiptap 
            v-model="courseData.description" 
            @update:modelValue="updateEditor"
          />
        </div>
  
        <div class="form-group">
          <label for="courseImg">Ders Görseli:</label>
          <input 
            type="file" 
            id="courseImg"
            @change="handleImageUpload"
            accept="image/*"
            class="file-input"
          >
          <div v-if="courseData.img" class="image-preview">
            <img 
              :src="courseData.img" 
              :alt="courseData.title"
              class="preview-img"
            >
          </div>
        </div>
  
        <div class="form-row">
          <div class="form-group">
            <label for="courseRating">Ders Seviyesi:</label>
            <input 
              type="number" 
              id="courseRating"
              v-model="courseData.rating"
              min="1"
              max="5"
              required
            >
          </div>
  
          <div class="form-group">
            <label for="courseCategory">İlim Dalı:</label>
            <select 
              id="courseCategory"
              v-model="courseData.category"
              required
            >
              <option value="">Seçiniz...</option>
              <option value="fıkıh">Fıkıh</option>
              <option value="tefsir">Tefsir</option>
              <option value="tıp">Tıp</option>
              <option value="matematik">Matematik</option>
              <option value="astronomi">Hey'et</option>
              <option value="hadis">Hadis</option>
              <option value="kelam">Kelam</option>
              <option value="edebiyat">Edebiyat</option>
              <option value="fizik">Fizik</option>
            </select>
          </div>
        </div>
  
        <div class="form-actions">
          <button type="submit" class="submit-btn">
            <i class="fas fa-save"></i>
            Tashîh Et
          </button>
          <button type="button" class="cancel-btn" @click="goBack">
            <i class="fas fa-times-circle"></i>
            Fesh Et
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'vue-toast-notification'
  import { useUserStore } from '@/stores/user.js'
  import { useCourseStore } from '@/stores/courses.js'
  import * as yup from 'yup'
  import CourseSchema from './schema.js'
  import Tiptap from '@/utils/Tiptap.vue'
  import { useRouter, useRoute } from 'vue-router'
  import { doc, getDoc } from 'firebase/firestore'
  import { db } from '@/utils/firebase.js'
  import { PDFDocument } from 'pdf-lib'
  
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const courseStore = useCourseStore()
  const $toast = useToast()
  const loading = ref(true)
  
  const courseData = ref({
    title: '',
    summary: '',
    description: '',
    rating: null,
    category: '',
    img: '',
    createdAt: new Date()
  })
  
  onMounted(async () => {
    try {
      const courseId = route.params.id
      const course = await courseStore.getCourse(courseId)
      if (course) {
        courseData.value = { ...course }
      } else {
        throw new Error('Ders bulunamadı')
      }
    } catch (error) {
      $toast.error(error.message || 'Ders yüklenirken hata oluştu')
      router.push('/user/dashboard/courses')
    } finally {
      loading.value = false
    }
  })
  
  function handleImageUpload(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        courseData.value.img = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  const updateEditor = (value) => {
    courseData.value.description = value || ''
  }
  
  const handleSubmit = async () => {
    try {
      loading.value = true
  
      const submitData = {
        ...courseData.value,
        summary: courseData.value.title,
        updatedAt: new Date()
      }
  
      // Validation
      try {
        await yup.object(CourseSchema).validate(submitData, { 
          abortEarly: false
        })
      } catch (validationError) {
        validationError.inner.forEach(err => {
          $toast.error(err.message)
        })
        return
      }
      
      if (pdfPages.value.length > 0) {
        submitData.content = {
          pages: pdfPages.value,
          totalPages: pdfPages.value.length
        }
      }
      
      await courseStore.updateCourse(route.params.id, submitData)
      $toast.success('Ders başarıyla tashîh edildi!')
      router.push('/user/dashboard/courses')
    } catch (error) {
      console.error('Submit error:', error)
      $toast.error(error.message || 'Ders tashîhinde bir hata oluştu!')
    } finally {
      loading.value = false
    }
  }
  
  const goBack = () => {
    router.push('/user/dashboard/courses')
  }
  </script>
  
  <style scoped>
  .edit-course-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 3rem;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 3px solid #DAA520;
  }
  
  .page-title {
    color: #800020;
    font-family: 'Amiri', serif;
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .course-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  label {
    color: #800020;
    font-family: 'Amiri', serif;
    font-size: 1.3rem;
  }
  
  input, textarea, select {
    padding: 1rem;
    border: 1px solid #DAA520;
    border-radius: 4px;
    font-family: 'Amiri', serif;
    color: #333;
    background-color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }
  
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #800020;
    box-shadow: 0 0 0 2px rgba(128, 0, 32, 0.1);
  }
  
  textarea {
    min-height: 150px;
  }
  
  .form-actions {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .submit-btn, .cancel-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
    font-family: 'Amiri', serif;
    font-size: 1.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    min-width: 200px;
  }
  
  .submit-btn {
    background-color: #800020;
    color: #F5E6CA;
  }
  
  .submit-btn:hover {
    background-color: #600018;
    transform: translateY(-2px);
  }
  
  .cancel-btn {
    background-color: #666;
    color: #fff;
  }
  
  .cancel-btn:hover {
    background-color: #555;
    transform: translateY(-2px);
  }
  
  @media (max-width: 1024px) {
    .edit-course-container {
      max-width: 90%;
      padding: 2rem;
    }
  
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .submit-btn, .cancel-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  .image-preview {
    margin-top: 0.5rem;
    text-align: center;
  }
  
  .preview-img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  </style>