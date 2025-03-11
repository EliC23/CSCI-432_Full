<script setup>
    import { RouterLink } from 'vue-router';
    import Logo from './Logo.vue'
</script>

<template>
    <header>
        <div class="container">
            <RouterLink class="logo-link" to="/main">
                <Logo />
            </RouterLink>
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.logo-link {
  display: inline-block;
  transition: transform 0.3s ease;
}
.logo-link:hover {
  transform: scale(1.1);
}

:slotted(*) {
    font-size: var(--fs-600);
}
</style>