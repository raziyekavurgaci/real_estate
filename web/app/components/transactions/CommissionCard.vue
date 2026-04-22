<template>
  <div class="commission-card card">
    <div class="card-header">
      <h3>Komisyon Dağılımı</h3>
      <div class="total-fee">
        <span>Toplam Hizmet Bedeli</span>
        <strong>{{ formatCurrency(transaction.totalServiceFee) }}</strong>
      </div>
    </div>
    
    <div class="breakdown-list" v-if="transaction.commission">
      <div class="breakdown-item agency">
        <span class="label">🏢 Acente Payı (%50)</span>
        <span class="value">{{ formatCurrency(transaction.commission.agencyShare) }}</span>
      </div>
      
      <div class="breakdown-item agent">
        <span class="label">📝 İlanı Veren (Listing) Payı</span>
        <span class="value">{{ formatCurrency(transaction.commission.listingAgentShare) }}</span>
      </div>
      
      <div class="breakdown-item agent" v-if="transaction.commission.sellingAgentShare > 0">
        <span class="label">🤝 Satışı Yapan (Selling) Payı</span>
        <span class="value">{{ formatCurrency(transaction.commission.sellingAgentShare) }}</span>
      </div>
    </div>
    <div v-else class="pending-calc text-muted text-sm mt-4 text-center">
      Komisyon dağılımı işlem "Tamamlandı" aşamasına geçince hesaplanır.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/stores/transactions'

defineProps<{ transaction: Transaction }>()

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
}
</script>

<style scoped>
.commission-card {
  padding: 1.5rem;
}

.card-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.total-fee {
  display: flex;
  justify-content: space-between;
  background-color: rgba(30, 58, 95, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.total-fee strong {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed var(--color-border);
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item .label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.breakdown-item .value {
  font-weight: 600;
  color: var(--color-text);
}

.agency .value {
  color: var(--color-primary);
}

.agent .value {
  color: var(--color-success);
}
</style>
