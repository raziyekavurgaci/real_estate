<template>
  <div class="auth-wrapper">
    <div class="auth-card card">
      <!-- Logo / Başlık -->
      <div class="auth-header">
        <div class="auth-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#1e3a5f" />
            <path d="M18 8L30 18v10H22v-7h-8v7H6V18L18 8Z" fill="#c9a84c" />
          </svg>
        </div>
        <h1 class="auth-title">Hesap Oluştur</h1>
        <p class="auth-subtitle">Real Estate Yönetim Paneli</p>
      </div>

      <!-- Hata / Başarı mesajı -->
      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <!-- Form -->
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">Ad Soyad</label>
          <input
            id="register-fullname"
            v-model="form.fullName"
            type="text"
            class="form-input"
            placeholder="Ahmet Yılmaz"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">E-posta</label>
          <input
            id="register-email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="ornek@email.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Şifre</label>
          <input
            id="register-password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
            autocomplete="new-password"
          />
        </div>

        <!-- Rol Seçimi -->
        <div class="form-group">
          <label class="form-label">Hesap Türü</label>
          <div class="role-selector">
            <button
              type="button"
              class="role-option"
              :class="{ active: form.role === 'AGENCY' }"
              @click="form.role = 'AGENCY'"
            >
              <span class="role-icon">🏢</span>
              <span class="role-name">Acente</span>
              <span class="role-desc">Birden fazla danışman yönetin</span>
            </button>
            <button
              type="button"
              class="role-option"
              :class="{ active: form.role === 'AGENT' }"
              @click="form.role = 'AGENT'"
            >
              <span class="role-icon">👤</span>
              <span class="role-name">Danışman</span>
              <span class="role-desc">Bireysel satış danışmanı</span>
            </button>
          </div>
        </div>

        <button id="register-submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading">Kayıt yapılıyor...</span>
          <span v-else>Kayıt Ol</span>
        </button>
      </form>

      <!-- Giriş linki -->
      <p class="auth-footer">
        Zaten hesabın var mı?
        <NuxtLink to="/login" class="auth-link">Giriş Yap</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Kayıt Ol — Real Estate' })

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  role: 'AGENT' as 'AGENCY' | 'AGENT',
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await authStore.signup(form)
    router.push('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err?.data?.message || 'Kayıt başarısız. Lütfen tekrar deneyin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5282 50%, #1a202c 100%);
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.auth-logo {
  margin-bottom: 0.25rem;
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
}

.auth-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

/* Rol seçici */
.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.role-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 0.625rem;
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.role-option:hover {
  border-color: var(--color-primary-light);
}

.role-option.active {
  border-color: var(--color-primary);
  background: rgba(30, 58, 95, 0.05);
}

.role-icon {
  font-size: 1.5rem;
}

.role-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.role-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.w-full {
  width: 100%;
  margin-top: 0.375rem;
  padding: 0.75rem;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.auth-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
