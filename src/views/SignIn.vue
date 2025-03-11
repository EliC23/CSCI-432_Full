<script setup>
import Header from '../components/Header.vue';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';


const router = useRouter();

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
      console.log("API Response:", data);

      localStorage.setItem('token', data.token);

      await fetchUserDetails();

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
async function fetchUserDetails() {
  const token = localStorage.getItem('token');
  const url = 'https://hap-app-api.azurewebsites.net/user';

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      const userData = await response.json();

      localStorage.setItem('firstName', userData.firstName);
      localStorage.setItem('lastName', userData.lastName);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('userName', userData.userName);
    } else {
      console.error('Failed to retrieve user details:', response.status);
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
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