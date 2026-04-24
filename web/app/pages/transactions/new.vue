<template>
  <div>
    <LayoutAppHeader title="Yeni İşlem Başlat" />
    
    <main class="page-content">
      <div class="top-nav">
        <NuxtLink to="/transactions" class="back-link">← İşlemlere Dön</NuxtLink>
      </div>

      <div class="card form-card">
        <div class="card-header">
          <h3>Yeni Satış Formu</h3>
          <p class="text-muted text-sm mt-1">Lütfen satışı gerçekleşecek ilanı ve işlemi yürüten danışmanı seçin.</p>
        </div>
        
        <div class="card-body mt-6">
          <form @submit.prevent="handleSubmit" class="transaction-form">
            
            <div class="form-group">
              <label for="listing" class="form-label">İlan / Mülk</label>
              <select id="listing" v-model="form.listingId" class="form-input" required :disabled="loadingData">
                <option value="" disabled>-- Mülk Seçin --</option>
                <option v-for="listing in listings" :key="listing._id" :value="listing._id">
                  {{ listing.title }} ({{ formatCurrency(listing.price) }}) - {{ listing.location }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="agent" class="form-label">Satışı Yapan Danışman (Selling Agent)</label>
              <select id="agent" v-model="form.sellingAgentId" class="form-input" required :disabled="loadingData">
                <option value="" disabled>-- Danışman Seçin --</option>
                <option v-for="agent in agents" :key="agent._id" :value="agent._id">
                  {{ agent.fullName }} ({{ agent.email }})
                </option>
              </select>
            </div>

            <div v-if="txStore.error" class="alert alert-error">
              {{ txStore.error }}
            </div>

            <div class="form-actions mt-8">
              <button type="submit" class="btn btn-primary" :disabled="txStore.loading || loadingData">
                <span v-if="txStore.loading">Başlatılıyor...</span>
                <span v-else>Satışı Başlat</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from '~/stores/transactions'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })
useHead({ title: 'Yeni İşlem — Real Estate' })

const router = useRouter()
const txStore = useTransactionsStore()
const api = useApi()

const loadingData = ref(true)
const listings = ref<any[]>([])
const agents = ref<any[]>([])

const form = ref({
  listingId: '',
  sellingAgentId: ''
})

onMounted(async () => {
  loadingData.value = true
  try {
    const [listingsRes, agentsRes] = await Promise.all([
      api.get<any[]>('/listings'),
      api.get<any[]>('/users?role=AGENT')
    ])
    listings.value = listingsRes || []
    agents.value = agentsRes || []
  } catch (error) {
    console.error('API Verileri çekilirken hata:', error)
  } finally {
    loadingData.value = false
  }
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}

const handleSubmit = async () => {
  if (!form.value.listingId || !form.value.sellingAgentId) return

  try {
    const newTx = await txStore.createTransaction(form.value)
    if (newTx && newTx._id) {
      router.push(`/transactions/${newTx._id}`)
    }
  } catch (error) {
    // Hata zaten store'da yakalanıp alert içine yansıtılıyor
  }
}
</script>

<style scoped>
.page-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
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

.form-card {
  padding: 2rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.95rem;
}

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.mt-1 { margin-top: 0.25rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.text-sm { font-size: 0.875rem; }
.text-muted { color: var(--color-text-muted); }
.alert { padding: 1rem; border-radius: 0.5rem; }
.alert-error { background-color: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
</style>
