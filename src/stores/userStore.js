import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const firstName = ref('');
  const lastName = ref('');
  const userName = ref('');
  const email = ref('');
  const token = ref('');
  const userId = ref('');

  const fullName = computed(() => `${firstName.value} ${lastName.value}`);

  function setUser(userData) {
    userId.value = userData._id ?? '';
    firstName.value = userData.firstName ?? '';
    lastName.value = userData.lastName ?? '';
    userName.value = userData.userName ?? '';
    email.value = userData.email ?? '';
    token.value = userData.token ?? '';

    localStorage.setItem('token', token.value);
  }

  function $reset() {
    userId.value = '';
    firstName.value = '';
    lastName.value = '';
    userName.value = '';
    email.value = '';
    token.value = '';

    localStorage.removeItem('token');
  }

  token.value = localStorage.getItem('token') || '';

  async function fetchUserDetails() {
    if (!token.value) return;

    try {
      let response = await fetch('https://hap-app-api.azurewebsites.net/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.value}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({ ...userData, token: token.value });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  async function updateProfile(updatedData) {
    if (!token.value) {
        console.error("No token found in Pinia store");
        return;
    }

    const url = 'https://hap-app-api.azurewebsites.net/user';
    const validUpdates = {
        userName: updatedData.userName.trim(),
        firstName: updatedData.firstName.trim(),
        lastName: updatedData.lastName.trim(),
        email: updatedData.email.trim(),
    };

    if (updatedData.password && updatedData.password.length >= 8) {
        validUpdates.password = updatedData.password;
    } else if (updatedData.password && updatedData.password.length < 8) {
        console.error("Password too short.");
        return;
    }

    try {
        let response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.value}`
            },
            body: JSON.stringify(validUpdates)
        });

        if (response.status === 200) {
            const newUserData = await response.json();
            setUser(newUserData, token.value);  // Update store with new data
            return "Profile updated successfully!";
        } else {
            console.error("Error updating profile:", response.status);
            return "Failed to update profile";
        }
        } catch (err) {
        console.error("Error:", err);
        return "Error updating profile";
        }
    }

  return { userId, firstName, lastName, userName, email, token, fullName, setUser, $reset, fetchUserDetails, updateProfile};
});