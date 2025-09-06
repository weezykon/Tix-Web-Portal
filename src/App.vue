<template>
  <div class="app">
    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer" v-if="!isAuthPage">
      <div class="footer-container">
        <p class="footer-text">
          &copy; 2025 Tix Customer Support. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { RouterView, useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const isAuthPage = computed(() => {
    return route.path === '/login' || route.path === '/register' || route.path === '/login/agent'
  })

  const profileMenuOpen = ref(false)
  const mobileMenuOpen = ref(false)

  router.afterEach(() => {
    profileMenuOpen.value = false
    mobileMenuOpen.value = false
  })
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Navbar */
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  height: 4rem;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-logo {
  flex-shrink: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.navbar-nav-desktop {
  display: none;
  margin-left: 1.5rem;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0 0.25rem;
  border-bottom: 2px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  height: 4rem;
}

.nav-link:hover {
  color: #374151;
  border-bottom-color: #d1d5db;
}

.nav-link-active {
  border-bottom-color: #6366f1;
  color: #111827;
}

.navbar-actions-desktop {
  display: none;
  margin-left: 1.5rem;
  align-items: center;
  gap: 0.75rem;
}

.notification-btn {
  background: white;
  padding: 0.25rem;
  border-radius: 50%;
  color: #9ca3af;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.notification-btn:hover {
  color: #6b7280;
}

.notification-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6366f1;
}

.profile-dropdown {
  position: relative;
}

.profile-btn {
  max-width: 2rem;
  background: white;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.profile-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6366f1;
}

.avatar {
  height: 2rem;
  width: 2rem;
  border-radius: 50%;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  width: 12rem;
  border-radius: 0.375rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0;
  background: white;
  border: 1px solid #e5e7eb;
  z-index: 50;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

.mobile-menu-btn-container {
  margin-right: -0.5rem;
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #9ca3af;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  color: #6b7280;
  background-color: #f3f4f6;
}

.mobile-menu-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6366f1;
}

/* Mobile menu */
.mobile-menu {
  border-top: 1px solid #e5e7eb;
}

.mobile-nav {
  padding: 0.5rem 0 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  border-left: 4px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  background-color: #f9fafb;
  border-left-color: #d1d5db;
  color: #374151;
}

.mobile-nav-link-active {
  background-color: #eef2ff;
  border-left-color: #6366f1;
  color: #3730a3;
}

.mobile-user-section {
  padding: 1rem 0 0.75rem 0;
  border-top: 1px solid #e5e7eb;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 0.75rem;
}

.mobile-avatar-container {
  flex-shrink: 0;
}

.mobile-avatar {
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;
}

.mobile-user-details {
  flex: 1;
}

.mobile-user-name {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.mobile-user-email {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.mobile-notification-btn {
  margin-left: auto;
  background: white;
  flex-shrink: 0;
  padding: 0.25rem;
  border-radius: 50%;
  color: #9ca3af;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.mobile-notification-btn:hover {
  color: #6b7280;
}

.mobile-notification-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px #6366f1;
}

.mobile-user-menu {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-user-menu-item {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.mobile-user-menu-item:hover {
  color: #374151;
  background-color: #f3f4f6;
}

/* Page Header */
.page-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* Main Content */
.main-content {
  flex: 1;
}

/* Footer */
.footer {
  background: white;
  margin-top: auto;
}

.footer-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.footer-text {
  text-align: center;
  color: #6b7280;
  margin: 0;
}

/* Responsive Design */
@media (min-width: 640px) {
  .navbar-container {
    padding: 0 1.5rem;
  }

  .navbar-nav-desktop {
    display: flex;
  }

  .navbar-actions-desktop {
    display: flex;
  }

  .mobile-menu-btn-container {
    display: none;
  }

  .header-container {
    padding: 1.5rem 1.5rem;
  }

  .footer-container {
    padding: 1.5rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .navbar-container {
    padding: 0 2rem;
  }

  .header-container {
    padding: 1.5rem 2rem;
  }

  .footer-container {
    padding: 1.5rem 2rem;
  }
}
</style>
