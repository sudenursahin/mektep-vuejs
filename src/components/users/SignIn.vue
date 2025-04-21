<template>
    <div class="signInContainer">
        <!-- Loading Overlay -->
        <div v-if="loading" class="loading-overlay">
            <div class="loading-content">
                <v-progress-circular
                    indeterminate
                    color="#DAA520"
                    size="64"
                    width="6"
                ></v-progress-circular>
                <span class="loading-text">{{ isLoginMode ? 'Giriş yapılıyor...' : 'Hesap oluşturuluyor...' }}</span>
            </div>
        </div>

        <!-- Ana Form Container -->
        <div class="signin-container" :class="{ 'blur-content': loading }">
            <div class="form-wrapper">
                <h1>{{ formTitle }}</h1>
                <Form @submit="handleSubmit" :validation-schema="formSchema">
                    <div class="form-group">
                        <Field name="email" rules="required|email" v-slot="{ field, errors }">
                            <input 
                                v-bind="field"
                                type="email" 
                                class="form-control" 
                                placeholder="Email"
                            />
                            <div class="input-alert" v-if="errors.length">
                                {{ errors[0] }}
                            </div>
                        </Field>
                    </div>
                    <div class="form-group">
                        <Field name="password" rules="required" v-slot="{ field, errors }">
                            <input 
                                v-bind="field"
                                type="password" 
                                class="form-control" 
                                placeholder="Şifre"
                            />
                            <div class="input-alert" v-if="errors.length">
                                {{ errors[0] }}
                            </div>
                        </Field>
                    </div>
                    
                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>

                    <button type="submit">
                        {{ isLoginMode ? 'Giriş Yap' : 'Hesap Oluştur' }}
                    </button>

                    <div class="formChange" @click="toggleForm">
                        <span v-if="isLoginMode">
                            Hesabın yoksa, <span class="link-text">Hesap Oluştur</span>
                        </span>
                        <span v-else>
                            Zaten hesabın var mı? <span class="link-text">Giriş Yap</span>
                        </span>
                    </div>
                </Form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Form, Field } from 'vee-validate';
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const router = useRouter();
const userStore = useUserStore();
const errorMessage = ref('');
const $toast = useToast();

const isLoginMode = ref(true);
const loading = computed(() => userStore.loading);
const formTitle = computed(() => isLoginMode.value ? 'Giriş Yap' : 'Hesap Oluştur');

// Eğer zaten giriş yapılmışsa ana sayfaya yönlendir
onMounted(() => {
    if (userStore.isAuthenticated) {
        router.push('/');
    }
});

const toggleForm = () => {
    isLoginMode.value = !isLoginMode.value;
    errorMessage.value = '';
};

const handleSubmit = async (values) => {
    if (loading.value) return;
    errorMessage.value = '';

    try {
        const result = await (isLoginMode.value ? 
            userStore.signIn(values) : 
            userStore.register(values));

        if (result.success) {
            $toast.success(isLoginMode.value ? 'Giriş başarılı' : 'Kayıt başarılı');
        }
    } catch (error) {
        console.log('Auth error:', error);
        
        if (error.code === 'auth/user-not-found' && isLoginMode.value) {
            if (await confirm('Hesap bulunamadı. Yeni hesap oluşturmak ister misiniz?')) {
                isLoginMode.value = false;
                return;
            }
        } else if (error.code === 'auth/email-already-in-use' && !isLoginMode.value) {
            if (await confirm('Bu email zaten kayıtlı. Giriş yapmak ister misiniz?')) {
                isLoginMode.value = true;
                return;
            }
            errorMessage.value = 'Bu email adresi zaten kullanımda. Şifrenizi unuttuysanız sıfırlamayı deneyin.';
        }
        
        errorMessage.value = error.message;
    }
};

const formSchema = yup.object({
    email: yup.string().required('Email alanı zorunludur').email('Geçersiz email adresi'),
    password: yup.string().required('Şifre alanı zorunludur').min(8, 'Şifre en az 8 karakter olmalıdır')
});
</script>

<style scoped>
.signInContainer {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(139, 0, 0, 0.85), rgba(128, 0, 32, 0.85)), url('@/assets/pattern1.png');
  background-size: cover;
  background-position: center;
  padding: 2rem;
}

.Form {
  background-color: rgba(255, 255, 255, 0.95)  ;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
  max-height: 600px;
  position: relative;
  border: 2px solid #DAA520;
}

.Form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/pattern1.png');
  opacity: 0.08;
  pointer-events: none;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}

h1 {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.form-control:focus {
  border-color: #DAA520;
  box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
  outline: none;
}

.input-alert {
  color: #ffffff;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-family: 'Amiri', serif;
  background-color: rgba(139, 0, 0, 0.9);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 4px solid #DAA520;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #DAA520 !important;
  color: #800020 !important;
  border: none;
  border-radius: 4px;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #c49219 !important;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .Form {
    padding: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}

.error-message {
    color: #ffffff;
    background-color: rgba(139, 0, 0, 0.9);
    padding: 0.8rem;
    border-radius: 4px;
    margin: 1rem 0;
    text-align: center;
    border-left: 4px solid #DAA520;
    font-family: 'Amiri', serif;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.formChange {
  margin-top: 1.5rem;
  text-align: center;
  color: #F5E6CA !important;
  cursor: pointer;
  font-family: 'Amiri', serif;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.formChange:hover {
  background: rgba(218, 165, 32, 0.1);
}

.link-text {
  color: #DAA520;
  text-decoration: underline;
  font-weight: bold;
  transition: all 0.3s ease;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.link-text:hover {
  color: #F5E6CA;
  background: rgba(218, 165, 32, 0.2);
  text-decoration: none;
}

/* Loading Overlay Stilleri */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(128, 0, 32, 0.7); /* Bordo tonunda yarı saydam arka plan */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
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
    margin-top: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Form Container Blur Efekti */
.blur-content {
    filter: blur(4px);
    pointer-events: none; /* Loading sırasında form etkileşimini devre dışı bırak */
    transition: filter 0.3s ease;
}

/* Progress Circular Özelleştirme */
:deep(.v-progress-circular) {
    transform: scale(1.5);
}

:deep(.v-progress-circular__overlay) {
    stroke: #DAA520 !important;
}

/* Form Container'ı relative yap */
.signin-container {
    position: relative;
    transition: all 0.3s ease;
}

/* Form Wrapper'ı sabit genişlikte tut */
.form-wrapper {
    width: 400px;
    margin: 0 auto;
}

/* Responsive Tasarım */
@media (max-width: 600px) {
    .form-wrapper {
        width: 90%;
        padding: 1rem;
    }
    
    .loading-text {
        font-size: 1.2rem;
    }
}
</style>
