<template>
  <div>
    <LayoutAppHeader title="İşlem Detayı" />
    
    <main class="page-content" v-if="txStore.currentTransaction">
      
      <div class="top-nav">
        <NuxtLink to="/transactions" class="back-link">← İşlemlere Dön</NuxtLink>
      </div>

      <div class="content-grid">
        <!-- Sol Panel: Bilgiler -->
        <div class="info-panel">
          <div class="card property-card">
            <div class="card-header">
              <h3>Mülk Bilgileri</h3>
              <TransactionsStageBadge :stage="txStore.currentTransaction.stage" />
            </div>
            <div class="card-body">
              <h2 class="prop-title">{{ txStore.currentTransaction.listing?.title }}</h2>
              <p class="prop-loc">📍 {{ txStore.currentTransaction.listing?.location }}</p>
              <div class="prop-price">Satış Fiyatı: <strong>{{ formatCurrency(txStore.currentTransaction.listing?.price || 0) }}</strong></div>
            </div>
          </div>

          <div class="agents-grid">
            <div class="card agent-card">
              <h4 class="text-muted">📝 İlan Sahibi (Listing)</h4>
              <p class="agent-name">{{ txStore.currentTransaction.listingAgent?.fullName }}</p>
              <p class="agent-email">{{ txStore.currentTransaction.listingAgent?.email }}</p>
            </div>
            <div class="card agent-card">
              <h4 class="text-muted">🤝 Satışı Kapatan (Selling)</h4>
              <p class="agent-name">{{ txStore.currentTransaction.sellingAgent?.fullName }}</p>
              <p class="agent-email">{{ txStore.currentTransaction.sellingAgent?.email }}</p>
            </div>
          </div>

          <TransactionsCommissionCard :transaction="txStore.currentTransaction" class="mt-6" />
        </div>

        <!-- Sağ Panel: Aşama Takibi -->
        <div class="tracker-panel">
          <div class="card tracker-card">
            <h3 class="tracker-title">Aşama Takibi</h3>
            
            <TransactionsStageTracker :currentStage="txStore.currentTransaction.stage" />

            <div class="action-footer mt-6 pt-6 border-t" v-if="txStore.currentTransaction.stage !== 'completed'">
              <div v-if="txStore.error" class="alert alert-error mb-4">{{ txStore.error }}</div>
              
              <button 
                class="btn btn-primary w-full" 
                @click="advanceStage" 
                :disabled="txStore.loading"
              >
                <span v-if="txStore.loading">Güncelleniyor...</span>
                <span v-else>Sonraki Aşamaya Geç ({{ getNextStageLabel(txStore.currentTransaction.stage) }})</span>
              </button>
            </div>
            
            <div class="action-footer mt-6 pt-6 border-t text-center" v-else>
              <div class="alert alert-success">
                🎉 Dosya kapandı ve komisyon onaylandı!
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="page-content" v-else-if="txStore.loading">
      <div class="alert">İşlem detayları yükleniyor...</div>
    </div>
    <div class="page-content" v-else>
      <div class="alert alert-error">İşlem verisi bulunamadı veya yetkiniz yok.</div>
      <NuxtLink to="/transactions" class="btn btn-outline mt-4">Geri Dön</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTransactionsStore } from '~/stores/transactions'

const route = useRoute()
const txStore = useTransactionsStore()

definePageMeta({ layout: 'default' })
useHead({ title: 'İşlem Detay — Real Estate' })

const txId = route.params.id as string

onMounted(async () => {
  if (txId) {
    await txStore.fetchTransactionById(txId)
  }
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

const STAGES = ['agreement', 'earnest_money', 'title_deed', 'completed']
const STAGE_LABELS: Record<string, string> = {
  'agreement': 'Sözleşme İmzası',
  'earnest_money': 'Kapora Ödemesi',
  'title_deed': 'Tapu Devri',
  'completed': 'Tamamlandı'
}

const getNextStageLabel = (currentStage: string) => {
  const currentIndex = STAGES.indexOf(currentStage)
  if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
    const nextKey = STAGES[currentIndex + 1] as keyof typeof STAGE_LABELS
    return STAGE_LABELS[nextKey]
  }
  return ''
}

const advanceStage = async () => {
  if (!txStore.currentTransaction) return
  
  const currentStage = txStore.currentTransaction.stage
  const currentIndex = STAGES.indexOf(currentStage)
  
  if (currentIndex !== -1 && currentIndex < STAGES.length - 1) {
    const nextStage = STAGES[currentIndex + 1] as string
    await txStore.updateStage(txId, nextStage)
  }
}
</script>

<style scoped>
.page-content {
  padding: 2rem;
}

.top-nav {
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: var(--color-primary);
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* Sol Panel */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.property-card {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-muted);
}

.prop-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem 0;
}

.prop-loc {
  color: var(--color-text-muted);
  margin: 0 0 1rem 0;
}

.prop-price {
  font-size: 1.1rem;
  background: var(--color-bg);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: inline-block;
}

.prop-price strong {
  color: var(--color-primary);
  margin-left: 0.5rem;
}

.agents-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.agent-card {
  padding: 1.25rem;
}

.agent-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  font-weight: 600;
}

.agent-name {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--color-text);
}

.agent-email {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Sağ Panel */
.tracker-card {
  padding: 1.5rem;
  position: sticky;
  top: 100px;
}

.tracker-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.mb-4 { margin-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.pt-6 { padding-top: 1.5rem; }
.border-t { border-top: 1px solid var(--color-border); }
.text-sm { font-size: 0.875rem; }
.text-center { text-align: center; }
.w-full { width: 100%; }

/* Responsive */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
