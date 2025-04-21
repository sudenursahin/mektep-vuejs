import { defineStore } from 'pinia'
import router from '@/router'
import { db } from '@/utils/firebase.js'
import { collection, getDoc, doc, setDoc, updateDoc, serverTimestamp, query, orderBy, getDocs,
    limit, startAfter, deleteDoc, addDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user.js'

const coursesCollection = collection(db, 'courses')

export const useCourseStore = defineStore('courses', {
    state: () => ({
        homeCourses: '',
        adminCourses: '',
        adminLastVisible: '',
        courses: [],
        loading: false,
        error: null
    }),

    getters: {

    },
    actions: {
        async addCourse(formData) {
            try {
                const userStore = useUserStore()
                const user = userStore.getUserData

                if (!user || !user.isAdmin) {
                    throw new Error('Bu işlem için yetkiniz yok')
                }

                const newCourse = doc(coursesCollection)
                const courseData = {
                    ...formData,
                    timestamp: serverTimestamp(),
                    owner: {
                        uid: user.uid,
                        email: user.email,
                        isAdmin: user.isAdmin
                    }
                }

                await setDoc(newCourse, courseData)
                
                router.push({
                    path: '/user/dashboard/courses',
                    query: { reload: 'true' }
                })

                return newCourse.id
            } catch (error) {
                console.error('Error details:', error)
                throw error
            }
        },

        async adminGetCourses(docLimit) {
            const q = query(coursesCollection, orderBy('timestamp', 'desc'), limit(docLimit));
            const querySnapshot = await getDocs(q);

            const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1]
           

            const courses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() // kursları güncelleme silme işlemleri için bun ihtiyacımız var
            }));
            this.adminCourses = courses;
            this.adminLastVisible = lastVisible
        },

        async deleteCourse(courseId) {
            try {
                await deleteDoc(doc(coursesCollection, courseId))
                // Silinen kursu state'den kaldır
                this.adminCourses = this.adminCourses.filter(course => course.id !== courseId)
            } catch (error) {
                console.error('Error deleting course:', error)
                throw error
            }
        },

        async updateCourse(courseId, formData) {
            try {
                const userStore = useUserStore()
                const user = userStore.getUserData

                if (!user || !user.isAdmin) {
                    throw new Error('Bu işlem için yetkiniz yok')
                }

                // Debug için
                console.log('Updating course:', courseId)
                console.log('Update data:', formData)

                const courseRef = doc(coursesCollection, courseId)
                
                // id ve createdAt alanlarını çıkar
                const { id, createdAt, ...updateData } = formData

                await updateDoc(courseRef, {
                    ...updateData,
                    updatedAt: serverTimestamp(),
                    lastUpdatedBy: {
                        uid: user.uid,
                        email: user.email
                    }
                })

                // Debug için
                console.log('Course updated successfully')

                return courseId
            } catch (error) {
                console.error('Error updating course:', error)
                throw error
            }
        },

        async getCourse(id) {
            try {
                const docRef = doc(db, 'courses', id)
                const docSnap = await getDoc(docRef)
                
                if (docSnap.exists()) {
                    return { id: docSnap.id, ...docSnap.data() }
                } else {
                    throw new Error('Ders bulunamadı')
                }
            } catch (error) {
                throw new Error('Ders yüklenirken hata oluştu: ' + error.message)
            }
        },

        async fetchCourses() {
            try {
                this.loading = true
                const querySnapshot = await getDocs(collection(db, 'courses'))
                this.courses = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            } catch (error) {
                this.error = error.message
                throw new Error('Dersler yüklenirken hata oluştu: ' + error.message)
            } finally {
                this.loading = false
            }
        }
    }
})
