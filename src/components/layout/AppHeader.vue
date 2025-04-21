<template>
  <v-app-bar 
    app 
    class="ottoman-header"
    elevation="1"
  >
    <div class="header-content">
      <router-link to="/" class="brand">
        <img src="@/assets/logo.png" alt="Mektep" class="logo" />
        <span class="brand-text">Mektep</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/" class="nav-link">Ana Sayfa</router-link>
        <router-link to="/courses" class="nav-link">Dersler</router-link>
        <router-link to="/about" class="nav-link">Hakkında</router-link>
        <router-link to="/contact" class="nav-link">İletişim</router-link>
      </nav>

      <div class="auth-buttons">
        <template v-if="!isLoggedIn">
          <router-link to="/signin" class="auth-link">Giriş</router-link>
          <router-link to="/signup" class="auth-link signup">Kayıt</router-link>
        </template>
        <template v-else>
          <router-link to="/user/dashboard" class="auth-link">Divan</router-link>
          <button @click="handleLogout" class="auth-link">Çıkış</button>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped>
.ottoman-header {
  background: linear-gradient(
    to bottom,
    rgba(128, 0, 32, 0.97),
    rgba(128, 0, 32, 0.95)
  ) !important;
  border-bottom: 2px solid #DAA520;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #DAA520;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo {
  height: 40px;
  margin-right: 1rem;
}

.brand-text {
  font-family: 'Amiri', serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #F5E6CA;
  text-decoration: none;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.nav-link:hover {
  background: rgba(218, 165, 32, 0.1);
  color: #DAA520;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-link {
  color: #F5E6CA;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}

.auth-link:hover {
  border-color: #DAA520;
  color: #DAA520;
}

.auth-link.signup {
  background: #DAA520;
  color: #800020;
  font-weight: bold;
}

.auth-link.signup:hover {
  background: #c49519;
  border-color: #c49519;
  color: #800020;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .auth-buttons {
    gap: 0.5rem;
  }
  
  .auth-link {
    padding: 0.5rem 1rem;
  }
}
</style>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const isLoggedIn = computed(() => userStore.isLoggedIn)

async function handleLogout() {
  try {
    await userStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script> 