<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const messageText = ref('');
const feedbackMessage = ref('');
const token = localStorage.getItem('token');

function openModal() {
  showModal.value = true;
  feedbackMessage.value = '';
}

function closeModal() {
  showModal.value = false;
  messageText.value = '';
}

async function postMessage() {
  if (!messageText.value.trim()) {
    feedbackMessage.value = "Message cannot be empty.";
    return;
  }

  if (messageText.value.length > 280) {
    feedbackMessage.value = "Message must be 280 characters or less.";
    return;
  }

  const url = 'https://hap-app-api.azurewebsites.net/message';
  const payload = { text: messageText.value.trim() };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    let response = await fetch(url, options);

    if (response.status === 201) {
      feedbackMessage.value = "Message posted successfully!";
      setTimeout(() => closeModal(), 1000);
    } else if (response.status === 400) {
      feedbackMessage.value = "Bad request. Ensure your message is valid.";
    } else if (response.status === 401) {
      feedbackMessage.value = "Unauthorized. Please log in.";
    } else {
      feedbackMessage.value = "An unexpected error occurred. Please try again.";
    }
  } catch (err) {
    console.error("Error posting message:", err);
    feedbackMessage.value = "Failed to connect to the server.";
  }
}

defineExpose({ openModal, closeModal });
</script>

<template>
  <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
    <div class="modal">
      <header class="modal-header">
        <h2>Post a Message!</h2>
      </header>
      <main>
        <textarea v-model="messageText" placeholder="Write your message..." maxlength="280"></textarea>
        <p v-if="feedbackMessage" class="feedback">{{ feedbackMessage }}</p>
      </main>

      <footer>
        <button class="cancel-btn" @click="closeModal">Cancel</button>
        <button class="post-btn" @click="postMessage">Post</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-header {
    background-color: #f8f8f8;
    padding: 15px;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
    position: relative;
    z-index: 1200;
}

.modal {
  background-color: white;
  padding-top: 0px;
  padding: 50px;
  border-radius: 8px;
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

textarea {
  width: 100%;
  height: 100px;
  padding: 0px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  margin: 0;
}

.feedback {
  color: red;
  font-size: 0.9rem;
}

footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.post-btn {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #ccc;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>