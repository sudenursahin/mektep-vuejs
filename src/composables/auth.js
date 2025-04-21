import { ref } from 'vue';
import {auth , db} from '@/utils/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import {useUserStore} from '@/stores/user.js';


export const firstLoad=() =>{
    const userStore = useUserStore();
    const loading = ref(true);
    onAuthStateChanged(auth, (user) => {
        if(user){
            userStore.autoSignIn(user.uid);
        }
        loading.value = false;
    });
    return {
        loading
    }
}


export const isAuthenticated = (to, from, next) => {
    const userStore = useUserStore()
    
    if (!userStore.auth) {
        next({ name: 'signin' })
    } else {
        next()
    }
}

export const isLoggedIn = (to, from, next) => {
    const userStore = useUserStore()
    
    if (userStore.auth) {
        next({ name: 'mainpage' }) // Eğer giriş yapmışsa dashboard'a yönlendir
    } else {
        next()
    }
}
