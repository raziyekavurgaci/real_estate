<template>
  <header class="header">
    <div class="header-left">
      <h1 class="page-title">{{ title }}</h1>
    </div>
    <div class="header-right">
      <div class="notifications">
        <button class="icon-btn">
          <span class="icon">🔔</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.header {
  height: 80px;
  padding: 0 2rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--color-bg);
  border-color: var(--color-primary-light);
}

.icon {
  font-size: 1.2rem;
}
</style>
