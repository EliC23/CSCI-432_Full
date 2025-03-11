<script setup>
import { ref, watch } from 'vue'

const showToast = ref(false)
const props = defineProps({
    message: { type: String, required: true }
})

watch(() => props.message, async (newValue) => {
    if (newValue) {
        showToast.value = true
        setTimeout(() => showToast.value = false, 2000)
    }
})
</script>

<template>
<transition name="fade">
    <span v-if="showToast" class="toast">{{ message }}</span>
</transition>
</template>

<style scoped>
.toast {
    position: fixed;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5em 1.5em;
    background-color: var(--secondary-color);
    color: white;
    font-size: 1rem;
    border-radius: 6px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease-in-out;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>