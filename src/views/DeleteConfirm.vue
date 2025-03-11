<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  function confirmDeletion() {
    router.push({ name: 'deleteAccountForm' })
  }
  
  function cancelDeletion() {
    router.back()
  }
</script>

<template>
    <div class="delete-confirm">
      <p>Are you sure you want to delete your account?</p>
      <div class="buttons">
        <button @click="confirmDeletion">Confirm</button>
        <button @click="cancelDeletion">Cancel</button>
      </div>
    </div>
</template>

  
<style scoped>
  .delete-confirm {
    text-align: center;
    padding: 1rem;
  }
  .buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>