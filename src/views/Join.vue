<script setup>
import Header from '../components/Header.vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { ref, computed } from 'vue';

const router = useRouter();
const userStore = useUserStore();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const isFormValid = computed(() => {
  return(
    firstName.value &&
    lastName.value &&
    email.value &&
    userName.value &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value
  );
});

async function handleJoin() {
  if (!isFormValid.value) {
    error.value = 'All fields are required, and passwords must match!';
    return;
  }
  else if (password.value.length<8){
    error.value='Password must be longer than 8 characters.'
  }

  const url = 'https://hap-app-api.azurewebsites.net/user';
  const data = {
    email: email.value,
    userName: userName.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    let response = await fetch(url, options);

    if (response.status === 201) {
      const responseData = await response.json();
      userStore.setUser(responseData, responseData.token);
      router.push({ name: 'main' });
    } 
    else if (response.status === 400 && password.value.length >= 8) {
      error.value = 'Account creation failed. Check your input and try again.';
    } 
  } 
  catch (err) {
    console.error('Error:', err);
    error.value = 'Unable to connect to the server. Please try again later.';
  }
}
</script>

<template>
  <Header>
    <nav>
      <RouterLink class="nav-link" to="/signin">Sign In</RouterLink>
    </nav>
  </Header>

  <main class="container">
    <section class="center">
      <div class="main-content">
        <form class="form" @submit.prevent="handleJoin">
          <input class="input" type="text" v-model="firstName" placeholder="First Name" />
          <input class="input" type="text" v-model="lastName" placeholder="Last Name" />
          <input class="input" type="email" v-model="email" placeholder="Email" />
          <input class="input" type="text" v-model="userName" placeholder="Username" />
          <input class="input" type="password" v-model="password" placeholder="Password" />
          <input class="input" type="password" v-model="confirmPassword" placeholder="Confirm Password" />
          <button class="button"
          :class="{ 'button--active': isFormValid }"
          type="submit">Join</button>
        </form>
      </div>
    </section>
    <p v-if="error" class="error">{{ error }}</p>
  </main>
</template>

<style scoped>
</style>