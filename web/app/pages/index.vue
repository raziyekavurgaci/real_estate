<template>
  <div>
    <LayoutAppHeader title="Dashboard" />
    
    <main class="page-content">
      <div class="welcome-section">
        <h2>Hoş Geldin, <span class="highlight">{{ authStore.user?.fullName }}</span></h2>
        <p>İşlemlerin ve komisyon kazançların aşağıda özetlenmiştir.</p>
      </div>

      <!-- Stat Kartları -->
      <div class="stats-grid">
        <UiStatCard 
          title="Aktif İşlemler" 
          :value="loadingStats ? '...' : activeTransactions" 
          icon="📊" 
          iconBg="#e6f2ff" 
        />
        <UiStatCard 
          title="Tamamlanan" 
          :value="loadingStats ? '...' : completedTransactions" 
          icon="✅" 
          iconBg="#e6fffa" 
        />
        <UiStatCard 
          v-if="authStore.isAgency"
          title="Toplam Komisyon Havuzu" 
          :value="loadingStats ? '...' : totalCommission" 
          icon="💰" 
          iconBg="#fffbee" 
        />
        <UiStatCard 
          v-else
          title="Kazanılan Komisyon" 
          :value="loadingStats ? '...' : totalCommission" 
          icon="💸" 
          iconBg="#f0fff4" 
        />
      </div>

      <!-- Yaklaşan İşlemler Önizlemesi -->
      <div class="recent-section card mt-6">
        <div class="recent-header">
          <h3>Son Aktiviteler</h3>
          <NuxtLink to="/transactions" class="view-all">Tümünü Gör</NuxtLink>
        </div>
        <div class="recent-body">
          <p class="empty-state text-muted">Şimdilik buralar sessiz. İşlemler API'den yüklendiğinde burada listelenecek.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

definePageMeta({ layout: 'default' })
useHead({ title: 'Dashboard — Real Estate' })

const authStore = useAuthStore()
const api = useApi()

const activeTransactions = ref(0)
const completedTransactions = ref(0)
const totalCommission = ref('0')
const loadingStats = ref(true)

onMounted(async () => {
  if (!import.meta.client) return
  try {
    const stats = await api.get<{ active: number; completed: number; totalEarned: number }>(
      '/transactions/stats'
    )
    activeTransactions.value = stats.active
    completedTransactions.value = stats.completed
    totalCommission.value = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(stats.totalEarned)
  } catch (e) {
    console.error('Stats yüklenemedi:', e)
  } finally {
    loadingStats.value = false
  }
})
</script>

<style scoped>
.page-content {
  padding: 2rem;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.welcome-section p {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.highlight {
  color: var(--color-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.mt-6 {
  margin-top: 1.5rem;
}

.recent-section {
  padding: 1.5rem;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.recent-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.view-all {
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  padding: 2rem 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
