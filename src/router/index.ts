import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TicketDetailsView from '../views/TicketDetailsView.vue';
import CreateTicketView from '../views/CreateTicketView.vue';
import { useAuthStore } from '../stores/auth'; // Import the auth store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Dashboard', requiresAuth: true } // Guarded
    },
    {
      path: '/ticket/:id',
      name: 'ticket-details',
      component: TicketDetailsView,
      meta: { title: 'Ticket Details', requiresAuth: true } // Guarded
    },
    {
      path: '/create-ticket',
      name: 'create-ticket',
      component: CreateTicketView,
      meta: { title: 'Create Ticket', requiresAuth: true } // Guarded
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Register' }
    },
    {
      path: '/login/agent',
      name: 'login-agent',
      component: () => import('../views/LoginAgentView.vue'),
      meta: { title: 'Agent Login' }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // Get the auth store instance

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register' || to.name === 'login-agent') && authStore.isAuthenticated) {
    // If user is logged in and tries to access login/register, redirect to home
    next({ name: 'home' });
  } else {
    next(); // Continue to the route
  }
});

export default router;
