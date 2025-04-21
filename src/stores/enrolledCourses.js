import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useUserStore } from './user';

export const useEnrolledCoursesStore = defineStore('enrolledCourses', () => {
  const userStore = useUserStore();
  const enrolledCourses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const getEnrolledCourses = computed(() => enrolledCourses.value);
  const getCourseById = computed(() => (courseId) => 
    enrolledCourses.value.find(course => course.courseId === courseId)
  );

  // Actions
  async function fetchEnrolledCourses() {
    try {
      loading.value = true;
      error.value = null;

      if (!userStore.getUserData?.uid) return;

      const registrationQuery = query(
        collection(db, 'registeredStudents'),
        where('userId', '==', userStore.getUserData.uid)
      );
      
      const registrationSnapshot = await getDocs(registrationQuery);
      
      if (registrationSnapshot.empty) {
        enrolledCourses.value = [];
        return;
      }

      enrolledCourses.value = registrationSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          registrationId: doc.id, // Kayıt dokümanının ID'si
          courseId: data.courseId,
          ...data.course,
          registrationInfo: {
            registrationDate: data.registrationDate,
            lastAccessed: data.lastAccessed,
            progress: data.progress || 0,
            status: data.status,
            currentPage: data.currentPage || 0
          }
        };
      });

    } catch (err) {
      error.value = err.message;
      console.error('Error fetching enrolled courses:', err);
    } finally {
      loading.value = false;
    }
  }

  async function updateCourseProgress(courseId, newPage) {
    try {
      const course = enrolledCourses.value.find(c => c.courseId === courseId);
      if (!course) return;

      const progress = Math.round((newPage + 1) / (course.content?.totalPages || 1) * 100);

      // Firestore'u güncelle
      await updateDoc(doc(db, 'registeredStudents', course.registrationId), {
        progress,
        lastAccessed: new Date(),
        currentPage: newPage
      });

      // Yerel state'i güncelle
      const courseIndex = enrolledCourses.value.findIndex(c => c.courseId === courseId);
      if (courseIndex !== -1) {
        enrolledCourses.value[courseIndex].registrationInfo = {
          ...enrolledCourses.value[courseIndex].registrationInfo,
          progress,
          lastAccessed: new Date(),
          currentPage: newPage
        };
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error updating course progress:', err);
    }
  }

  return {
    enrolledCourses,
    loading,
    error,
    getEnrolledCourses,
    getCourseById,
    fetchEnrolledCourses,
    updateCourseProgress
  };
}); 