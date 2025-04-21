<template>
  <div class="dashboard-container">
    <!-- Hamburger Menu Button -->
    <button class="menu-toggle" @click="toggleSidebar">
      <i :class="['fas', isOpen ? 'fa-times' : 'fa-bars']"></i>
    </button>

    <main class="main-content" :class="{ 'sidebar-open': isOpen }">
      <RouterView />
    </main>

    <!-- Overlay -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'active': isOpen }"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'active': isOpen }">
      <div class="user-info">
        <div class="user-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <h3>{{ userStore.user.email }}</h3>
        <span class="user-role">{{ userRole }}</span>
      </div>
      
      <nav class="sidebar-nav">
        <RouterLink 
          to="/user/dashboard" 
          class="nav-item" 
          exact-active-class="active"
          @click="closeSidebar"
        >
          <i class="fas fa-book-reader"></i>
          Derslerim
        </RouterLink>
        
        <RouterLink 
          to="/user/dashboard/profile" 
          class="nav-item" 
          exact
          @click="closeSidebar"
        >
          <i class="fas fa-user"></i>
          Ahvâl
        </RouterLink>

        <RouterLink 
          to="/user/dashboard/courses" 
          class="nav-item" 
          exact
          @click="closeSidebar"
        >
          <i class="fas fa-pencil-alt"></i>
          Kurslarım
        </RouterLink>
        
        <template v-if="userStore.user.isAdmin">
          <div class="nav-divider">Müderris İşlemleri</div>
          
          <RouterLink 
            to="/user/dashboard/courses/add" 
            class="nav-item" 
            exact
            @click="closeSidebar"
          >
            <i class="fas fa-plus-circle"></i>
            Ders İhdâs
          </RouterLink>
        </template>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          İcâzet
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isOpen = ref(false)

// Admin (Müderris) kontrolü
const userRole = computed(() => {
  return userStore.isAdmin ? 'Müderris' : 'Talebe'
})

// Kullanıcı tam adı
const fullName = computed(() => {
  const user = userStore.getUserData
  return user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : 'İsimsiz'
})

function toggleSidebar() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeSidebar() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function handleLogout() {
  closeSidebar()
  userStore.signOut()
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(rgba(139, 0, 0, 0.95), rgba(128, 0, 32, 0.95)), url('@/assets/pattern1.png');
  padding-top: 80px;
  position: relative;
}

.menu-toggle {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 1000;
  background: rgba(245, 230, 202, 0.1);
  color: #F5E6CA;
  border: 1px solid rgba(245, 230, 202, 0.2);
  border-radius: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background: rgba(245, 230, 202, 0.15);
  border-color: #F5E6CA;
}

.menu-toggle i {
  font-size: 1.2rem;
  color: #F5E6CA;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(3px);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar {
  position: fixed;
  top: 80px;
  right: -320px;
  width: 320px;
  height: calc(100vh - 80px);
  background: linear-gradient(rgba(139, 0, 0, 0.97), rgba(128, 0, 32, 0.97)), url('@/assets/pattern1.png');
  padding: 2rem 1.5rem;
  z-index: 999;
  overflow-y: auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -4px 0 25px rgba(0, 0, 0, 0.3);
  border-left: 1px solid rgba(245, 230, 202, 0.2);
}

.sidebar.active {
  right: 0;
}

.user-info {
  text-align: center;
  padding: 1.5rem;
  background: rgba(245, 230, 202, 0.05);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(245, 230, 202, 0.1);
  backdrop-filter: blur(5px);
}

.user-avatar {
  width: 85px;
  height: 85px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(45deg, #DAA520, #F5E6CA);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(245, 230, 202, 0.3);
}

.user-avatar i {
  font-size: 2.2rem;
  color: #800020;
}

.user-info h3 {
  color: #F5E6CA;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-family: 'Amiri', serif;
}

.user-role {
  display: inline-block;
  padding: 0.3rem 1rem;
  background: rgba(245, 230, 202, 0.1);
  color: #F5E6CA;
  border-radius: 16px;
  font-size: 0.9rem;
  font-family: 'Amiri', serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(245, 230, 202, 0.2);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1.2rem;
  color: #F5E6CA;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  border: 1px solid transparent;
  margin-bottom: 0.4rem;
  background: rgba(245, 230, 202, 0.05);
}

.nav-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  color: #DAA520;
}

.nav-item:hover {
  background: rgba(245, 230, 202, 0.1);
  border-color: rgba(245, 230, 202, 0.2);
  transform: translateX(-5px);
}

.nav-item.active {
  background: rgba(245, 230, 202, 0.15);
  color: #F5E6CA;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(245, 230, 202, 0.2);
}

.nav-item.active i {
  color: #DAA520;
}

.nav-divider {
  margin: 1.8rem 0 1rem;
  padding: 0.5rem 1rem;
  color: #F5E6CA;
  font-family: 'Amiri', serif;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(245, 230, 202, 0.2);
  font-weight: bold;
  opacity: 0.8;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 2rem;
}

.logout-btn {
  width: 100%;
  padding: 0.9rem;
  background: rgba(245, 230, 202, 0.1);
  color: #F5E6CA;
  border: 1px solid rgba(245, 230, 202, 0.2);
  border-radius: 8px;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(245, 230, 202, 0.15);
  border-color: rgba(245, 230, 202, 0.3);
  transform: translateY(-2px);
}

.logout-btn i {
  font-size: 1.1rem;
}

.main-content {
  flex: 1;
  padding: 2rem 6rem 2rem 2rem;
  position: relative;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;
  }

  .main-content {
    padding: 2rem 4rem 2rem 1rem;
  }
}

/* Scrollbar stilleri */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(245, 230, 202, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(245, 230, 202, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(245, 230, 202, 0.3);
}
</style>
