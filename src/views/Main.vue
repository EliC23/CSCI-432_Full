<script setup>
import Header from '../components/Header.vue';
import { RouterView,useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';

const router = useRouter();
const userStore = useUserStore();
const userName = ref('');
const showDropdown = ref(false);
const showSidebarAccount = ref(false);
const showUserDropdown = ref(false);

onMounted(() => {
  if (!userStore.userName) {
    userStore.fetchUserDetails();
  }
});

async function signOut(event) {
  const url = 'https://hap-app-api.azurewebsites.net/user/logout';

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userStore.token}`,
    },
  };

  try {
    const response = await fetch(url, options);

    if (response.ok) {
      if (response.status === 200) {
        userStore.$reset();
        await router.replace({ name: 'home' });
      }
    } 
    else {
      console.log("HTTP-Error: " + response.status);
    }
  } 
  catch (err) {
    console.error("Logout failed: ", err);
  }
}
function navigateToProfile() {
  router.push({ name: 'profile' });
}
function navigateToDeleteConfirm() {
  router.push({ name: 'deleteConfirm' });
}
</script>
<template>
  <Header>
    <nav>
      <div class="user-dropdown">
        <button class="user-icon-btn" @click="showUserDropdown = !showUserDropdown">
          <i class="fas fa-user"></i>
        </button>
        <div v-if="showUserDropdown" class="user-dropdown-menu">
          <a class="dropdown-item" @click.prevent="signOut">Sign Out</a>
        </div>
      </div>
    </nav>
  </Header>

  <main class="main-grid">
    <aside class="sidebar">
      <ul class="sidebar-menu">
        <li>
          <button class="sidebar-menu-item" @click="showSidebarAccount = !showSidebarAccount">
            Account
          </button>
          <ul v-if="showSidebarAccount" class="nested-menu">
            <li>
              <button class="nested-menu-item" @click="navigateToProfile">
                <i class="fa-solid fa-list"></i>Profile
              </button>
            </li>
            <li>
              <button class="nested-menu-item delete" @click="navigateToDeleteConfirm">
                <i class="fa-solid fa-circle-xmark"></i>Delete Account
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <section class="content">
      <RouterView name="center">
        
      </RouterView>
    </section>

    <aside class="right-column">
      <RouterView name="right">
      </RouterView>
    </aside>
  </main>

  <footer class="footer">
    <p>© 2025 Crown Investments</p>
  </footer>
</template>

<style scoped>
</style>