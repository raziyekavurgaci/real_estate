<template>
  <div>
    <LayoutAppHeader title="İşlemler" />
    
    <main class="page-content">
      <div class="action-bar">
        <h2 class="title">Tüm İşlemler</h2>
        <NuxtLink to="/transactions/new" class="btn btn-primary">
          <span class="icon">+</span> Yeni Satış Başlat
        </NuxtLink>
      </div>

      <div class="loading-state" v-if="txStore.loading && txStore.transactions.length === 0">
        <div class="alert">İşlemler sunucudan yükleniyor...</div>
      </div>
      
      <div class="error-state alert alert-error" v-else-if="txStore.error">
        {{ txStore.error }}
      </div>

      <div class="card overflow-x-auto" v-else>
        <table class="data-table">
          <thead>
            <tr>
              <th>Mülk Adı</th>
              <th>Aşama</th>
              <th>Satış Fiyatı</th>
              <th>İlan Sahibi</th>
              <th>Satışı Yapan</th>
              <th>Hizmet Bedeli</th>
              <th>Detay</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="txStore.transactions.length === 0">
              <td colspan="7" class="text-center text-muted p-8">Sistemde henüz bir işlem bulunmuyor.</td>
            </tr>
            <tr v-for="tx in txStore.transactions" :key="tx._id">
              <td>
                <div class="property-info">
                  <span class="property-title">{{ tx.listing?.title }}</span>
                  <span class="property-loc">{{ tx.listing?.location }}</span>
                </div>
              </td>
              <td>
                <TransactionsStageBadge :stage="tx.stage" />
              </td>
              <td>{{ formatCurrency(tx.listing?.price || 0) }}</td>
              <td>{{ tx.listingAgent?.fullName }}</td>
              <td>{{ tx.sellingAgent?.fullName }}</td>
              <td class="font-semibold">{{ formatCurrency(tx.totalServiceFee) }}</td>
              <td>
                <NuxtLink :to="`/transactions/${tx._id}`" class="btn btn-outline btn-sm">İncele</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransactionsStore } from '~/stores/transactions'

definePageMeta({ layout: 'default' })
useHead({ title: 'İşlemler — Real Estate' })

const txStore = useTransactionsStore()

onMounted(() => {
  txStore.fetchTransactions()
})

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.page-content {
  padding: 2rem;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.action-bar .title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.overflow-x-auto {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: #f8fafc;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background-color: rgba(30, 58, 95, 0.02);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.property-info {
  display: flex;
  flex-direction: column;
}

.property-title {
  font-weight: 600;
  color: var(--color-text);
}

.property-loc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.font-semibold {
  font-weight: 600;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.p-8 { padding: 2rem; }
.text-center { text-align: center; }
.text-muted { color: var(--color-text-muted); }
.alert { padding: 1rem; color: var(--color-text-muted); }
</style>
