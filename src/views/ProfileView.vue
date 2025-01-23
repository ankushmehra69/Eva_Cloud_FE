<template>
  <div class="pt-3">
    <MobileHeader title="Profile" />
    <div class="md:p-6 p-4 bg-white rounded-2xl">
      <h3 class="text-xl font-medium text-secondary md:mb-6 mb-4">
        Manage Profile
      </h3>
      <!-- User Profile Form -->
      <form class="space-y-3" @submit.prevent="updateProfile">
        <form-input
          label="Full Name"
          id="name"
          type="text"
          v-model="user.name"
          size="sm"
          placeholder="Enter your full name"
        />
        <form-input
          label="Mobile"
          id="mobile"
          type="text"
          v-model="user.phone"
          size="sm"
          placeholder="Enter your mobile number"
        />
        <form-input
          label="E-mail address"
          id="email"
          type="email"
          v-model="user.email"
          readonly
          disabled
          size="sm"
        />
        <div class="grid grid-cols-2 gap-4 pb-2">
          <form-input
            label="User Id"
            id="user_id"
            type="text"
            v-model="user.id"
            size="sm"
            disabled
          />
          <form-input
            label="Joining Date"
            id="mobile"
            v-model="formattedCreatedAt"
            size="sm"
            disabled
          />
        </div>

        <button
          type="submit"
          class="px-4 py-3 md:text-base text-sm bg-secondary-200 text-white rounded-lg hover:bg-secondary-100 w-full"
        >
          Update Details
        </button>
      </form>

      <!-- Password Update Form -->
      <div class="hidden">
        <h3 class="text-xl font-medium text-secondary my-6">Change Password</h3>
        <form class="space-y-3" @submit.prevent="updatePasswordFn">
          <form-input
            label="Old Password"
            id="oldPassword"
            type="password"
            v-model="oldPassword"
            size="sm"
            placeholder="Enter your old password"
          />
          <form-input
            label="New Password"
            id="newPassword"
            type="password"
            v-model="newPassword"
            size="sm"
            placeholder="Enter your new password"
          />

          <button
            type="submit"
            class="px-4 py-3 !mt-4 bg-secondary-200 text-white rounded-lg hover:bg-secondary-100 w-full"
          >
            Update Password
          </button>
        </form>
      </div>

      <div v-if="error" class="mt-4 text-red-500">
        {{ error }}
      </div>
      <div v-if="success" class="mt-4 text-green-500">
        Profile updated successfully!
      </div>
      <div v-if="passwordSuccess" class="mt-4 text-green-500">
        Password updated successfully!
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import backend from "@/backend";
import { updatePassword } from "aws-amplify/auth";
import FormInput from "@/components/form/Input.vue";
import MobileHeader from "@/components/MobileHeader.vue";
const user = ref({
  name: "",
  email: "",
  phone: "",
  created_at: "",
});

const error = ref("");
const success = ref(false);
const passwordSuccess = ref(false); // Track password update success
const oldPassword = ref("");
const newPassword = ref("");

// Helper to format date
const formattedCreatedAt = computed(() => {
  if (user.value.created_at) {
    const date = new Date(user.value.created_at);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  return "";
});

// Fetch the user data when the component is mounted
onMounted(async () => {
  try {
    const response = await backend.users.getUser("self");
    user.value = { ...response };
  } catch (e) {
    error.value = "Failed to load profile data.";
  }
});

// Function to update user profile
const updateProfile = async () => {
  try {
    await backend.users.updateUser(user.value.id, {
      name: user.value.name,
      phone: user.value.phone,
    });
    success.value = true;
    error.value = "";
  } catch (e) {
    error.value = "Failed to update profile. Please try again.";
    success.value = false;
  }
};

// Function to reset the form to initial values
const resetForm = async () => {
  try {
    const response = await backend.users.getUser("self");
    user.value = { ...response };
    error.value = "";
    success.value = false;
  } catch (e) {
    error.value = "Failed to reset profile data.";
  }
};

// Function to update password
const updatePasswordFn = async () => {
  try {
    error.value = "";
    passwordSuccess.value = false;

    await updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    passwordSuccess.value = true;
    oldPassword.value = "";
    newPassword.value = "";
  } catch (e) {
    error.value = "Failed to update password. Please try again.";
    passwordSuccess.value = false;
  }
};
</script>

<style scoped>
.container {
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
