<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Create a new ticket</h2>
          <form @submit.prevent="submitTicket">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700">Subject</label>
                <div class="mt-1">
                  <input type="text" name="subject" id="subject" v-model="ticket.subject"
                    class="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                </div>
              </div>

              <div>
                <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
                <div class="mt-1">
                  <select id="department" name="department" v-model="ticket.department"
                    class="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                    <option>Support</option>
                    <option>Sales</option>
                    <option>Billing</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <div class="mt-1">
                  <textarea id="description" name="description" rows="4" v-model="ticket.description"
                    class="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"></textarea>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end">
              <router-link to="/"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </router-link>
              <button type="submit"
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ticket = ref({
  subject: '',
  department: 'Support',
  description: ''
})

const submitTicket = () => {
  // Here you would typically send the data to a server
  console.log('Submitting ticket:', ticket.value)
  router.push('/')
}
</script>
