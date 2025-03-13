<script setup>
import Header from '../components/Header.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { ref, computed } from 'vue';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const error = ref('');

const isFormValid = computed(() => email.value && password.value);
async function signIn(e) {
  e.preventDefault();

  if (!isFormValid.value) {
    error.value = 'Both fields are required!';
    return;
  }

  const data = {
    email: email.value, 
    password: password.value
  };
  const url = 'https://hap-app-api.azurewebsites.net/user/login';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    };

  try{
    let response = await fetch(url, options);

    if (response.status === 200){
      const data = await response.json();
      userStore.setUser(data);
      await userStore.fetchUserDetails();
      router.push({
        name: 'main',
      });
    }
    else if (response.status === 400){
      error.value = 'Invalid email or password.'
    }
    else {
      error.value = 'An unexpected error occurred. Please try again.'
    }
  }
  catch(err){
    console.error('Error: ', err)
    error.value = 'Unable to connect to the server. Please try again'
  }
}
</script>

<template>
  <Header>
    <nav>
      <RouterLink class="nav-link" to="/join">Join</RouterLink>
    </nav>
  </Header>

  <main class="container">
    <section class="center">
      <div class="main-content">
        <form class="form" @submit.prevent="signIn">
          <input
            class="input"
            type="text"
            v-model="email"
            placeholder="Enter your email"
          />
          <input
            class="input"
            type="password"
            v-model="password"
            placeholder="Enter your password"
          />
          <button class="button"
          :class="{'button--active': isFormValid}"
          type="submit">Sign In</button>
        </form>
      </div>
    </section>
    <p v-if="error" class="error">{{ error }}</p>
  </main>
</template>