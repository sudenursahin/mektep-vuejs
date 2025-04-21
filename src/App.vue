<template>
<div>
  <div class="text-center" v-if="loading">
    <v-progress-linear indeterminate color="primary" />
  </div>
  <div v-else>
    <Header />
    <router-view />
  </div>
</div>
</template>

<script setup>
import Header from './components/navigation/Header.vue'
import { useRouter } from 'vue-router';
import { firstLoad } from './composables/auth.js';
import { ref } from 'vue';

const loading = ref(false);
</script>

<style scoped>
/* Navbar stilleri Header.vue'ya taşındı */
</style>




