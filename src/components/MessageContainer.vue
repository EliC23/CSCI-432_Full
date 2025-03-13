<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useUserStore } from '@/stores/userStore';
import Message from './Message.vue';

const messages = ref([]);
const scrollContainer = ref(null);
const loading = ref(false);
const newMessagesCount = ref(0);
const lastFetchedTime = ref(new Date().toISOString());
const userStore = useUserStore();

async function fetchMessages(before = null, after = null, limit = 10) {
  if (!userStore.token) return;

  let url = `https://hap-app-api.azurewebsites.net/messages?limit=${limit}`;
  if (before) url += `&before=${before}`;
  if (after) url += `&after=${after}`;

  try {
    loading.value = true;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      const data = await response.json();

      if (after) {
        const uniqueMessages = data.filter(
          msg => !messages.value.some(existing => existing.updatedAt === msg.updatedAt)
        );
        messages.value.unshift(...uniqueMessages);
      } else {
        messages.value.push(...data);
      }
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  } finally {
    loading.value = false;
  }
}

async function checkNewMessages() {
  if (!userStore.token) return;

  let url = `https://hap-app-api.azurewebsites.net/messages/count?after=${lastFetchedTime.value}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      newMessagesCount.value = data.total;
    }
  } catch (error) {
    console.error("Error checking new messages:", error);
  }
}

async function loadNewMessages() {
  if (!lastFetchedTime.value) return;

  console.log("Loading new messages after:", lastFetchedTime.value);
  
  await fetchMessages(null, lastFetchedTime.value);
  
  newMessagesCount.value = 0;
  lastFetchedTime.value = new Date().toISOString();

  console.log("Updated lastFetchedTime:", lastFetchedTime.value);
}

function handleScroll() {
  if (!scrollContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    const oldestMessage = messages.value[messages.value.length - 1];
    if (oldestMessage) {
      fetchMessages(oldestMessage.updatedAt);
    }
  }

  if (scrollTop <= 10 && newMessagesCount.value > 0) {
    console.log("Fetching new messages...");
    loadNewMessages();
  }
}

onMounted(() => {
  fetchMessages();
  setInterval(checkNewMessages, 5000);
});
</script>

<template>
  <div class="message-container" ref="scrollContainer" @scroll="handleScroll">
    <button v-if="newMessagesCount > 0" class="new-messages-btn" @click="loadNewMessages">
      {{ newMessagesCount }} new messages
    </button>
    
    <Message 
      v-for="message in messages" 
      :key="message.updatedAt" 
      :senderName="message.senderName" 
      :updatedAt="message.updatedAt" 
      :text="message.text" 
    />

    <p v-if="loading" class="loading">Loading messages...</p>
  </div>
</template>

<style scoped>
.message-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  background: #f9f9f9;
}

.new-messages-btn {
  width: 100%;
  padding: 10px;
  background: #a28312;
  color: white;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  font-size: 14px;
  color: #888;
}
</style>