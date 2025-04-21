import { defineStore } from 'pinia'

import {createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut} from 'firebase/auth'
import { auth , db } from '@/utils/firebase.js'  
import { doc, getDoc, setDoc , updateDoc} from 'firebase/firestore'
import router from '@/router'
import {useToast} from 'vue-toast-notification'
import { fetchSignInMethodsForEmail } from 'firebase/auth'


const $toast = useToast();

const DEFAULT_USER = {
  uid: null,
  email: null,
  firstname: null,
  lastname: null,
  isAdmin: false,
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    auth: false
  }),
  
  getters: {
    getUserData: (state) => state.user,
    isAdmin: (state) => state.user?.isAdmin === true,
    isAuthenticated: (state) => state.auth
  },
  
  actions: {
    setUser(user) {
      this.user = {...this.user, ...user};
      this.auth = true;
    },
    async getUserProfile(uid){
      try{
        const userRef = await getDoc(doc(db,'users',uid));
        return userRef.data();
      }catch (error){
      }
    },
      getUserExists(email){
      const userRef = doc(db,'users',email);
      const userDoc = getDoc(userRef);
      if(userDoc.exists()){
        return true;
      }else{
        return false;
      }
    },
    async signIn(formData) {
      try {
        this.loading = true;
        const response = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        const userData = await this.getUserProfile(response.user.uid);
        if (!userData) {
          throw { 
            code: 'auth/user-not-found',
            message: 'Kullanıcı bilgileri bulunamadı'
          };
        }
        
        this.setUser(userData);
        router.push('/');
        return { success: true };
      } catch (error) {
        // Firebase'in hata kodlarını standardize et
        if (error.code === 'auth/invalid-credential' || 
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/invalid-email') {
          throw { 
            code: 'auth/user-not-found',
            message: 'Email veya şifre hatalı'
          };
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(formData) {
      try {
        this.loading = true;

        // Önce email'in kullanımda olup olmadığını kontrol et
        try {
          const methods = await fetchSignInMethodsForEmail(auth, formData.email);
          if (methods.length > 0) {
            throw {
              code: 'auth/email-already-in-use',
              message: 'Bu email adresi zaten kullanımda'
            };
          }
        } catch (error) {
          if (error.code === 'auth/invalid-email') {
            throw {
              code: 'auth/invalid-email',
              message: 'Geçersiz email adresi'
            };
          }
        }

        // Firebase Auth'a kaydet
        const response = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );

        // Yeni kullanıcı objesi
        const newUser = {
          uid: response.user.uid,
          email: response.user.email,
          isAdmin: false,
          createdAt: new Date()
        };

        // Firestore'a kaydet
        await setDoc(doc(db, 'users', response.user.uid), newUser);
        this.setUser(newUser);
        router.push('/');
        return { success: true };

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          throw {
            code: 'auth/email-already-in-use',
            message: 'Bu email adresi zaten kullanımda'
          };
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async autoSignIn(uid) {
      try {
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          const userData = docSnap.data()
          this.user = { ...userData, uid }
          this.auth = true
        }
      } catch (error) {
        console.error('Auto sign in error:', error)
      }
    },
    async signOut(){
      await signOut(auth);
      this.user = DEFAULT_USER;
      this.auth = false;
      router.push('/');
      $toast.success('Çıkış yapıldı');
    },
    async refreshUserData() {
      try {
        const userDoc = await getDoc(doc(db, 'users', this.user.uid));
        if (userDoc.exists()) {
          this.userData = { ...userDoc.data(), uid: this.user.uid };
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        throw error;
      }
    }
  },
 
})

  