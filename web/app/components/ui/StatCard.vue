<template>
  <div class="stat-card card">
    <div class="stat-icon-wrapper" :style="{ backgroundColor: iconBg }">
      <span class="stat-icon">{{ icon }}</span>
    </div>
    <div class="stat-info">
      <h3 class="stat-title">{{ title }}</h3>
      <div class="stat-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  value: string | number
  icon: string
  iconBg?: string
}>(), {
  iconBg: 'rgba(30, 58, 95, 0.1)'
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 1.75rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}
</style>
