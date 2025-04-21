<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="courses"
      :loading="loading"
      class="ottoman-table elevation-1"
    >
      <template #[`item.timestamp`]="{ item }">
        {{ new Date(item.timestamp?.toDate()).toLocaleDateString('tr-TR') }}
      </template>

      <template #[`item.owner`]="{ item }">
        {{ item.owner?.firstName }} {{ item.owner?.lastName }}
      </template>

      <template #[`item.rating`]="{ item }">
        {{ item.rating }}/5
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="action-buttons">
          <v-btn 
            class="ottoman-btn edit-btn" 
            icon 
            small
            @click="handleEditCourse(item.id)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn 
            class="ottoman-btn delete-btn" 
            icon 
            small
            @click="handleDeleteCourse(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>

      <template #no-data>
        Henüz kurs bulunmamaktadır.
      </template>

      <template #loading>
        Kurslar yükleniyor...
      </template>
    </v-data-table>

    <v-btn 
      class="ottoman-btn load-btn mt-4" 
      @click="handleLoadMore"
      :loading="loadingMore"
      :disabled="loadingMore"
    >
      {{ loadingMore ? 'Yükleniyor...' : 'Daha Fazla Ders Getir' }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCourseStore } from '@/stores/courses'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const route = useRoute()
const courseStore = useCourseStore()
const $toast = useToast()
const loading = ref(false)
const loadingMore = ref(false)

// Computed property for courses
const courses = computed(() => courseStore.adminCourses || [])

// Table headers - Firestore yapısına uygun olarak güncellendi
const headers = ref([
  { text: 'Kategori', value: 'category', align: 'center' },
  { text: 'Başlık', value: 'title', align: 'center' },
  { text: 'Yazar', value: 'owner', align: 'center' },
  { text: 'Seviye', value: 'rating', align: 'center' },
  { text: 'Oluşturulma', value: 'timestamp', align: 'center' },
  { text: 'İşlemler', value: 'actions', align: 'center', sortable: false }
])

// İlk yükleme ve yeniden yükleme kontrolü
onMounted(async () => {
  if (!courseStore.adminCourses || route.query.reload) {
    try {
      loading.value = true
      await courseStore.adminGetCourses(10)
      
      // Reload query'i temizle
      if (route.query.reload) {
        router.replace({ query: {} })
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      $toast.error('Kurslar yüklenirken bir hata oluştu!')
    } finally {
      loading.value = false
    }
  }

  // URL'den başarı mesajını kontrol et
  if (route.query.success === 'true') {
    $toast.success(route.query.message || 'İşlem başarılı')
  }
})

// Handle course deletion
const handleDeleteCourse = async (id) => {
  try {
    if (confirm('Bu kursu silmek istediğinizden emin misiniz?')) {
      loading.value = true
      await courseStore.deleteCourse(id)
      $toast.success('Kurs başarıyla silindi!')
    }
  } catch (error) {
    console.error('Error deleting course:', error)
    $toast.error('Kurs silinirken bir hata oluştu!')
  } finally {
    loading.value = false
  }
}

// Handle course update
const handleEditCourse = (courseId) => {
  router.push(`/user/dashboard/courses/edit/${courseId}`)
}

// Daha fazla kurs yükleme
const handleLoadMore = async () => {
  if (loadingMore.value) return
  
  try {
    loadingMore.value = true
    await courseStore.adminGetCourses(5)
    $toast.success('Yeni dersler yüklendi')
  } catch (error) {
    console.error('Error loading more courses:', error)
    $toast.error('Daha fazla kurs yüklenirken bir hata oluştu!')
  } finally {
    loadingMore.value = false
  }
}

// Carousel verileri
const carouselSlides = [
  {
    src: 'https://example.com/slide1.jpg',
    title: 'Osmanlı İlimleri',
    subtitle: 'Asırlık bilgeliği keşfedin'
  },
  // ... diğer slaytlar
]
</script>

<style scoped>
.ottoman-table {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border: 3px solid #DAA520 !important;
  border-radius: 12px;
  font-family: 'Amiri', serif;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.ottoman-table :deep(th) {
  background-color: #800020 !important;  /* Bordo arka plan */
  color: #000000 !important;  /* Siyah yazı */
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  text-align: center !important;
  border-bottom: 2px solid #DAA520 !important;
  padding: 16px 8px !important;
  letter-spacing: 0.5px !important;
}

.ottoman-table :deep(.v-data-table-header) {
  background-color: #800020 !important;  /* Header arka planı bordo */
}

.ottoman-table :deep(.v-data-table-header th span) {
  color: #000000 !important;  /* Span içindeki yazılar siyah */
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  font-family: 'Amiri', serif !important;
}

.ottoman-table :deep(td) {
  color: #4A0011 !important;  /* Daha koyu bordo */
  font-size: 1.2rem !important;
  font-weight: 500 !important;
  text-align: center !important;
  background-color: rgba(255, 255, 255, 0.7) !important;
  padding: 12px 8px !important;
}

.ottoman-btn {
  font-family: 'Amiri', serif !important;
  margin: 5px;
  font-size: 1rem !important;
  border-radius: 4px !important;
}

.delete-btn {
  background-color: #800020 !important;
  color: #F5E6CA !important;
}

.edit-btn {
  background-color: #DAA520 !important;
  color: #800020 !important;
}

.load-btn {
  background-color: #800020 !important;
  color: #F5E6CA !important;
  margin-top: 20px !important;
  min-width: 200px !important;
  height: 45px !important;
}

.load-btn.v-btn--loading {
  opacity: 0.8;
  background-color: #600018 !important;
}

.load-btn :deep(.v-progress-circular) {
  color: #F5E6CA !important;
}

/* Hover efektleri */
.ottoman-table :deep(tr:hover) td {
  background-color: rgba(218, 165, 32, 0.1) !important;
}

.ottoman-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.ottoman-btn.edit-btn {
  background-color: #DAA520 !important;
  color: #800020 !important;
  min-width: 35px !important;
  height: 35px !important;
}

.ottoman-btn.delete-btn {
  background-color: #800020 !important;
  color: #F5E6CA !important;
  min-width: 35px !important;
  height: 35px !important;
}

.ottoman-btn.edit-btn:hover,
.ottoman-btn.delete-btn:hover {
  transform: scale(1.1);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-text {
  color: #000000 !important;
}

.ottoman-carousel {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(128, 0, 32, 0.2)
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.carousel-title {
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.carousel-subtitle {
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  max-width: 600px;
}

/* Carousel okları için stil */
:deep(.v-carousel__controls) {
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 20px;
}

:deep(.v-btn--icon) {
  background: rgba(218, 165, 32, 0.2) !important;
  color: #DAA520 !important;
}

:deep(.v-btn--icon:hover) {
  background: rgba(218, 165, 32, 0.4) !important;
}
</style>