<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <div class="brand-logo">
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#1e3a5f" />
            <path d="M18 8L30 18v10H22v-7h-8v7H6V18L18 8Z" fill="#c9a84c" />
          </svg>
        </div>
        <span class="brand-text">Real Estate</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/" class="nav-link" active-class="active">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink to="/transactions" class="nav-link" active-class="active">
        <span class="nav-icon">🤝</span>
        <span>İşlemler</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="authStore.user">
        <div class="user-avatar">
          {{ authStore.user.fullName.charAt(0).toUpperCase() }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ authStore.user.fullName }}</span>
          <span class="user-role">{{ authStore.user.role === 'AGENCY' ? 'Acente' : 'Danışman' }}</span>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <span class="nav-icon">🚪</span> Çıkış Yap
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--color-primary);
}

.sidebar-nav {
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: var(--color-bg);
  color: var(--color-primary);
}

.nav-link.active {
  background-color: rgba(30, 58, 95, 0.05);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.user-role {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--color-danger);
  font-weight: 500;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background 0.2s;
  text-align: left;
}

.logout-btn:hover {
  background-color: #fff5f5;
}
</style>
