import { defineStore } from 'pinia';
import { apolloClient } from '../apollo';
import gql from 'graphql-tag';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('authToken'),
    isAuthenticated: !!localStorage.getItem('authToken'),
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        const LOGIN_MUTATION = gql`
          mutation LoginUser($input: LoginUserInput!) {
            loginUser(input: $input) {
              token
              user {
                email
                id
                name
                role
              }
            }
          }
        `;
        interface LoginMutationResult {
          loginUser: {
            token: string;
            user: {
              email: string;
              id: string;
              name: string;
              role: string;
            };
          };
        }

        const { data } = await apolloClient.mutate<LoginMutationResult>({
          mutation: LOGIN_MUTATION,
          variables: { input: { email, password } },
        });

        if (data && data.loginUser && data.loginUser.token) {
          this.token = data.loginUser.token;
          this.isAuthenticated = true;
          localStorage.setItem('authToken', data.loginUser.token);
          localStorage.setItem('user', JSON.stringify(data.loginUser.user));
          return true;
        }
        return false;
      } catch (error) {
        console.error('Login failed:', error);
        this.logout(); // Ensure state is clean on error
        return false;
      }
    },
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('authToken');
      // Optionally, clear Apollo cache
      apolloClient.clearStore();
    },
  },
});
