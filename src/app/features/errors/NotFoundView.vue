<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app.store'

const appStore = useAppStore()
const router = useRouter()

const query = router.currentRoute.value.query

const goBack = () => {
  if (query.redirect) router.push({ name: `${query.redirect}` })
  else router.back()
}

const goHome = () => {
  router.push(appStore.homeRoute) // Assuming '/' is your home route
}

onMounted(() => {
  // Optional: Add more complex animations using JavaScript if needed
})
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="container mx-auto px-4 text-center animate-fade-in">
      <div class="text-6xl font-bold text-blue-500 mb-8 animate-slide-up">404</div>
      <h1 class="text-3xl font-semibold mb-4 animate-slide-up delay-100">
        {{ $t('features.errors.404NotFound.title') }}
      </h1>
      <p class="text-gray-400 mb-8 animate-slide-up delay-200">
        {{ $t('features.errors.404NotFound.message') }}
      </p>
      <div class="flex justify-center space-x-4 animate-slide-up delay-300">
        <PrimeButton
          @click="goBack()"
          class="transition duration-300"
          text
          :label="!!query.name ? $t(`${query.name}`) : $t('features.errors.404NotFound.goBack')"
        />

        <PrimeButton
          @click="goHome"
          class="transition duration-300"
          :label="$t('features.errors.404NotFound.goHome')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations (can be moved to a global CSS file if needed) */
.animate-fade-in {
  animation: fadeIn 1s ease-in-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.7s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
