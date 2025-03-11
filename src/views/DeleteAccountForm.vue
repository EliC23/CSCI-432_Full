<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const typedUsername = ref('')
  const errorMessage = ref('')
  
  const storedUsername = localStorage.getItem('userName') || ''
  
  async function performDeletion() {
    if (typedUsername.value !== storedUsername) {
      errorMessage.value = 'Username does not match.'
      return
    }
  
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('https://hap-app-api.azurewebsites.net/user', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok && response.status === 200) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        alert('Your account has been successfully deleted.')
        router.push({ name: 'home' })
      } else {
        errorMessage.value = 'Failed to delete account. Please try again.'
      }
    } catch (err) {
      errorMessage.value = 'An error occurred while deleting your account.'
      console.error(err)
    }
  }
</script>

<template>
    <div class="delete-account-form">
      <form @submit.prevent="performDeletion">
        <label for="username">Please type your username to delete your account:</label>
        <input
          type="text"
          id="username"
          v-model="typedUsername"
          placeholder="Username"
        />
        <button type="submit">Submit</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
</template>
  
  
<style scoped>
  .delete-account-form {
    padding: 1rem;
  }
  .delete-account-form form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .delete-account-form input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .delete-account-form button {
    padding: 0.5rem;
    font-size: 1rem;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .error {
    color: red;
    margin-top: 0.5rem;
    text-align: center;
  }
  </style>