<template>
  <div class="home">
    <div class="hero-section">
      <div class="carousel-container">
        <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(image, index) in carouselImages" :key="index" class="carousel-slide">
            <img :src="image.src" :alt="image.alt" />
            <div class="slide-overlay">
              <h2 class="slide-title">{{ image.title }}</h2>
              <p class="slide-description">{{ image.description }}</p>
              <button class="cta-button" @click="$router.push('/dersler')">
                Dersleri Keşfet
              </button>
            </div>
          </div>
        </div>

        <!-- Carousel Navigation -->
        <div class="carousel-nav">
          <button 
            v-for="(_, index) in carouselImages" 
            :key="index"
            @click="setSlide(index)"
            :class="['nav-dot', { active: currentSlide === index }]"
          ></button>
        </div>

        <!-- Carousel Arrows -->
        <button class="carousel-arrow left" @click="prevSlide">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="carousel-arrow right" @click="nextSlide">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const carouselImages = [
  {
    src: '/src/assets/caroussel/caro1.png',
    alt: 'Osmanlı Medresesi',
    title: 'Mektep\'e Hoş Geldiniz',
    description: 'İlim yolculuğunuzda size rehberlik etmekten şeref duyarız'
  },
  {
    src: '/src/assets/caroussel/caro2.png',
    alt: 'Osmanlı Kütüphanesi',
    title: 'Kadim Bilgelik',
    description: 'Osmanlı ilim geleneğinin derinliklerine yolculuk'
  },
  {
    src: '/src/assets/caroussel/caro3.png',
    alt: 'Osmanlı Müderrisleri',
    title: 'Müderrisler Meclisi',
    description: 'Geleneksel eğitim metodlarının modern yorumu'
  }
];

const currentSlide = ref(0);
let autoplayInterval;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselImages.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? carouselImages.length - 1 
    : currentSlide.value - 1;
};

const setSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 5000);
});

onBeforeUnmount(() => {
  clearInterval(autoplayInterval);
});
</script>

<style scoped>
.home {
  height: 100vh;
  overflow: hidden;
}

.hero-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) contrast(1.1);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    rgba(128, 0, 32, 0.2),
    rgba(128, 0, 32, 0.5)
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.slide-title {
  color: #DAA520;
  font-family: 'Amiri', serif;
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.slide-description {
  color: #F5E6CA;
  font-family: 'Amiri', serif;
  font-size: 1.5rem;
  max-width: 600px;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
}

.cta-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #DAA520;
  color: #800020;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Amiri', serif;
  font-weight: 500;
}

.cta-button:hover {
  background-color: #c49219;
  transform: translateY(-2px);
}

.carousel-nav {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(218, 165, 32, 0.5);
  border: 2px solid #DAA520;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot.active {
  background: #DAA520;
  transform: scale(1.2);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(128, 0, 32, 0.7);
  color: #DAA520;
  border: 2px solid #DAA520;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-arrow:hover {
  background: rgba(128, 0, 32, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow.left {
  left: 2rem;
}

.carousel-arrow.right {
  right: 2rem;
}

@media (max-width: 768px) {
  .slide-title {
    font-size: 2.5rem;
  }

  .slide-description {
    font-size: 1.2rem;
  }

  .carousel-arrow {
    width: 40px;
    height: 40px;
  }
}
</style>