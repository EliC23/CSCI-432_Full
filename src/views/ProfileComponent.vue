<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Modal from '@/components/Modal.vue'
import Toast from '@/components/Toast.vue'

const router = useRouter()
const userStore = useUserStore()

const modal = ref(null)
const message = ref('')
const updatedProfile = ref({ ...userStore })

function openEditModal() {
    updatedProfile.value = { ...userStore, password: '' }
    modal.value.open()
}
function closeEditModal() {
  message.value = ""
  message.value = "Profile update canceled"
  modal.value.close()
}
async function saveChanges() {
    try {
        await userStore.updateProfile(updatedProfile.value);
        message.value = "Profile updated successfully!";
        modal.value.close();
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}
function goBack() {
    router.back()
}
</script>

<template>
    <div class="profile">
        <h2>User Profile</h2>
        <p><strong>Username:</strong> {{ userStore.userName }}</p>
        <p><strong>First Name:</strong> {{ userStore.firstName }}</p>
        <p><strong>Last Name:</strong> {{ userStore.lastName }}</p>
        <p><strong>Email:</strong> {{ userStore.email }}</p>

        <button @click="openEditModal">Edit</button>
        <button @click="goBack">Back</button>
    </div>

    <Toast :message="message"></Toast>

    <Modal ref="modal">
        <template #header>
            <h1 class="primary-heading">Edit Profile</h1>
        </template>

        <template #main>
            <form class="form">
                <label>Username</label>
                <input v-model="updatedProfile.userName" type="text" />

                <label>First Name</label>
                <input v-model="updatedProfile.firstName" type="text" />

                <label>Last Name</label>
                <input v-model="updatedProfile.lastName" type="text" />

                <label>Email</label>
                <input v-model="updatedProfile.email" type="email" />

                <label>New Password</label>
                <input v-model="updatedProfile.password" type="password" placeholder="Leave blank to keep current password" />
            </form>
        </template>

        <template #footer>
            <button @click.stop="closeEditModal">Cancel</button>
            <button @click.stop="saveChanges">Save</button>
        </template>
    </Modal>
</template>

<style scoped>
.profile {
    padding: 1rem;
    text-align: left;
}
.profile h2 {
  font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}
.profile p {
  margin: 0.75rem 0;
    font-size: 1rem;
    color: #444;
}
.profile p strong {
    color: #222;
    font-weight: 600;
}
button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
button:first-of-type {
    margin-right: 10px;
}
.form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
}
.form label {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.3rem;
}
.form input {
    width: 100%;
    max-width: 300px;
    padding: 14px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    transition: all 0.3s ease;
    background-color: #f9f9f9;
}

.form input:focus {
    outline: none;
    border-color: var(--secondary-color);
    box-shadow: 0 0 5px rgba(201, 163, 20, 0.5);
    background-color: #fff;
}
</style>