import { defineStore } from 'pinia'
import { useApi } from '../composables/useApi'

export interface CommissionBreakdown {
  agencyShare: number
  listingAgentShare: number
  sellingAgentShare: number
}

export interface Transaction {
  _id: string
  listing: any
  listingAgent: any
  sellingAgent: any
  stage: 'agreement' | 'earnest_money' | 'title_deed' | 'completed'
  totalServiceFee: number
  commission?: CommissionBreakdown
  createdAt: string
  updatedAt: string
}

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [] as Transaction[],
    currentTransaction: null as Transaction | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchTransactions() {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const res = await api.get<Transaction[]>('/transactions')
        this.transactions = res
      } catch (e: any) {
        this.error = e?.data?.message || 'İşlemler yüklenirken hata oluştu'
      } finally {
        this.loading = false
      }
    },

    async fetchTransactionById(id: string) {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const res = await api.get<Transaction>(`/transactions/${id}`)
        this.currentTransaction = res
        return res
      } catch (e: any) {
        this.error = e?.data?.message || 'İşlem detayı yüklenemedi'
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateStage(id: string, newStage: string) {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const res = await api.patch<Transaction>(`/transactions/${id}/stage`, { stage: newStage })
        if (this.currentTransaction && this.currentTransaction._id === id) {
          this.currentTransaction = res
        }
        return res
      } catch (e: any) {
        this.error = e?.data?.message || 'Aşama güncellenirken hata oluştu. Lütfen bir sonraki sıradaki aşamayı seçin.'
        throw e
      } finally {
        this.loading = false
      }
    },

    async createTransaction(payload: { listingId: string, sellingAgentId: string }) {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const res = await api.post<Transaction>('/transactions', payload)
        this.transactions.push(res)
        return res
      } catch (e: any) {
        this.error = e?.data?.message || 'Yeni işlem başlatılamadı.'
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
