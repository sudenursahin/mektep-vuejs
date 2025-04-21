import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import SignIn from '../components/users/SignIn.vue'
import MainPage from '../components/users/dashboard/MainPage.vue'
import Profile from '../components/users/dashboard/Profile.vue'
import Courses from '../components/users/dashboard/admin/Courses.vue'
import AddCourse from '../components/users/dashboard/admin/AddCourse.vue'
import EditCourse from '../components/users/dashboard/admin/EditCourse.vue'
import Müderrisler from '../components/Müderrisler.vue'
import Dersler from '../components/Dersler.vue'
import Divan from '../components/users/dashboard/Divan.vue'
import { isAuthenticated, isLoggedIn } from '../composables/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      beforeEnter: isLoggedIn
    },
    {
      path: '/user/dashboard',
      name: 'mainpage',
      component: MainPage,
      beforeEnter: isAuthenticated,
      children: [ // nested routes
        {
          path: '',
          component: Divan,
          name: 'dashboard'
        },
        {
          path: 'profile',
          component: Profile,
          name: 'profile'
        },
        {
          path: 'courses',
          component: Courses,
          name: 'courses'
        },
        {
          path: 'courses/add',
          component: AddCourse,
          name: 'add-course'
        },
        {
          path: 'courses/edit/:id',
          component: EditCourse,
          name: 'edit-course'
        }
      ]
    },
    {
      path: '/dersler',
      component: Dersler,
      name: 'dersler'
    },
    {
      path: '/muderrisler',
      component: Müderrisler,
      name: 'müderrisler'
    },
    {
      path: '/admin/courses',
      name: 'AdminCourses',
      component: () => import('@/components/users/dashboard/admin/Courses.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
})

// Navigation Guards ekleyebiliriz
router.beforeEach((to, from, next) => {
  // Auth kontrolleri burada yapılabilir
  next()
})

export default router
