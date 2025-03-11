<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  senderName: String,
  updatedAt: String,
  text: String
});

const formattedDate = computed(() => {
  return new Date(props.updatedAt).toLocaleString("en-US", {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});
</script>

<template>
  <div class="message-card">
    <div class="message-header">
      <span class="sender">{{ senderName }}</span>
      <span class="timestamp">{{ formattedDate }}</span>
    </div>
    <p class="message-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.message-card {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

.sender {
  color: #333;
}

.timestamp {
  font-size: 0.8rem;
  color: #777;
}

.message-text {
  font-size: 1rem;
  color: #444;
}
</style>
