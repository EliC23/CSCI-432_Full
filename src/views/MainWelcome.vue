<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import MessageContainer from '@/components/MessageContainer.vue';
import PostMessageModal from '@/components/PostMessageModal.vue';

const userStore = useUserStore();
const userName = ref('');
const postModal = ref(null);
const searchQuery = ref('');
const searchResults = ref([]);
const router = useRouter();

onMounted(() => {
  if (!userStore.userName) {
    userStore.fetchUserDetails();
  }
});

function openPostModal() {
  postModal.value.openModal();
}

async function searchUsers() {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const url = `https://hap-app-api.azurewebsites.net/users?search=userName|firstName|lastName:${searchQuery.value}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      searchResults.value = await response.json();
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error("Error searching users:", error);
  }
}
</script>

<template>
  <div class="main-content">
    <h1 class="welcome-heading">Welcome, {{ userStore.userName }}!</h1>

    <div class="search-container">
      <input 
        v-model="searchQuery" 
        @input="searchUsers"
        placeholder="Search users..."
        class="search-input"
      />
    </div>
    <div v-if="searchResults.length" class="results-wrapper">
      <div class="results-container">
        <router-link 
          v-for="user in searchResults" 
          :key="user._id" 
          :to="`/user/${user._id}?name=${user.userName}`"
          class="search-result"
        >
          {{ user.firstName }} {{ user.lastName }} (@{{ user.userName }})
        </router-link>
      </div>
    </div>

    <button class="post-btn" @click="openPostModal">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>

    <MessageContainer />
    <PostMessageModal ref="postModal" />
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

.welcome-heading {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.post-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 10px;
  transition: 0.3s ease;
}

.post-btn:hover {
  transform: scale(1.1);
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  position: relative; /* Keeps everything in flow */
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.results-wrapper {
  width: 100%;
}
.results-container {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.search-result {
  display: block;
  padding: 10px;
  border-bottom: 1px solid #eee;
  color: black;
  text-decoration: none;
}
.search-result:hover {
  background: #f5f5f5;
}
</style>