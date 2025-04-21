<template>
  <div class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-inner">
        <!-- Başlık -->
        <div class="modal-header">
          <div class="title-ornament left"></div>
          <h2>{{ course.title }}</h2>
          <div class="title-ornament right"></div>
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Ders Bilgileri -->
        <div class="course-info">
          <div class="image-container">
            <img :src="course.img" :alt="course.title" class="course-image">
            <div class="image-border"></div>
          </div>
          <div class="info-details">
            <p class="category">{{ course.category }}</p>
            <div class="rating-container">
              <span class="rating-label">Derece-i Tedris:</span>
              <div class="rating-stars">
                <i class="fas fa-star" v-for="n in course.rating" :key="n"></i>
                <i class="far fa-star" v-for="n in 5-course.rating" :key="n+5"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Ders Açıklaması -->
        <div class="course-description" :class="{ expanded: isDescriptionExpanded }">
          <div class="section-title">
            <div class="ornament"></div>
            <h3>Ders-i Şerif Tafsîlâtı</h3>
            <div class="ornament"></div>
          </div>
          <div class="description-content" v-html="course.description"></div>
          <button 
            v-if="!isDescriptionExpanded" 
            class="show-more-btn"
            @click="isDescriptionExpanded = true"
          >
            <i class="fas fa-chevron-down"></i>
            Tafsilâtın Tamamını Gör
          </button>
        </div>

        <!-- Kayıt Formu -->
        <form @submit.prevent="handleSubmit" class="registration-form">
          <div class="form-group">
            <label>
              <i class="fas fa-user"></i>
              Talebe İsm-i Şerifi:
            </label>
            <input 
              type="text" 
              :value="fullName"
              disabled
            >
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-envelope"></i>
              Berîd-i Elektrikî:
            </label>
            <input 
              type="email" 
              :value="userStore.getUserData?.email"
              disabled
            >
          </div>

          <!-- Taahhütname -->
          <div class="commitment-section">
            <div class="section-title">
              <div class="ornament"></div>
              <h3>Taahhüdnâme-i Talebe</h3>
              <div class="ornament"></div>
            </div>
            <div class="commitment-content">
              <div class="bismillah">﷽</div>
              <p class="commitment-text">
                Ben, <span class="highlight">{{ fullName }}</span> olarak işbu taahhüdnâme ile:
              </p>
              <ul class="commitment-list">
                <li>Derslerime muntazaman devam edeceğime,</li>
                <li>Müderrisimin talimatlarına harfiyen riayet edeceğime,</li>
                <li>İlm-i şerifin kıymetini bileceğime,</li>
                <li>Öğrendiklerimi hayır yolunda kullanacağıma,</li>
                <li>Mekteb-i âlinin nizamına uyacağıma,</li>
                <li>İlim tahsilinde gayret göstereceğime,</li>
              </ul>
              <p class="commitment-text">
                söz verdiğimi beyan ederim.
              </p>
              <div class="commitment-footer">
                <div class="seal"></div>
                <p class="date">{{ currentDate }}</p>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              <i class="fas fa-scroll"></i>
              {{ loading ? 'Kayd ediliyor...' : 'Taahhüdnâmeyi İmzala ve Kayd Ol' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toast-notification';
import { doc, updateDoc, arrayUnion, addDoc, collection } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);
const userStore = useUserStore();
const $toast = useToast();
const loading = ref(false);
const isDescriptionExpanded = ref(false);

const fullName = computed(() => {
  const userData = userStore.getUserData;
  return userData ? `${userData.firstname || ''} ${userData.lastname || ''}`.trim() : '';
});

const currentDate = computed(() => {
  return format(new Date(), 'dd MMMM yyyy', { locale: tr });
});

async function handleSubmit() {
  try {
    loading.value = true;
    const userId = userStore.getUserData.uid;
    const currentDate = new Date();
    
    // Kayıt dokümanı oluştur
    const registrationData = {
      userId,
      courseId: props.course.id,
      courseName: props.course.title,
      studentName: fullName.value,
      email: userStore.getUserData.email,
      registrationDate: currentDate,
      lastAccessed: currentDate,
      progress: 0,
      currentPage: 0,
      status: 'active',
      course: {
        id: props.course.id,
        title: props.course.title,
        category: props.course.category,
        img: props.course.img,
        description: props.course.description,
        content: props.course.content
      }
    };

    // Firestore'a kaydet
    const docRef = await addDoc(collection(db, 'registeredStudents'), registrationData);

    // Kullanıcının kurslarına ekle
    await updateDoc(doc(db, 'users', userId), {
      enrolledCourses: arrayUnion(props.course.id)
    });

    $toast.success('Derse kaydınız başarıyla tamamlandı!');
    emit('close');
  } catch (error) {
    console.error('Registration error:', error);
    $toast.error('Kayıt sırasında bir hata oluştu');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)),
              url('@/assets/pattern1.jpg') center/cover;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98)),
              url('@/assets/pattern1.jpg') center/cover;
  border: 3px solid #DAA520;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(218, 165, 32, 0.3),
              0 0 60px rgba(128, 0, 32, 0.2);
  animation: modalPop 0.3s ease-out;
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('@/assets/pattern1.jpg') center/cover;
  opacity: 0.1;
  pointer-events: none;
}

