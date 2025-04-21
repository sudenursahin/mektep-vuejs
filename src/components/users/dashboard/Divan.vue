<template>
  <div class="divan-container">
    <!-- Loading Overlay -->
    <div v-if="enrolledCoursesStore.loading" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner">
          <i class="fas fa-dharmachakra fa-spin"></i>
        </div>
        <span class="loading-text">Dersler Yükleniyor...</span>
      </div>
    </div>

    <!-- Mevcut içerik aynı kalacak -->
    <div :class="{ 'content-blur': enrolledCoursesStore.loading }">
      <div class="section-title">
        <div class="ornament"></div>
        <h2 class="title">Derslerim</h2>
        <div class="ornament"></div>
      </div>

      <!-- Hata durumu -->
      <div v-if="enrolledCoursesStore.error" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="error-text">{{ enrolledCoursesStore.error }}</span>
      </div>

      <!-- Ders yoksa -->
      <div v-else-if="!enrolledCoursesStore.getEnrolledCourses.length" class="empty-state">
        <div class="empty-illustration">
          <i class="fas fa-books"></i>
        </div>
        <h3>Henüz Hiç Dersiniz Bulunmamaktadır</h3>
        <p>Dersler kısmından ilginizi çeken derslere kaydolabilirsiniz.</p>
        <router-link to="/dersler" class="browse-btn">
          <i class="fas fa-search"></i>
          Dersleri İncele
        </router-link>
      </div>

      <!-- Dersler varsa -->
      <div v-else class="courses-grid">
        <div v-for="course in enrolledCoursesStore.getEnrolledCourses" 
             :key="course.courseId" 
             class="course-card">
          <div class="card-content">
            <img :src="course.img" :alt="course.title" class="course-image">
            <div class="course-info">
              <h3>{{ course.title }}</h3>
              <p class="category">{{ course.category }}</p>
              <div class="progress-bar">
                <div class="progress" 
                     :style="{ width: `${course.registrationInfo?.progress || 0}%` }">
                </div>
              </div>
              <p class="progress-text">
                İlerleme: {{ course.registrationInfo?.progress || 0 }}%
              </p>
            </div>
            <button @click="toggleBook(course.courseId)" class="study-btn">
              <i class="fas fa-book-open"></i>
              Çalış
            </button>
          </div>
        </div>
      </div>

      <!-- Book Modal -->
      <div v-if="openBookId" class="book-modal" @click="toggleBook(null)">
        <div class="book-content" @click.stop>
          <div class="book">
            <div class="book-header">
              <h2 class="book-title">{{ getCurrentCourse?.title }}</h2>
            </div>

            <div class="book-pages">
              <div class="page-wrapper" :class="{ 'flipping': isFlipping }">
                <!-- Sol Sayfa -->
                <div class="page left-page">
                  <div class="page-content">
                    <div class="text-content" v-if="getCurrentCourse?.content?.pages">
                      {{ getCurrentCourse.content.pages[currentPage - 1] }}
                    </div>
                    <div class="page-number left">{{ currentPage }}</div>
                  </div>
                </div>

                <!-- Sağ Sayfa -->
                <div class="page right-page">
                  <div class="page-content">
                    <div class="text-content" v-if="getCurrentCourse?.content?.pages">
                      {{ getCurrentCourse.content.pages[currentPage] }}
                    </div>
                    <div class="page-number right">{{ currentPage + 1 }}</div>
                  </div>
                </div>

                <div class="page-shadow"></div>
              </div>
            </div>

            <div class="book-footer">
              <div class="page-controls">
                <button 
                  @click="prevPage" 
                  :disabled="currentPage <= 1"
                  class="page-btn"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="page-number-display">
                  {{ currentPage }}-{{ currentPage + 1 }} / {{ totalPages }}
                </span>
                <button 
                  @click="nextPage" 
                  :disabled="currentPage >= totalPages - 1"
                  class="page-btn"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useEnrolledCoursesStore } from '@/stores/enrolledCourses';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const enrolledCoursesStore = useEnrolledCoursesStore();
const openBookId = ref(null);
const currentPage = ref(1);
const isFlipping = ref(false);
const totalPages = computed(() => {
  return getCurrentCourse.value?.content?.pages?.length || 0;
});
const pageFlipAudio = ref(null);

// Mevcut kursu getir
const getCurrentCourse = computed(() => {
  if (!openBookId.value) return null;
  return enrolledCoursesStore.getCourseById(openBookId.value);
});

// Verileri izle
watch(() => enrolledCoursesStore.getEnrolledCourses, (courses) => {
  console.log('Enrolled Courses:', courses);
  console.log('Course Content Example:', courses?.[0]?.content);
}, { immediate: true });

// Loading durumunu izle
watch(() => enrolledCoursesStore.loading, (isLoading) => {
  console.log('Loading state:', isLoading);
}, { immediate: true });

// Hata durumunu izle
watch(() => enrolledCoursesStore.error, (error) => {
  if (error) console.error('Store error:', error);
}, { immediate: true });

// Tarihi formatla
function formatDate(date) {
  if (!date) return 'Belirtilmemiş';
  return format(date.toDate(), 'dd MMMM yyyy', { locale: tr });
}

function toggleBook(courseId) {
  if (courseId) {
    currentPage.value = 1;
    openBookId.value = courseId;
  } else {
    openBookId.value = null;
  }
}

onMounted(() => {
  // Sayfa çevirme sesini yükle
  pageFlipAudio.value = new Audio('/sounds/page-flip.mp3');
});

