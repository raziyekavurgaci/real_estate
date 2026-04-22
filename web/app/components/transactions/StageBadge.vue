<template>
  <span class="stage-badge" :class="stageClass">
    {{ stageLabel }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ stage: string }>()

const stageClass = computed(() => {
  switch (props.stage) {
    case 'agreement': return 'badge-agreement'
    case 'earnest_money': return 'badge-earnest'
    case 'title_deed': return 'badge-title'
    case 'completed': return 'badge-completed'
    default: return 'badge-default'
  }
})

const stageLabel = computed(() => {
  switch (props.stage) {
    case 'agreement': return 'Sözleşme'
    case 'earnest_money': return 'Kapora'
    case 'title_deed': return 'Tapu'
    case 'completed': return 'Tamamlandı'
    default: return props.stage
  }
})
</script>

<style scoped>
.stage-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-agreement {
  background-color: #fff3cd;
  color: #856404;
}

.badge-earnest {
  background-color: #ffeeba;
  color: #fd7e14;
}

.badge-title {
  background-color: #cce5ff;
  color: #004085;
}

.badge-completed {
  background-color: #d4edda;
  color: #155724;
}

.badge-default {
  background-color: #e2e8f0;
  color: #4a5568;
}
</style>