.modal-inner {
  position: relative;
  padding: 2rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.title-ornament {
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, #DAA520, transparent);
  margin: 0 1rem;
}

.title-ornament.right {
  transform: scaleX(-1);
}

.modal-header h2 {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 2rem;
  margin: 0;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  color: #800020;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #DAA520;
  transform: scale(1.1);
}

.course-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(218, 165, 32, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(218, 165, 32, 0.3);
}

.image-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  position: relative;
  z-index: 1;
}

.image-border {
  position: absolute;
  top: 8px;
  left: 8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid #DAA520;
  border-radius: 4px;
}

.info-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
}

.category {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.4rem;
  margin: 0;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-label {
  color: #666;
  font-family: 'Amiri', serif;
}

.rating-stars {
  color: #DAA520;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.ornament {
  width: 50px;
  height: 2px;
  background: linear-gradient(to right, transparent, #DAA520, transparent);
  margin: 0 1rem;
}

.course-description {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid #DAA520;
  position: relative;
  overflow: hidden;
  max-height: 300px;
  transition: all 0.5s ease;
}

.course-description.expanded {
  max-height: none;
}

.description-content {
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
  padding-bottom: 2rem;
}

.description-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.95));
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.course-description.expanded .description-content::after {
  opacity: 0;
}

.show-more-btn {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(128, 0, 32, 0.1);
  border: 1px solid rgba(128, 0, 32, 0.2);
  padding: 0.5rem 2rem;
  color: #800020;
  font-family: 'Amiri', serif;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.show-more-btn:hover {
  background: rgba(128, 0, 32, 0.2);
  transform: translateX(-50%) translateY(-2px);
}

.registration-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #DAA520;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  background: rgba(255, 255, 255, 0.9);
}

.form-group input:disabled {
  background: rgba(218, 165, 32, 0.1);
  cursor: not-allowed;
}

.commitment-section {
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid #DAA520;
  border-radius: 8px;
  position: relative;
}

.bismillah {
  text-align: center;
  font-size: 2rem;
  color: #800020;
  margin-bottom: 1.5rem;
}

.commitment-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.commitment-list li {
  padding: 0.5rem 0 0.5rem 2rem;
  position: relative;
  color: #333;
  font-family: 'Amiri', serif;
}

.commitment-list li::before {
  content: '❖';
  position: absolute;
  left: 0.5rem;
  color: #DAA520;
}

.commitment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
}

.seal {
  width: 60px;
  height: 60px;
  background: url('@/assets/seal.png') center/contain no-repeat;
  opacity: 0.8;
}

.date {
  font-family: 'Amiri', serif;
  color: #666;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  background: linear-gradient(45deg, #800020, #9a0026);
  color: #F5E6CA;
  border: none;
  border-radius: 4px;
  padding: 1.2rem 2.5rem;
  font-family: 'Amiri', serif;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(128, 0, 32, 0.2);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #9a0026, #800020);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(128, 0, 32, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.highlight {
  color: #800020;
  font-weight: bold;
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 1rem;
  }

  .modal-inner {
    padding: 1.5rem;
  }

  .course-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .image-container {
    width: 120px;
    height: 120px;
  }

  .commitment-section {
    padding: 1.5rem;
  }

  .title-ornament {
    width: 50px;
  }

  .modal-header h2 {
    font-size: 1.6rem;
  }
}
</style> 