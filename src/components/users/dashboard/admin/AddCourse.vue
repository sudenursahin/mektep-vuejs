<template>
  <div v-if="loading">
    <v-progress-linear indeterminate color="primary"></v-progress-linear>
  </div>
  <div v-else class="add-course-container">
    <h2 class="page-title">Ders İhdâs</h2>
    
    <form @submit.prevent="handleSubmit"  class="course-form">
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
        <div v-if="courseData.description" class="description-preview">
          Karakter sayısı: {{ courseData.description.length }}
        </div>
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
        <small v-if="courseData.img" class="file-selected">
          Görsel seçildi
        </small>
      </div>

      <div class="form-group">
        <label for="coursePdf">Ders PDF'i:</label>
        <input 
          type="file" 
          id="coursePdf"
          @change="handlePdfUpload"
          accept="application/pdf"
          class="file-input"
        >
        <small v-if="pdfInfo" class="file-selected">
          PDF seçildi: {{ pdfInfo.fileName }}
        </small>
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
            <option value="">İlm-i Şerif İntihab Ediniz...</option>
            <option value="fıkıh">Fıkıh</option>
            <option value="tefsir">Tefsir</option>
            <option value="tıp">Tıbb-ı Osmani</option>
            <option value="matematik">İlm-i Hesab</option>
            <option value="astronomi">İlm-i Hey'et</option>
            <option value="hadis">Hadis-i Şerif</option>
            <option value="kelam">İlm-i Kelam</option>
            <option value="edebiyat">Edebiyat-ı Osmaniye</option>
            <option value="fizik">İlm-i Hikmet-i Tabiiye</option>
            <option value="siyaset">İlm-i Siyaset</option>
            <option value="tarih">İlm-i Tarih</option>
            <option value="felsefe">Hikmet-i Nazariye</option>
            <option value="denizcilik">Fünun-ı Bahriye</option>
            <option value="gazetecilik">Fenn-i Gazetecilik</option>
            <option value="mimari">Fenn-i Mimari</option>
            <option value="musiki">İlm-i Musiki</option>
            <option value="hat">Hüsn-i Hat</option>
            <option value="tasavvuf">İlm-i Tasavvuf</option>
            <option value="mantık">İlm-i Mantık</option>
            <option value="kimya">İlm-i Kimya</option>
            <option value="coğrafya">İlm-i Coğrafya</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="loading">
          <i class="fas fa-save"></i>
          {{ loading ? 'Kaydediliyor...' : 'Kaydet' }}
        </button>
        <button type="button" class="cancel-btn" @click="resetForm">
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
import { useRouter } from 'vue-router'
import { doc, updateDoc, deleteField, getDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '@/utils/firebase.js'
import * as pdfjsLib from 'pdfjs-dist'

// Worker'ı local olarak ayarla
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()
const $toast = useToast()
const loading = ref(false)

const courseData = ref({
  title: '',
  summary: '',
  description: '',
  rating: null,
  category: '',
  img: '',
  createdAt: new Date()
})

const courseContent = ref('')

const pdfInfo = ref(null)
const pdfPages = ref([])
const pdfPreview = ref([])

const updateAdminField = async () => {
  try {
    const userRef = doc(db, 'users', userStore.getUserData.uid)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      if (userData.isadmin !== undefined) {
        await updateDoc(userRef, {
          isAdmin: userData.isadmin,
          isadmin: deleteField()
        })
      }
    }
  } catch (error) {
    console.error('Error updating admin field:', error)
  }
}

onMounted(async () => {
  try {
    const user = userStore.getUserData
    
    if (!user || !user.uid) {
      $toast.error('Lütfen giriş yapın')
      router.push('/signin')
      return
    }

    // Admin kontrolü
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      $toast.error('Bu sayfaya erişim yetkiniz yok')
      router.push('/user/dashboard')
      return
    }
  } catch (error) {
    console.error('Auth check error:', error)
    $toast.error('Yetkilendirme hatası')
    router.push('/user/dashboard')
  }
})

const updateEditor = (value) => {
  courseData.value.description = value || ''
}

// Resim sıkıştırma fonksiyonu
function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Maksimum boyutlar
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 600
        
        // En-boy oranını koru
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height)
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Sıkıştırılmış base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
        resolve(compressedBase64)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// Görsel yükleme fonksiyonunu güncelle
