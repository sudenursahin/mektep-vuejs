<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="navbar-brand">
        Mektep
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">
          <i class="fas fa-home"></i> Dârü'l-fünûn
        </router-link>
        <router-link to="/dersler" class="nav-link">
          <i class="fas fa-book"></i> Dersler
        </router-link>
        <router-link to="/muderrisler" class="nav-link">
          <i class="fas fa-chalkboard-teacher"></i> Müderrisler
        </router-link>
      </div>

      <div class="auth-buttons">
        <template v-if="!userStore.isAuthenticated">
          <router-link to="/signin" class="auth-btn login">
            Hücre-i Tedrîs
          </router-link>
        </template>
        <template v-else>
          <router-link to="/user/dashboard" class="auth-btn dashboard">
            Dîvân
          </router-link>
          <button @click="userStore.signOut" class="auth-btn logout">
            İcâzet
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: transparent;
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 80px;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(128, 0, 32, 0.85);
  backdrop-filter: blur(8px);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 1.8rem;
  text-decoration: none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  text-shadow: 2px 2px 8px rgba(218, 165, 32, 0.5),
               0 0 20px rgba(218, 165, 32, 0.4);
  transform: translateY(-1px);
}

.logo {
  height: 40px;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #DAA520 !important;
  text-decoration: none;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.8;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #DAA520;
  transition: width 0.3s ease;
}

.nav-link:hover {
  opacity: 1;
  transform: translateY(-2px);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
}

.nav-link i {
  color: #DAA520;
  font-size: 1.2rem;
  opacity: 0.9;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-btn {
  white-space: nowrap;
  padding: 0.7rem 1.5rem;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(218, 165, 32, 0.7);
  border-radius: 8px;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  background: transparent;
  margin-left: 15px;
}

.auth-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(218, 165, 32, 0.2),
    transparent
  );
  transition: 0.5s;
}

.auth-btn:hover::before {
  left: 100%;
}

.login, .dashboard {
  color: #DAA520;
  background: rgba(218, 165, 32, 0.1);
}

.login:hover, .dashboard:hover {
  background: rgba(218, 165, 32, 0.2);
  transform: translateY(-2px);
  border-color: #DAA520;
}

.logout {
  background: rgba(218, 165, 32, 0.8);
  color: #800020;
  margin-left: 10px;
}

.logout:hover {
  background: #DAA520;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    height: auto;
    padding: 1rem;
  }

  .navbar-content {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .auth-buttons {
    margin-left: auto;
  }

  .nav-links {
    display: none;
  }

  .navbar-brand {
    font-size: 1.5rem;
  }

  .auth-btn {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }
}

/* Aktif link için özel stil */
.nav-link.router-link-active {
  color: #F5E6CA !important;
  opacity: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.nav-link.router-link-active::after {
  width: 100%;
  background: #DAA520;
  box-shadow: 0 0 8px rgba(218, 165, 32, 0.5);
}
</style>

<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>