<template>
  <div class="create-ticket">
    <!-- Header -->
    <div class="ticket-header">
      <div class="header-content">
        <div class="breadcrumb">
          <router-link to="/tickets" class="breadcrumb-link">Tickets</router-link>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">Create New Ticket</span>
        </div>
        <h1 class="page-title">Create New Support Ticket</h1>
        <p class="page-description">
          Describe your issue in detail and attach any relevant files to help us assist you better.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="ticket-content">
      <!-- Create Ticket Form -->
      <div class="ticket-form-section">
        <div class="form-card">
          <form @submit.prevent="submitTicket" class="ticket-form">
            <!-- Subject -->
            <div class="form-group">
              <label for="subject" class="form-label">Subject *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="form-input"
                :class="{ 'form-input-error': errors.subject }"
                placeholder="Brief description of your issue"
                maxlength="100"
                required
              />
              <div class="form-help">
                <span class="char-count">{{ form.subject.length }}/100</span>
              </div>
              <div v-if="errors.subject" class="form-error">{{ errors.subject }}</div>
            </div>

            <!-- Department -->
            <div class="form-group">
              <label for="department" class="form-label">Department *</label>
              <select
                id="department"
                v-model="form.department"
                class="form-select"
                :class="{ 'form-input-error': errors.department }"
                required
              >
                <option value="">Select a department</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="general">General Inquiry</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
              </select>
              <div v-if="errors.department" class="form-error">{{ errors.department }}</div>
            </div>

            <!-- Priority -->
            <div class="form-group">
              <label for="priority" class="form-label">Priority *</label>
              <div class="priority-options">
                <label
                  v-for="priority in priorities"
                  :key="priority.value"
                  class="priority-option"
                  :class="{ 'priority-selected': form.priority === priority.value }"
                >
                  <input
                    type="radio"
                    :value="priority.value"
                    v-model="form.priority"
                    class="priority-radio"
                  />
                  <div class="priority-content">
                    <span
                      class="priority-badge"
                      :class="getPriorityClass(priority.value)"
                    >
                      {{ priority.label }}
                    </span>
                    <span class="priority-description">{{ priority.description }}</span>
                  </div>
                </label>
              </div>
              <div v-if="errors.priority" class="form-error">{{ errors.priority }}</div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="description" class="form-label">Description *</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-textarea"
                :class="{ 'form-input-error': errors.description }"
                placeholder="Please provide a detailed description of your issue, including any error messages, steps to reproduce, and what you expected to happen..."
                rows="6"
                maxlength="2000"
                required
              ></textarea>
              <div class="form-help">
                <span class="char-count">{{ form.description.length }}/2000</span>
              </div>
              <div v-if="errors.description" class="form-error">{{ errors.description }}</div>
            </div>

            <!-- File Attachments -->
            <div class="form-group">
              <label class="form-label">Attachments</label>
              <p class="form-help-text">
                Upload images (PNG, JPG, GIF) or PDF files to help explain your issue. Maximum 5 files, 10MB each.
              </p>

              <!-- File Upload Area -->
              <div
                class="file-upload-area"
                :class="{
                  'file-upload-dragover': isDragOver,
                  'file-upload-error': errors.files
                }"
                @drop.prevent="handleDrop"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                  @change="handleFileSelect"
                  class="file-input-hidden"
                />

                <div class="file-upload-content">
                  <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p class="file-upload-text">
                    <span class="file-upload-action">Click to upload</span> or drag and drop
                  </p>
                  <p class="file-upload-types">PNG, JPG, GIF, PDF up to 10MB each</p>
                </div>
              </div>

              <!-- Uploaded Files List -->
              <div v-if="uploadedFiles.length > 0" class="uploaded-files">
                <div
                  v-for="(file, index) in uploadedFiles"
                  :key="index"
                  class="uploaded-file"
                >
                  <div class="file-info">
                    <div class="file-icon">
                      <svg v-if="file.type.startsWith('image/')" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="file-details">
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                  </div>

                  <!-- Upload Progress -->
                  <div v-if="file.uploading" class="file-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: file.progress + '%' }"
                      ></div>
                    </div>
                    <span class="progress-text">{{ file.progress }}%</span>
                  </div>

                  <!-- Upload Complete -->
                  <div v-else-if="file.uploaded" class="file-status file-success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Uploaded</span>
                  </div>

                  <!-- Remove Button -->
                  <button
                    type="button"
                    @click="removeFile(index)"
                    class="file-remove"
                    :disabled="file.uploading"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="errors.files" class="form-error">{{ errors.files }}</div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <router-link to="/tickets" class="btn-cancel">
                Cancel
              </router-link>
              <button
                type="submit"
                class="btn-submit"
                :disabled="isSubmitting || !isFormValid"
              >
                {{ isSubmitting ? 'Creating Ticket...' : 'Create Ticket' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Help Sidebar -->
      <div class="help-sidebar">
        <div class="help-card">
          <h3 class="help-title">Tips for Better Support</h3>
          <div class="help-tips">
            <div class="help-tip">
              <svg class="help-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4>Be Specific</h4>
                <p>Include error messages, browser version, and steps to reproduce the issue.</p>
              </div>
            </div>

            <div class="help-tip">
              <svg class="help-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h4>Attach Screenshots</h4>
                <p>Visual evidence helps us understand and resolve issues faster.</p>
              </div>
            </div>

            <div class="help-tip">
              <svg class="help-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4>Choose Priority Wisely</h4>
                <p>Help us prioritize by selecting the appropriate urgency level.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="help-card">
          <h3 class="help-title">Response Times</h3>
          <div class="response-times">
            <div class="response-time">
              <span class="priority-badge priority-urgent">Urgent</span>
              <span class="response-text">Within 2 hours</span>
            </div>
            <div class="response-time">
              <span class="priority-badge priority-high">High</span>
              <span class="response-text">Within 8 hours</span>
            </div>
            <div class="response-time">
              <span class="priority-badge priority-medium">Medium</span>
              <span class="response-text">Within 24 hours</span>
            </div>
            <div class="response-time">
              <span class="priority-badge priority-low">Low</span>
              <span class="response-text">Within 48 hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isSubmitting = ref(false)
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

const form = ref({
  subject: '',
  department: '',
  priority: '',
  description: ''
})

const uploadedFiles = ref<Array<{
  name: string
  size: number
  type: string
  file: File
  uploading: boolean
  uploaded: boolean
  progress: number
}>>([])

const errors = ref<Record<string, string>>({})

const priorities = [
  {
    value: 'low',
    label: 'Low',
    description: 'General questions, minor issues'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Standard support requests'
  },
  {
    value: 'high',
    label: 'High',
    description: 'Important issues affecting work'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Critical issues, system down'
  }
]

const isFormValid = computed(() => {
  return form.value.subject.trim() &&
         form.value.department &&
         form.value.priority &&
         form.value.description.trim()
})

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'priority-urgent'
    case 'high':
      return 'priority-high'
    case 'medium':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
    default:
      return 'priority-default'
  }
}

