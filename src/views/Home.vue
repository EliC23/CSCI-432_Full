<script setup>
    import Header from '../components/Header.vue'
</script>
 
<template>
    <Header>
        <nav>
            <RouterLink class="nav-link" to="/signin">Sign In</RouterLink>
            <RouterLink class="nav-link" to="/join">Join</RouterLink>
        </nav>
    </Header>
    <main>
        <div class="main-content">
            <h1 class="fs-secondary-heading">Home</h1>
            <p>Welcome to Crown Investments</p>
      </div>
    </main>
</template>
 
<style scoped>
</style>