async function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    loading.value = true
    // Resmi sıkıştır
    const compressedImage = await compressImage(file)
    courseData.value.img = compressedImage
  } catch (error) {
    console.error('Resim yükleme hatası:', error)
    $toast.error('Resim yüklenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

async function handlePdfUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  loading.value = true
  pdfPreview.value = [] // Önizlemeyi temizle
  
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // PDF'i yükle
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer)
    })
    
    const pdf = await loadingTask.promise
    
    pdfInfo.value = {
      pageCount: pdf.numPages,
      fileName: file.name
    }

    // Her sayfayı text olarak çıkart
    pdfPages.value = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map(item => item.str).join(' ')
      pdfPages.value.push(pageText)

      // İlk 3 sayfanın önizlemesini oluştur
      if (i <= 3) {
        const viewport = page.getViewport({ scale: 0.3 })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        pdfPreview.value.push(canvas.toDataURL())
      }
    }

    // Course data'ya PDF içeriğini ekle
    courseData.value.content = {
      pages: pdfPages.value,
      totalPages: pdfInfo.value.pageCount
    }

  } catch (error) {
    console.error('PDF işleme hatası:', error)
    $toast.error('PDF işlenirken bir hata oluştu')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    loading.value = true

    // Form verilerini hazırla
    const submitData = {
      title: courseData.value.title,
      description: courseData.value.description,
      rating: Number(courseData.value.rating),
      category: courseData.value.category,
      img: courseData.value.img || null,
      summary: courseData.value.title, // Başlığı özet olarak kullan
      createdAt: new Date(),
      timestamp: new Date()
    }

    // PDF içeriği varsa ekle
    if (pdfPages.value.length > 0) {
      submitData.content = {
        pages: pdfPages.value,
        totalPages: pdfPages.value.length
      }
    }

    // Validation
    try {
      await yup.object(CourseSchema).validate(submitData, { 
        abortEarly: false,
        strict: false
      })
    } catch (error) {
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach(err => {
          $toast.error(err.message)
        })
      } else {
        $toast.error('Lütfen tüm zorunlu alanları doldurun')
      }
      loading.value = false
      return
    }

    // Kursu ekle
    await courseStore.addCourse(submitData)
    
    $toast.success('Ders başarıyla ihdâs edildi!')
    
    router.push('/user/dashboard/courses')
  } catch (error) {
    $toast.error(error.message || 'Ders ihdâsında bir hata oluştu!')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  courseData.value = {
    title: '',
    summary: '',
    description: '',
    rating: null,
    category: '',
    img: '',
    createdAt: new Date()
  }
}
</script>

<style scoped>
.add-course-container {
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
  .add-course-container {
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

.description-preview {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.image-preview {
  margin-top: 1rem;
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.preview-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

/* URL input stilini geliştirelim */
input[type="url"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(218, 165, 32, 0.3);
  border-radius: 4px;
  font-family: 'Amiri', serif;
  transition: all 0.3s ease;
}

input[type="url"]:focus {
  border-color: #DAA520;
  box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.1);
  outline: none;
}

.file-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(218, 165, 32, 0.3);
  border-radius: 4px;
  font-family: 'Amiri', serif;
  background: white;
  cursor: pointer;
}

.file-input:hover {
  background: rgba(218, 165, 32, 0.05);
}

.file-input::-webkit-file-upload-button {
  background: #DAA520;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  cursor: pointer;
  margin-right: 1rem;
}

.content-preview {
  margin-top: 1rem;
}

.content-preview textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #DAA520;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  resize: vertical;
  min-height: 150px;
}

.content-preview textarea:focus {
  outline: none;
  border-color: #800020;
  box-shadow: 0 0 0 2px rgba(128, 0, 32, 0.1);
}

.pdf-info {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(245, 230, 202, 0.5);
  border-radius: 8px;
}

.pdf-preview {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
  margin-top: 1rem;
}

.page-preview {
  flex: 0 0 auto;
  border: 2px solid #DAA520;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-preview img {
  max-height: 200px;
  width: auto;
}

.file-selected {
  color: #008000;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>