const validateForm = () => {
  errors.value = {}

  if (!form.value.subject.trim()) {
    errors.value.subject = 'Subject is required'
  } else if (form.value.subject.length < 5) {
    errors.value.subject = 'Subject must be at least 5 characters'
  }

  if (!form.value.department) {
    errors.value.department = 'Please select a department'
  }

  if (!form.value.priority) {
    errors.value.priority = 'Please select a priority level'
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
  } else if (form.value.description.length < 20) {
    errors.value.description = 'Description must be at least 20 characters'
  }

  if (uploadedFiles.value.length > 5) {
    errors.value.files = 'Maximum 5 files allowed'
  }

  return Object.keys(errors.value).length === 0
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer?.files) {
    handleFiles(Array.from(event.dataTransfer.files))
  }
}

const handleFiles = (files: File[]) => {
  const maxFiles = 5
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

  // Check total file count
  if (uploadedFiles.value.length + files.length > maxFiles) {
    errors.value.files = `Maximum ${maxFiles} files allowed`
    return
  }

  for (const file of files) {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.value.files = 'Only JPG, PNG, GIF, and PDF files are allowed'
      continue
    }

    // Check file size
    if (file.size > maxSize) {
      errors.value.files = `File "${file.name}" is too large. Maximum size is 10MB`
      continue
    }

    // Add file to upload list
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      uploading: true,
      uploaded: false,
      progress: 0
    }

    uploadedFiles.value.push(fileData)
    simulateUpload(fileData)
  }

  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

