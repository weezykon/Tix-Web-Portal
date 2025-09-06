import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TicketDetailsView from '../views/TicketDetailsView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Dashboard' }
    },
    {
      path: '/ticket/:id',
      name: 'ticket-details',
      component: TicketDetailsView,
      meta: { title: 'Ticket Details' }
    },
    {
      path: '/create-ticket',
      name: 'create-ticket',
      component: CreateTicketView,
      meta: { title: 'Create Ticket' }
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
})

export default router
