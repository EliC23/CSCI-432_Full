<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const route = useRoute();
const router = useRouter();
const messages = ref([]);
const messageText = ref('');
const feedbackMessage = ref('');
const userId = route.params.userId;
const userName = route.query.name || "User";
const currentUserId = ref(localStorage.getItem('userId') || '');
const currentUserName = ref(localStorage.getItem('userName') || 'You');
const token = localStorage.getItem('token');
const scrollContainer = ref(null);
const oldestMessageTime = ref(null);
const loadingOlderMessages = ref(false);

// ** Fetch Messages with Pagination (Starts with 5) **
async function fetchMessages(before = null, limit = 5) {
  if (!token) return;

  let url = `https://hap-app-api.azurewebsites.net/messages/${userId}?limit=${limit}`;
  if (before) url += `&before=${before}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();

      if (before) {
        messages.value.unshift(...data.reverse()); // Prepend older messages at the top
      } else {
        messages.value = data.reverse(); // Initial load
      }

      if (messages.value.length > 0) {
        oldestMessageTime.value = messages.value[0].updatedAt; // Track oldest message
      }

      nextTick(() => {
        if (!before) scrollToBottom();
      });
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  });
}

async function handleScroll() {
  if (!scrollContainer.value || loadingOlderMessages.value) return;

  const { scrollTop } = scrollContainer.value;

  if (scrollTop <= 10 && oldestMessageTime.value) {
    loadingOlderMessages.value = true;
    await fetchMessages(oldestMessageTime.value);
    loadingOlderMessages.value = false;
  }
}

async function sendMessage() {
  if (!messageText.value.trim()) return;

  const newMessage = {
    senderId: currentUserId.value,
    senderName: currentUserName.value,
    text: messageText.value.trim(),
    updatedAt: new Date().toISOString(),
  };

  messages.value.push(newMessage);

  const url = `https://hap-app-api.azurewebsites.net/message/${userId}`;
  const payload = { text: messageText.value.trim() };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Message sent!");
    } else {
      console.error("Error sending message:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }

  messageText.value = '';
  scrollToBottom();
}


async function refreshMessages() {
  messages.value = [];
  fetchMessages();
}

onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <div class="private-message-container">
    <!-- HEADER -->
    <div class="header-wrapper">
      <Header>
        <button class="close-btn" @click="router.back()">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </Header>
    </div>

    <h2 class="chat-title">Chat with {{ userName }}</h2>

    <!-- Feedback Message Popup -->
    <div v-if="feedbackMessage" class="feedback-popup">
      {{ feedbackMessage }}
    </div>

    <!-- Refresh Button -->
    <button class="refresh-btn" @click="refreshMessages">
      <i class="fa-solid fa-arrows-rotate"></i> Refresh
    </button>

    <!-- SCROLLABLE MESSAGE CONTAINER -->
    <div class="messages-container" ref="scrollContainer" @scroll="handleScroll">
      <div v-for="msg in messages" :key="msg.messageId" 
        :class="{
          'message': true, 
          'message-sent': msg.senderId === currentUserId, 
          'message-received': msg.senderId !== currentUserId
        }">
        <p class="message-sender">{{ msg.senderName }}</p>
        <p class="message-text">{{ msg.text }}</p>
        <p class="message-time">{{ new Date(msg.updatedAt).toLocaleString() }}</p>
      </div>
    </div>

    <!-- MESSAGE INPUT -->
    <div class="message-input">
      <input type="text" v-model="messageText" placeholder="Type a message..." />
      <button @click="sendMessage">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.private-message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 60px;
  align-items: center;
  justify-content: center;
}

.refresh-btn {
  margin: 10px;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: var(--secondary-color);
}

.messages-container {
  width: 90%;
  max-width: 600px;
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  max-height: 50vh;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.message {
  width: 90%;
  max-width: 550px;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: white;
  text-align: left;
}

.message-sent {
  align-self: flex-end; 
  background: var(--primary-color);
  color: white;
  text-align: right;
}

.message-received {
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid #ddd;
  text-align: left;
}

.message-sender {
  font-weight: bold;
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 5px;
}

.message-text {
  font-size: 1rem;
  margin-bottom: 5px;
}

.message-time {
  font-size: 0.8rem;
  color: gray;
  text-align: right;
}

.message-input {
  display: flex;
  width: 90%;
  max-width: 600px;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: white;
  border-radius: 8px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.message-input button {
  background: var(--primary-color);
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  margin-left: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.message-input button:hover {
  background: var(--secondary-color);
}
</style>