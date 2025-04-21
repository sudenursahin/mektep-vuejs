<template>
  <div class="courses-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular indeterminate color="#DAA520" size="64" width="6" />
        <span class="loading-text">Dersler Yükleniyor...</span>
      </div>
    </div>

    <div class="content-wrapper">
      <h1 class="page-title">Ulûm-u Osmaniye</h1>
      
      <div class="courses-grid">
        <div v-for="course in courses" :key="course.id" class="course-card">
          <div class="course-image">
            <img 
              :src="course.img || '/default-course-image.jpg'" 
              :alt="course.title"
              @error="e => e.target.src = '/default-course-image.jpg'"
            />
            <div class="course-rating" v-if="course.rating">
              <span v-for="n in Math.min(course.rating, 5)" :key="n" class="star">★</span>
            </div>
          </div>
          
          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-category" v-if="course.category">
              {{ course.category }}
            </div>
            <div class="course-description" v-html="course.description"></div>
            
            <div class="course-footer">
              <span class="course-date">
                {{ formatDate(course.createdAt) }}
              </span>
              <button class="enroll-btn" @click="openRegistration(course)">
                Derse Kayıt
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kayıt modalı -->
    <CourseRegistration 
      v-if="selectedCourse"
      :course="selectedCourse"
      @close="selectedCourse = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import CourseRegistration from './CourseRegistration.vue';

const courses = ref([]);
const loading = ref(true);
const selectedCourse = ref(null);

// Tarih formatı için helper fonksiyon
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = timestamp.toDate();
    return format(date, "'Kayıt:' dd MMMM yyyy", { locale: tr });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

// Description için helper fonksiyon
const truncateDescription = (text, length = 150) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

onMounted(async () => {
  try {
    const q = query(
      collection(db, 'courses'), 
      orderBy('createdAt', 'desc'),
      limit(12)  // Sayfa başına 12 ders
    );
    
    const querySnapshot = await getDocs(q);
    
    courses.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      description: truncateDescription(doc.data().description)
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    loading.value = false;
  }
});

function openRegistration(course) {
  selectedCourse.value = course;
}
</script>

<style scoped>


.courses-container {
  padding: 2rem;
  background: linear-gradient(rgba(139, 0, 0, 0.95), rgba(128, 0, 32, 0.95)), url('@/assets/pattern1.png');
  min-height: 100vh;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-top: 100px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.course-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  border: 2px solid #DAA520;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-rating {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 20px;
}

.star {
  color: #DAA520;
  font-size: 1.2rem;
}

.course-content {
  padding: 1.5rem;
}

.course-title {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.course-category {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-style: italic;
  margin-bottom: 1rem;
}

.course-description {
  color: #333;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-height: 100px;
  overflow: hidden;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(218, 165, 32, 0.3);
}

.course-date {
  color: #666;
  font-size: 0.9rem;
}

.enroll-btn {
  background: #800020;
  color: #F5E6CA;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-family: 'Amiri', serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.enroll-btn:hover {
  background: #600018;
  transform: translateX(5px);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(128, 0, 32, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-text {
  color: #F5E6CA;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .course-card {
    margin: 0 auto;
    max-width: 400px;
  }
}
</style>
