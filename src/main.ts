import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { provideApolloClient } from '@vue/apollo-composable';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';
import { apolloClient } from './apollo'; // Import your apolloClient instance

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);

// Provide the Apollo Client to the entire application
provideApolloClient(apolloClient);

app.mount('#app');