type UploadedFile = {
  name: string
  size: number
  type: string
  file: File
  uploading: boolean
  uploaded: boolean
  progress: number
}

const simulateUpload = (fileData: UploadedFile) => {
  const interval = setInterval(() => {
    fileData.progress += Math.random() * 30
    if (fileData.progress >= 100) {
      fileData.progress = 100
      fileData.uploading = false
      fileData.uploaded = true
      clearInterval(interval)
    }
  }, 200)
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
  delete errors.value.files
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitTicket = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Create ticket data
    const ticketData = {
      ...form.value,
      files: uploadedFiles.value.filter(f => f.uploaded),
      createdAt: new Date().toISOString()
    }

    console.log('Creating ticket:', ticketData)

    // Redirect to tickets list or ticket detail
    router.push('/tickets')
  } catch (error) {
    console.error('Failed to create ticket:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.create-ticket {
  background-color: #f9fafb;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.ticket-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem;
}

.header-content {
  max-width: 80rem;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.page-description {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
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

/* Form */
.form-card {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ticket-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input::placeholder,
.form-select::placeholder,
.form-textarea::placeholder {
  color: #6b7280; /* Darker gray for better visibility */
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-input-error {
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical;
  min-height: 8rem;
  line-height: 1.5;
  font-family: inherit;
}

.form-help {
  display: flex;
  justify-content: flex-end;
}

.form-help-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.char-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.form-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Priority Options */
.priority-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.priority-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.priority-option:hover {
  border-color: #d1d5db;
}

.priority-selected {
  border-color: #8b5cf6;
  background-color: #f5f3ff;
}

.priority-radio {
  display: none;
}

.priority-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  width: fit-content;
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

.priority-description {
  font-size: 0.75rem;
  color: #6b7280;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.file-upload-area:hover,
.file-upload-dragover {
  border-color: #8b5cf6;
  background-color: #f5f3ff;
}

.file-upload-error {
  border-color: #dc2626;
}

.file-input-hidden {
  display: none;
}

.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.file-upload-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

.file-upload-text {
  color: #374151;
  font-size: 0.875rem;
  margin: 0;
}

.file-upload-action {
  color: #8b5cf6;
  font-weight: 500;
}

.file-upload-types {
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
}

/* Uploaded Files */
.uploaded-files {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.file-icon {
  width: 2rem;
  height: 2rem;
  color: #6b7280;
  flex-shrink: 0;
}

.file-icon svg {
  width: 100%;
  height: 100%;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.file-name {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.file-size {
  font-size: 0.75rem;
  color: #6b7280;
}

.file-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #8b5cf6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 3rem;
  text-align: right;
}

.file-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.file-success {
  color: #16a34a;
}

.file-success svg {
  width: 1rem;
  height: 1rem;
}

.file-remove {
  background: none;
  border: none;
  color: #9ca3af;
  padding: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: color 0.2s;
}

.file-remove:hover:not(:disabled) {
  color: #dc2626;
}

.file-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-remove svg {
  width: 1rem;
  height: 1rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #8b5cf6;
  color: white;
  border-radius: 0.5rem;
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

/* Help Sidebar */
.help-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.help-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.help-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.help-tips {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.help-tip {
  display: flex;
  gap: 0.75rem;
}

.help-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #8b5cf6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.help-tip h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.help-tip p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.response-times {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.response-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.response-text {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .ticket-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .help-sidebar {
    order: 2;
    grid-row: 2;
  }

  .ticket-form-section {
    order: 1;
    grid-row: 1;
  }
}

@media (max-width: 768px) {
  .ticket-header {
    padding: 1rem;
  }

  .ticket-content {
    padding: 1rem;
    gap: 1rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .priority-options {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .ticket-header {
    padding: 0.75rem;
  }

  .ticket-content {
    padding: 0.75rem;
  }

  .form-card {
    padding: 1rem;
  }

  .file-upload-area {
    padding: 1.5rem 1rem;
  }

  .uploaded-file {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .file-progress {
    width: 100%;
  }
}
</style>
