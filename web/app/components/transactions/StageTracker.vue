<template>
  <div class="stage-tracker">
    <div 
      v-for="(stage, index) in steps" 
      :key="stage.id" 
      class="step"
      :class="{ 
        'active': currentStageIndex === index,
        'completed': currentStageIndex > index 
      }"
    >
      <div class="step-indicator">
        <div class="circle">
          <span v-if="currentStageIndex > index">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="line" v-if="index < steps.length - 1"></div>
      </div>
      <div class="step-content">
        <h4>{{ stage.label }}</h4>
        <p>{{ stage.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ currentStage: string }>()

const steps = [
  { id: 'agreement', label: '1. Sözleşme İmzası', desc: 'Alıcı ve satıcı arası ön protokol.' },
  { id: 'earnest_money', label: '2. Kapora Ödemesi', desc: 'Güvence bedelinin alınması.' },
  { id: 'title_deed', label: '3. Tapu Devri', desc: 'Resmi işlemler ve devir.' },
  { id: 'completed', label: '4. Tamamlandı', desc: 'Komisyon onayı ve dosyanın kapanması.' }
]

const currentStageIndex = computed(() => {
  return steps.findIndex(s => s.id === props.currentStage)
})
</script>

<style scoped>
.stage-tracker {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  gap: 1.25rem;
  position: relative;
  min-height: 80px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  z-index: 2;
  transition: all 0.3s ease;
}

.line {
  width: 2px;
  height: calc(100% - 32px);
  background-color: var(--color-border);
  margin-top: 4px;
  margin-bottom: 4px;
}

.step-content {
  padding-bottom: 2rem;
}

.step-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: color 0.3s ease;
}

.step-content p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  opacity: 0.8;
}

/* Active Step */
.step.active .circle {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.1);
}

.step.active .step-content h4 {
  color: var(--color-primary);
}

/* Completed Step */
.step.completed .circle {
  border-color: var(--color-success);
  background-color: var(--color-success);
  color: white;
}

.step.completed .line {
  background-color: var(--color-success);
}

.step.completed .step-content h4 {
  color: var(--color-text);
}
</style>
