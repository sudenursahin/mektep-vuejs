<template>
  <div class="profile-container">
    <h2 class="page-title">Ahvâl-i Şahsiye</h2>
    
    <form @submit.prevent="handleSubmit" class="profile-form">
      <div class="form-group">
        <label for="firstname">İsm-i Şerif:</label>
        <input 
          type="text" 
          id="firstname"
          v-model="profileData.firstname"
          :placeholder="userStore.getUserData?.firstname || 'İsminizi giriniz...'"
        >
      </div>

      <div class="form-group">
        <label for="lastname">İsm-i Aile:</label>
        <input 
          type="text" 
          id="lastname"
          v-model="profileData.lastname"
          :placeholder="userStore.getUserData?.lastname || 'Soy isminizi giriniz...'"
        >
      </div>

      <div class="form-group">
        <label for="email">Berîd-i Elektrikî:</label>
        <input 
          type="email" 
          id="email"
          v-model="profileData.email"
          :placeholder="userStore.getUserData?.email"
          disabled
        >
      </div>

      <div class="form-group">
        <label for="password">Şifre-i Hümâyûn:</label>
        <div class="password-input">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password"
            v-model="profileData.password"
            placeholder="Yeni şifrenizi giriniz..."
          >
          <button 
            type="button" 
            class="show-password"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="loading">
          <i class="fas fa-save"></i>
          {{ loading ? 'Güncelleniyor...' : 'Tashîh Et' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useToast } from 'vue-toast-notification';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

const userStore = useUserStore();
const $toast = useToast();
const loading = ref(false);
const showPassword = ref(false);

const profileData = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: ''
});

onMounted(() => {
  const userData = userStore.getUserData;
  if (userData) {
    profileData.value = {
      firstname: userData.firstname || '',
      lastname: userData.lastname || '',
      email: userData.email || '',
      password: ''
    };
  }
});

async function handleSubmit() {
  try {
    loading.value = true;
    const user = userStore.user;
    const updates = {};

    // İsim ve soyisim güncellemesi
    if (profileData.value.firstname || profileData.value.lastname) {
      updates.firstname = profileData.value.firstname || userStore.getUserData?.firstname;
      updates.lastname = profileData.value.lastname || userStore.getUserData?.lastname;
      
      await updateDoc(doc(db, 'users', user.uid), updates);
    }

    // Şifre güncellemesi
    if (profileData.value.password) {
      await updatePassword(user, profileData.value.password);
    }

    await userStore.refreshUserData();
    $toast.success('Ahvâl-i şahsiyeniz başarıyla tashîh edildi!');
    
    // Şifre alanını temizle
    profileData.value.password = '';

  } catch (error) {
    console.error('Profile update error:', error);
    $toast.error('Tashîh sırasında bir hata oluştu: ' + error.message);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 3px solid #DAA520;
}

.page-title {
  color: #800020;
  font-family: 'Amiri', serif;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

label {
  color: #800020;
  font-family: 'Amiri', serif;
  font-size: 1.3rem;
}

input {
  padding: 1rem;
  border: 1px solid #DAA520;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  color: #333;
  background-color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

input:disabled {
  background-color: rgba(218, 165, 32, 0.1);
  cursor: not-allowed;
}

input:focus {
  outline: none;
  border-color: #800020;
  box-shadow: 0 0 0 2px rgba(128, 0, 32, 0.1);
}

.password-input {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input input {
  width: 100%;
  padding-right: 3rem;
}

.show-password {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #800020;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.show-password i {
  font-size: 1.2rem;
}

.show-password:hover {
  color: #DAA520;
  transform: translateY(-50%) scale(1.1);
}

.show-password:focus {
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  padding: 1rem 3rem;
  background-color: #800020;
  color: #F5E6CA;
  border: none;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #600018;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 2rem;
    margin: 1rem;
  }
}
</style>