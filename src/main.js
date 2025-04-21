import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


// toast
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

// firebase
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase'

// vuetifyj
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// vee-validate
import { configure, defineRule } from 'vee-validate';
import { required, email } from '@vee-validate/rules';

const vuetify = createVuetify({
  components,
  directives,
})

// Kuralları tanımla
defineRule('required', required);
defineRule('email', email);

// Türkçe mesajlar
configure({
    generateMessage: (context) => {
        const messages = {
            required: 'Bu alan zorunludur',
            email: 'Geçerli bir e-posta adresi giriniz'
        };
        return messages[context.rule.name];
    }
});

let app;

onAuthStateChanged(auth, () => {
    if (!app) {
        app = createApp(App);
        
        app.use(vuetify);
        app.use(router);
        app.use(createPinia());
        app.use(ToastPlugin);
        
        app.mount('#app');
    }
});
