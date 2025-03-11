<script setup>
import { ref } from 'vue'

const showModal = ref(false)

defineExpose({
    open, close
})

function open() {
    showModal.value = true
}

function close(e) {
    console.log('Modal closed')
    showModal.value = false
}
</script>

<template>
    <div v-if="showModal" class="modal-backdrop" @click.self="close">
        <div class="modal">
            <header class="modal-header">
                <slot name="header"></slot>
                <button class="close-button" @click.stop="close">✖</button>
            </header>

            <main class="modal-body">
                <slot name="main"></slot>
            </main>

            <footer class="modal-footer">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(5px);
    z-index: 1050;
}

.modal {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 450px;
    max-height: 80vh;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    overflow-y: auto; 
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

.modal-body {
    padding: 15px;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 1250;
}
</style>