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
        <h1 class="auth-title">Giriş Yap</h1>
        <p class="auth-subtitle">Real Estate Yönetim Paneli</p>
      </div>

      <!-- Hata mesajı -->
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Form -->
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">E-posta</label>
          <input
            id="login-email"
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
            id="login-password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <button id="login-submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading">Giriş yapılıyor...</span>
          <span v-else>Giriş Yap</span>
        </button>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Giriş Yap — Real Estate' })

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

// Zaten giriş yapmışsa dashboard'a yönlendir
if (import.meta.client && localStorage.getItem('access_token')) {
  router.push('/')
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push('/')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.'
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
  max-width: 420px;
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
