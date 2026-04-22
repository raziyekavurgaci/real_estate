<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
// Sayfa yenilendiğinde localStorage'dan session'ı geri yükle
authStore.hydrate()
</script>
