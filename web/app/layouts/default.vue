<template>
  <div class="layout-wrapper">
    <LayoutAppSidebar />
    <div class="layout-main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Olası taşmaları önler */
}
</style>
