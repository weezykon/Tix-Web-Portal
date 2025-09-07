<template>
  <div class="login-container">
    <!-- Left side - Login Form -->
    <div class="login-form-section">
      <div class="form-wrapper">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo">
            <span class="logo-main">Tix</span>
            <span class="logo-accent">Support</span>
          </div>
        </div>

        <!-- Welcome text -->
        <div class="welcome-section">
          <h1 class="welcome-title">Hello!</h1>
          <p class="welcome-description">
            To log into your account, please enter your email address and password.
          </p>
        </div>

        <!-- Login Form -->
        <div class="form-container">
          <div class="input-group">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              placeholder="Your email address"
              class="form-input"
              v-model="email"
            />
          </div>

          <div class="input-group">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="Your password"
              class="form-input"
              v-model="password"
            />
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password" class="forgot-link"> Forgot password? </router-link>
          </div>

          <div style="text-align: center; margin-top: 1rem;">
            <router-link to="/login/agent" class="forgot-link">Are you a support agent?</router-link>
          </div>

          <div class="submit-section">
            <button type="submit" class="submit-button" @click="handleSubmit" :disabled="isLoading">
  {{ isLoading ? 'Logging in...' : 'Next step' }}
</button>
          </div>
        </div>

        <!-- Support Contact -->
        <div class="support-section">
          <p class="support-text">Don't hesitate to contact us</p>
          <a href="mailto:support@tixsupport.com" class="support-email"> support@tixsupport.com </a>
        </div>

        <!-- Footer -->
        <div class="footer-section">
          <p class="footer-text">All rights reserved Tix Technologies 2025</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router'; // Import useRouter and RouterLink
import { useAuthStore } from '../stores/auth'; // Import useAuthStore
import { useAppToast } from '../composables/useToast';

const email = ref('');
const password = ref('');
const isLoading = ref(false); // New loading state
const authStore = useAuthStore(); // Initialize the auth store
const router = useRouter(); // Initialize the router
const { showSuccessToast, showErrorToast } = useAppToast();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true; // Set loading to true

  try {
    const success = await authStore.login(email.value, password.value);
    if (success) {
      showSuccessToast('Login successful!');
      router.push('/'); // Redirect to home on successful login
    } else {
      showErrorToast('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login error:', error);
    showErrorToast('An unexpected error occurred during login.');
  } finally {
    isLoading.value = false; // Set loading to false regardless of outcome
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
}

.login-form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 1rem;
}

@media (min-width: 640px) {
  .login-form-section {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .login-form-section {
    padding-left: 5rem;
    padding-right: 5rem;
  }
}

@media (min-width: 1280px) {
  .login-form-section {
    padding-left: 6rem;
    padding-right: 6rem;
  }
}

.form-wrapper {
  margin: 0 auto;
  width: 100%;
  max-width: 24rem;
}

@media (min-width: 1024px) {
  .form-wrapper {
    width: 24rem;
  }
}

.logo-section {
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-main {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.logo-accent {
  font-size: 1.5rem;
  font-weight: 400;
  color: #059669;
  margin-left: 0.25rem;
}

.language-selector {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.flag-icon {
  width: 1.5rem;
  height: 1rem;
  background-color: #3b82f6;
  border-radius: 0.125rem;
  margin-right: 0.5rem;
}

.lang-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  margin-left: 0.25rem;
  color: #9ca3af;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.welcome-description {
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.625;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  width: 100%;
}

.form-input {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #6b7280;
}

.form-input:focus {
  outline: none;
  border-color: #9ca3af;
  background-color: #ffffff;
}

.forgot-password {
  text-align: left;
}

.forgot-link {
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #047857;
}

.submit-section {
  padding-top: 0.5rem;
}

.submit-button {
  width: 100%;
  background-color: #000000;
  color: #ffffff;
  font-weight: 500;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover {
  background-color: #1f2937;
}

.submit-button:focus {
  outline: none;
  box-shadow:
    0 0 0 2px #6b7280,
    0 0 0 4px rgba(107, 114, 128, 0.1);
}

.support-section {
  margin-top: 3rem;
  text-align: center;
}

.support-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.support-email {
  color: #059669;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.support-email:hover {
  color: #047857;
}

.footer-section {
  margin-top: 4rem;
}

.footer-text {
  color: #9ca3af;
  font-size: 0.75rem;
  text-align: center;
}

.content-section {
  display: none;
  position: relative;
  width: 0;
  flex: 1;
}

@media (min-width: 1024px) {
  .content-section {
    display: block;
  }
}

.content-background {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.plant-container {
  position: relative;
}

.pot {
  width: 8rem;
  height: 6rem;
  background: linear-gradient(180deg, #fef3c7 0%, #fcd34d 100%);
  border-radius: 0 0 50% 50%;
  margin: 0 auto;
}

.plant-stems {
  position: absolute;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);
}

.stem {
  width: 0.5rem;
  background-color: #10b981;
  border-radius: 999px;
  position: absolute;
  top: 0;
}

.stem-1 {
  height: 5rem;
  transform: rotate(12deg);
}

.stem-2 {
  height: 6rem;
  left: 1rem;
  transform: rotate(-12deg);
  background-color: #059669;
}

.stem-3 {
  height: 4rem;
  left: 2rem;
  top: 0.5rem;
  transform: rotate(45deg);
}

.plant-leaves {
  position: absolute;
  top: -3rem;
  left: 50%;
  transform: translateX(-50%);
}

.leaf {
  background-color: #10b981;
  border-radius: 50%;
  position: absolute;
}

.leaf-1 {
  width: 2rem;
  height: 1rem;
  top: -1rem;
  left: 0.5rem;
  transform: rotate(45deg);
}

.leaf-2 {
  width: 1.5rem;
  height: 0.75rem;
  top: -1.5rem;
  left: 1.5rem;
  transform: rotate(-12deg);
  background-color: #059669;
}

.leaf-3 {
  width: 2.5rem;
  height: 1.25rem;
  top: -2rem;
  left: 1rem;
  transform: rotate(12deg);
  background-color: #047857;
}

.leaf-4 {
  width: 1.75rem;
  height: 1rem;
  top: -0.5rem;
  left: 2.5rem;
  transform: rotate(75deg);
}

.leaf-5 {
  width: 1.25rem;
  height: 0.75rem;
  top: -2.5rem;
  left: 2rem;
  transform: rotate(-45deg);
  background-color: #059669;
}

.content-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-text {
  text-align: center;
  color: #ffffff;
  padding: 2rem;
  max-width: 28rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.content-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.25;
}

.content-description {
  font-size: 0.875rem;
  color: #e5e7eb;
  line-height: 1.625;
}

/* Mobile responsiveness */
@media (max-width: 1023px) {
  .content-section {
    display: none;
  }

  .login-form-section {
    flex: none;
    width: 100%;
  }
}
</style>
