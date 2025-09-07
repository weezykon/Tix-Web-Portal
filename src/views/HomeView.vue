<template>
  <div class="app">
    <!-- Mobile menu button -->
    <button class="mobile-menu-btn" @click="toggleMobileMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-open': isMobileMenuOpen }">
      <div class="sidebar-content">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
              />
            </svg>
          </div>
          <span class="logo-text">Tix</span>
        </div>

        <!-- User Profile -->
        <div class="user-profile">
          <img
            class="user-avatar"
            :src="userProfile.avatar"
            alt="Profile"
          />
          <div class="user-info">
            <p class="user-name">{{ userProfile.name }}</p>
            <p class="user-handle">{{ userProfile.handle }}</p>
          </div>
        </div>
        <nav class="nav">
          <a href="#" class="nav-item nav-item-active">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <span>Tickets</span>
          </a>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Tickets Section -->
      <div class="tickets-section">
        <div class="header">
          <h1 class="page-title">Tickets</h1>
          <button class="btn-primary">New ticket</button>
        </div>

        <!-- Ticket Tabs -->
        <div class="tabs">
          <nav class="tabs-nav">
            <button class="tab-item tab-item-active">All tickets</button>
            <button class="tab-item">Archive</button>
          </nav>
        </div>

        <!-- Tickets List -->
        <div class="tickets-list">
          <div v-if="loading">Loading...</div>
          <div v-if="error">Error: {{ error.message }}</div>
          <div v-if="tickets.length === 0" class="empty-state">
            <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="empty-state-text">No tickets found.</p>
            <p class="empty-state-subtext">It looks like you haven't created any tickets yet.</p>
            <button class="btn-primary empty-state-button">Create your first ticket</button>
          </div>
          <div v-else v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
            <div class="ticket-content">
              <div class="ticket-main">
                <h3 class="ticket-title">{{ ticket.title }}</h3>
                <p class="ticket-description">{{ ticket.description }}</p>

                <div class="ticket-meta">
                  <span class="ticket-id">#{{ ticket.id }}</span>
                  <div class="comments">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{{ ticket.comments.length }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gql } from 'graphql-tag'
import { useQuery } from '@vue/apollo-composable'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const userProfile = ref({
  name: 'Sophie Minders',
  handle: '@sophie',
  avatar: 'https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=SM'
})

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      userProfile.value.name = user.name || 'Guest User'
      userProfile.value.handle = user.handle || `@${user.name?.toLowerCase().replace(/\s/g, '') || 'guest'}`
      userProfile.value.avatar = user.avatar || 'https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=SM'
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e)
    }
  }
})

const TICKETS_QUERY = gql`
  query Tickets {
    tickets {
      description
      id
      status
      title
      assignedAgent {
        name
        id
      }
      user {
        id
        name
      }
      comments {
        content
        id
      }
    }
  }
`

const { result, loading, error } = useQuery(TICKETS_QUERY)

const tickets = computed(() => result.value?.tickets ?? [])
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #8b5cf6;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
}

.mobile-menu-btn span {
  width: 1.5rem;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

/* Sidebar */
.sidebar {
  width: 16rem;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background: #8b5cf6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #f3f4f6;
}

.nav-item-active {
  background-color: #8b5cf6 !important;
  color: white !important;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.user-profile {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
}

.user-handle {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  min-width: 0;
}

.tickets-section {
  flex: 1;
  padding: 2rem;
  min-width: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.btn-primary {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #7c3aed;
}

/* Tabs */
.tabs {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.tabs-nav {
  display: flex;
  gap: 2rem;
  margin-bottom: -1px;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.25rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-item:hover {
  color: #374151;
  border-bottom-color: #d1d5db;
}

.tab-item-active {
  color: #8b5cf6 !important;
  border-bottom-color: #8b5cf6 !important;
}

.tab-badge {
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 20rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-filter:hover {
  background: #f9fafb;
}

.btn-filter svg {
  width: 1rem;
  height: 1rem;
}

/* Tickets List */
.tickets-list {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ticket-card {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ticket-card:last-child {
  border-bottom: none;
}

.ticket-card:hover {
  background: #f9fafb;
}

.ticket-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.ticket-main {
  flex: 1;
  min-width: 0;
}

.ticket-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.ticket-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.ticket-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-urgent {
  background: #fef2f2;
  color: #dc2626;
}

.priority-medium {
  background: #eff6ff;
  color: #2563eb;
}

.priority-low {
  background: #f0fdf4;
  color: #16a34a;
}

.priority-default {
  background: #f3f4f6;
  color: #374151;
}

.ticket-id {
  font-size: 0.875rem;
  color: #6b7280;
}

.comments {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.comments svg {
  width: 1rem;
  height: 1rem;
}

.ticket-time {
  flex-shrink: 0;
}

.ticket-time p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Activity Sidebar */
.activity-sidebar {
  width: 20rem;
  background: white;
  border-left: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 0.875rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.activity-user,
.activity-subject {
  font-weight: 500;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.show-more-btn {
  width: 100%;
  text-align: center;
  color: #8b5cf6;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

.show-more-btn:hover {
  color: #7c3aed;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #6b7280;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.empty-state-subtext {
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.empty-state-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .activity-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: -16rem;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
  }

  .sidebar-open {
    left: 0;
  }

  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .tickets-section {
    padding: 1rem;
    padding-top: 4rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .controls {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-box {
    max-width: none;
  }

  .tabs-nav {
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tab-item {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .ticket-content {
    flex-direction: column;
    gap: 0.75rem;
  }

  .ticket-meta {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .tickets-section {
    padding: 0.75rem;
    padding-top: 4rem;
  }

  .ticket-card {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .ticket-title {
    font-size: 1rem;
  }

  .ticket-description {
    font-size: 0.8rem;
  }
}
</style>
