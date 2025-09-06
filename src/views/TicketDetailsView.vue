<template>
  <div class="ticket-detail">
    <!-- Header -->
    <div class="ticket-header">
      <div class="header-content">
        <div class="ticket-info">
          <div class="breadcrumb">
            <router-link to="/" class="breadcrumb-link">Tickets</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">#{{ ticket.ticketId }}</span>
          </div>
          <h1 class="ticket-title">{{ ticket.title }}</h1>
          <div class="ticket-meta">
            <span
              class="priority-badge"
              :class="getPriorityClass(ticket.priority)"
            >
              {{ ticket.priority }}
            </span>
            <span
              class="status-badge"
              :class="getStatusClass(ticket.status)"
            >
              {{ ticket.status }}
            </span>
            <span class="ticket-id">#{{ ticket.ticketId }}</span>
            <span class="created-date">Created {{ ticket.createdAt }}</span>
          </div>
        </div>
        <div class="header-actions">
          <button
            v-if="ticket.status !== 'Resolved'"
            @click="markAsResolved"
            class="btn-resolve"
            :disabled="isResolving"
          >
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isResolving ? 'Resolving...' : 'Mark as Resolved' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ticket-content">
      <!-- Ticket Details Sidebar -->
      <div class="ticket-sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">Ticket Details</h3>
          <div class="detail-list">
            <div class="detail-item">
              <span class="detail-label">Assignee</span>
              <div class="detail-value">
                <img
                  :src="ticket.assignee.avatar"
                  :alt="ticket.assignee.name"
                  class="assignee-avatar"
                />
                <span>{{ ticket.assignee.name }}</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">Reporter</span>
              <div class="detail-value">
                <img
                  :src="ticket.reporter.avatar"
                  :alt="ticket.reporter.name"
                  class="reporter-avatar"
                />
                <span>{{ ticket.reporter.name }}</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">Department</span>
              <span class="detail-value">{{ ticket.department }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated</span>
              <span class="detail-value">{{ ticket.lastUpdated }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">Activity</h3>
          <div class="activity-list">
            <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
              <img :src="activity.avatar" :alt="activity.user" class="activity-avatar" />
              <div class="activity-content">
                <p class="activity-text">
                  <span class="activity-user">{{ activity.user }}</span>
                  {{ activity.action }}
                </p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section">
        <!-- Original Description -->
        <div class="original-post">
          <div class="comment-header">
            <img :src="ticket.reporter.avatar" :alt="ticket.reporter.name" class="comment-avatar" />
            <div class="comment-info">
              <span class="comment-author">{{ ticket.reporter.name }}</span>
              <span class="comment-time">{{ ticket.createdAt }}</span>
            </div>
            <span class="original-badge">Original Post</span>
          </div>
          <div class="comment-content">
            <p>{{ ticket.description }}</p>
          </div>
        </div>

        <!-- Add Comment Form -->
        <div class="add-comment">
          <div class="comment-form">
            <div class="form-header">
              <img :src="currentUser.avatar" :alt="currentUser.name" class="comment-avatar" />
              <span class="form-title">Add a comment</span>
            </div>
            <div class="form-content">
              <textarea
                v-model="newComment"
                placeholder="Write your comment here..."
                class="comment-textarea"
                rows="4"
                @keydown.ctrl.enter="submitComment"
              ></textarea>
              <div class="form-actions">
                <div class="form-help">
                  <span class="help-text">Ctrl + Enter to submit</span>
                </div>
                <div class="form-buttons">
                  <button
                    @click="cancelComment"
                    class="btn-cancel"
                    :disabled="!newComment.trim()"
                  >
                    Cancel
                  </button>
                  <button
                    @click="submitComment"
                    class="btn-submit"
                    :disabled="!newComment.trim() || isSubmitting"
                  >
                    {{ isSubmitting ? 'Posting...' : 'Comment' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments List -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <img :src="comment.author.avatar" :alt="comment.author.name" class="comment-avatar" />
              <div class="comment-info">
                <span class="comment-author">{{ comment.author.name }}</span>
                <span class="comment-time">{{ comment.createdAt }}</span>
              </div>
              <div class="comment-actions">
                <button class="comment-action-btn">
                  <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="comment-content">
              <p>{{ comment.content }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isResolving = ref(false)
const isSubmitting = ref(false)
const newComment = ref('')

const currentUser = ref({
  id: 1,
  name: 'Sophie Minders',
  avatar: 'https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=SM'
})

const ticket = ref({
  id: 1,
  ticketId: 'MK32',
  title: 'Cannot access the system',
  description: 'Life seasons open have. Air have of. Lights fill after let third darkness replenish fruitful let. Wherein set image. Creepeth said above gathered bring. I am experiencing issues when trying to log into the system. The login page loads but when I enter my credentials, it just shows a loading spinner indefinitely. I have tried clearing my browser cache and using different browsers but the issue persists.',
  priority: 'Urgent',
  status: 'Open',
  createdAt: '3 hours ago',
  lastUpdated: '30 minutes ago',
  department: 'Technical Support',
  assignee: {
    id: 2,
    name: 'Devon Mitchell',
    avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=DM'
  },
  reporter: {
    id: 3,
    name: 'John Customer',
    avatar: 'https://via.placeholder.com/32x32/F59E0B/FFFFFF?text=JC'
  }
})

const comments = ref([
  {
    id: 1,
    content: 'Thank you for reporting this issue. I\'ve started investigating the login system. Can you please provide me with your username and the exact error message you\'re seeing? Also, which browser are you using?',
    createdAt: '2 hours ago',
    author: {
      id: 2,
      name: 'Devon Mitchell',
      avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=DM'
    }
  },
  {
    id: 2,
    content: 'Hi Devon, my username is john.customer@company.com. I don\'t see any error message, just the loading spinner that never stops. I\'ve tested this in Chrome, Firefox, and Safari - same issue in all browsers.',
    createdAt: '1 hour ago',
    author: {
      id: 3,
      name: 'John Customer',
      avatar: 'https://via.placeholder.com/32x32/F59E0B/FFFFFF?text=JC'
    }
  },
  {
    id: 3,
    content: 'I found the issue! There was a problem with the authentication service. I\'ve deployed a fix and the system should be working now. Can you please try logging in again and let me know if you still experience any issues?',
    createdAt: '30 minutes ago',
    author: {
      id: 2,
      name: 'Devon Mitchell',
      avatar: 'https://via.placeholder.com/32x32/10B981/FFFFFF?text=DM'
    }
  }
])

const recentActivity = ref([
  {
    id: 1,
    user: 'Devon Mitchell',
    action: 'added a comment',
    time: '30 min ago',
    avatar: 'https://via.placeholder.com/24x24/10B981/FFFFFF?text=D'
  },
  {
    id: 2,
    user: 'John Customer',
    action: 'added a comment',
    time: '1h ago',
    avatar: 'https://via.placeholder.com/24x24/F59E0B/FFFFFF?text=J'
  },
  {
    id: 3,
    user: 'Devon Mitchell',
    action: 'was assigned to this ticket',
    time: '2h ago',
    avatar: 'https://via.placeholder.com/24x24/10B981/FFFFFF?text=D'
  },
  {
    id: 4,
    user: 'John Customer',
    action: 'created this ticket',
    time: '3h ago',
    avatar: 'https://via.placeholder.com/24x24/F59E0B/FFFFFF?text=J'
  }
])

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'priority-urgent'
    case 'High':
      return 'priority-high'
    case 'Medium':
      return 'priority-medium'
    case 'Low':
      return 'priority-low'
    default:
      return 'priority-default'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'status-open'
    case 'In Progress':
      return 'status-in-progress'
    case 'Resolved':
      return 'status-resolved'
    case 'Closed':
      return 'status-closed'
    default:
      return 'status-default'
  }
}

const markAsResolved = async () => {
  isResolving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    ticket.value.status = 'Resolved'

    // Add activity
    recentActivity.value.unshift({
      id: Date.now(),
      user: currentUser.value.name,
      action: 'marked this ticket as resolved',
      time: 'just now',
      avatar: currentUser.value.avatar
    })
  } catch (error) {
    console.error('Failed to resolve ticket:', error)
  } finally {
    isResolving.value = false
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const comment = {
      id: Date.now(),
      content: newComment.value.trim(),
      createdAt: 'just now',
      author: currentUser.value
    }

    comments.value.push(comment)

    // Add activity
    recentActivity.value.unshift({
      id: Date.now(),
      user: currentUser.value.name,
      action: 'added a comment',
      time: 'just now',
      avatar: currentUser.value.avatar
    })

    newComment.value = ''
  } catch (error) {
    console.error('Failed to submit comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

const cancelComment = () => {
  newComment.value = ''
}

onMounted(() => {
  // Get ticket ID from route params if needed
  const ticketId = route.params.id
  console.log('Loading ticket:', ticketId)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.ticket-detail {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.ticket-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 2rem;
}

.header-content {
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #8b5cf6;
}

.breadcrumb-separator {
  color: #d1d5db;
}

.breadcrumb-current {
  color: #374151;
  font-weight: 500;
}

.ticket-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.ticket-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.priority-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.priority-urgent {
  background: #fef2f2;
  color: #dc2626;
}

.priority-high {
  background: #fef3c7;
  color: #d97706;
}

.priority-medium {
  background: #eff6ff;
  color: #2563eb;
}

.priority-low {
  background: #f0fdf4;
  color: #16a34a;
}

.status-open {
  background: #eff6ff;
  color: #2563eb;
}

.status-in-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-resolved {
  background: #f0fdf4;
  color: #16a34a;
}

.status-closed {
  background: #f3f4f6;
  color: #374151;
}

.ticket-id,
.created-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-resolve {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #16a34a;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-resolve:hover:not(:disabled) {
  background: #15803d;
}

.btn-resolve:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Main Content */
.ticket-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 20rem;
  gap: 2rem;
}

/* Sidebar */
.ticket-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.assignee-avatar,
.reporter-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.activity-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 0.75rem;
  color: #374151;
  margin: 0;
  line-height: 1.4;
}

.activity-user {
  font-weight: 500;
}

.activity-time {
  font-size: 0.65rem;
  color: #6b7280;
  margin: 0.125rem 0 0 0;
}

/* Comments Section */
.comments-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.original-post,
.comment {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.comment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.comment-author {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.comment-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.original-badge {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.comment-actions {
  margin-left: auto;
}

.comment-action-btn {
  background: none;
  border: none;
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.comment-action-btn:hover {
  color: #6b7280;
}

.action-icon {
  width: 1rem;
  height: 1rem;
}

.comment-content {
  color: #374151;
  line-height: 1.6;
}

.comment-content p {
  margin: 0;
}

/* Add Comment Form */
.add-comment {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.comment-form {
  padding: 1.5rem;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-title {
  font-weight: 500;
  color: #111827;
}

.comment-textarea {
  width: 100%;
  min-height: 6rem;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  font-family: inherit;
}

.comment-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.help-text {
  font-size: 0.75rem;
  color: #6b7280;
}

.form-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-cancel {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
}

.btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .ticket-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .ticket-sidebar {
    order: 2;
    grid-row: 1;
  }

  .comments-section {
    order: 1;
    grid-row: 2;
  }
}

@media (max-width: 768px) {
  .ticket-header {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .btn-resolve,
  .btn-secondary {
    flex: 1;
    justify-content: center;
  }

  .ticket-content {
    padding: 1rem;
    gap: 1rem;
  }

  .ticket-title {
    font-size: 1.5rem;
  }

  .ticket-meta {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .header-actions {
    flex-direction: column;
  }

  .ticket-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comment-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .original-badge {
    order: -1;
    width: 100%;
    text-align: center;
  }
}
</style>