async function flipPage(direction) {
  if (isFlipping.value) return;

  isFlipping.value = true;
  
  // Ses efektini çal
  try {
    await pageFlipAudio.value.play();
  } catch (error) {
    console.error('Ses çalınamadı:', error);
  }

  setTimeout(() => {
    if (direction === 'next') {
      currentPage.value++;
    } else {
      currentPage.value--;
    }
    isFlipping.value = false;
    enrolledCoursesStore.updateCourseProgress(openBookId.value, currentPage.value);
  }, 500);
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    flipPage('next');
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    flipPage('prev');
  }
}

onMounted(async () => {
  console.log('Divan component mounted');
  await enrolledCoursesStore.fetchEnrolledCourses();
  console.log('Courses fetched:', enrolledCoursesStore.getEnrolledCourses);
});
</script>

<style scoped>
.divan-container {
  padding: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.title {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.ornament {
  height: 2px;
  width: 100px;
  background: linear-gradient(to right, transparent, #DAA520, transparent);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  border: 2px solid #DAA520;
}

.empty-illustration {
  font-size: 4rem;
  color: #DAA520;
  margin-bottom: 2rem;
}

.empty-state h3 {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #800020;
  color: #F5E6CA;
  border: none;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  margin-top: 2rem;
}

.browse-btn:hover {
  background: #9a0026;
  transform: translateY(-2px);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.course-card {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #DAA520;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 1rem;
}

.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.course-info {
  padding: 1rem 0;
}

.progress-bar {
  height: 8px;
  background: rgba(128, 0, 32, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress {
  height: 100%;
  background: #DAA520;
  transition: width 0.3s ease;
}

.study-btn {
  width: 100%;
  padding: 1rem;
  background: #800020;
  color: #F5E6CA;
  border: none;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.study-btn:hover {
  background: #9a0026;
}

/* Modal Styles */
.book-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.book-content {
  width: 95%;
  max-width: 1800px;
  height: 92vh;
  position: relative;
}

.book {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #F5E6CA;
  border-radius: 20px;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.8);
}

.book-header {
  padding: 1rem;
  text-align: center;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.book-pages {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.page-wrapper {
  position: relative;
  transform-style: preserve-3d;
  perspective: 2000px;
  width: 100%;
  height: 100%;
  display: flex;
}

.page {
  flex: 1;
  height: 100%;
  background: url('@/assets/paper-texture.png') repeat;
  background-size: cover;
  background-blend-mode: multiply;
  background-color: #F5E6CA;
  padding: 3rem;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.left-page {
  border-right: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 15px 0 0 15px;
  transform-origin: right center;
}

.right-page {
  border-left: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 15px 15px 0;
  transform-origin: left center;
  transition: transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  backface-visibility: hidden;
}

.page-wrapper.flipping .right-page {
  transform: rotateY(-180deg);
}

.page-shadow {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.page-wrapper.flipping .page-shadow {
  opacity: 1;
  animation: shadowMove 1.5s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
}

@keyframes shadowMove {
  0% {
    opacity: 0;
    transform: skewX(0deg) translateX(0);
  }
  20% {
    opacity: 0.3;
    transform: skewX(-20deg) translateX(-10px);
  }
  50% {
    opacity: 1;
    transform: skewX(-30deg) translateX(-20px);
  }
  80% {
    opacity: 0.3;
    transform: skewX(-20deg) translateX(-10px);
  }
  100% {
    opacity: 0;
    transform: skewX(0deg) translateX(0);
  }
}

/* Sayfa kenarları için gölgeler */
.page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 5%,
    transparent 95%,
    rgba(0, 0, 0, 0.1) 100%
  );
  pointer-events: none;
}

.text-content {
  color: #2C1810;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.1);
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  line-height: 2;
  text-align: justify;
}

.page-number {
  font-family: 'Amiri', serif;
  color: #8B4513;
  font-style: italic;
  font-size: 1.2rem;
  opacity: 0.8;
  position: absolute;
  bottom: 2rem;
}

.page-number.left {
  left: 3rem;
}

.page-number.right {
  right: 3rem;
}

.book-footer {
  padding: 1.5rem;
  background: rgba(245, 230, 202, 0.98);
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 20px 20px;
}

.page-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3rem;
}

.page-btn {
  background: #800020;
  color: #F5E6CA;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.page-btn:hover:not(:disabled) {
  background: #600018;
  transform: scale(1.1);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number-display {
  font-family: 'Amiri', serif;
  color: #800020;
  font-size: 1.4rem;
  font-style: italic;
  font-weight: bold;
}

@media (max-width: 768px) {
  .book-content {
    width: 100%;
    height: 100vh;
  }

  .book {
    border-radius: 0;
  }

  .page {
    padding: 2rem;
  }

  .text-content {
    font-size: 1.2rem;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 0, 32, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner i {
  font-size: 4rem;
  color: #DAA520;
  animation: spin 2s linear infinite;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}

.loading-text {
  color: #F5E6CA;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.content-blur {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Spinner animasyonu için alternatif stil */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.spinner i {
  animation: spin 2s linear infinite, pulse 1.5s ease-in-out infinite;
}

.error-state {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  border: 2px solid #800020;
  margin: 2rem auto;
  max-width: 600px;
}

.error-state i {
  font-size: 3rem;
  color: #800020;
  margin-bottom: 1rem;
}

.error-text {
  display: block;
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.2rem;
  margin-top: 1rem;
}
</style> 