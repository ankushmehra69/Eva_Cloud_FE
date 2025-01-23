<template>
  <nav class="bg-gray-200 shadow shadow-gray-300 w-full fixed top-0 z-50">
    <div
      class="md:h-16 h-28 mx-auto container flex items-center justify-between flex-wrap md:flex-nowrap px-4"
    >
      <!-- Logo -->
      <div class="text-blue-500 md:order-1">
        <span class="text-2xl font-bold">E . V . A</span>
      </div>

      <!-- Hamburger Icon for Mobile -->
      <div class="md:hidden flex items-center order-2">
        <button
          @click="toggleMenu"
          class="text-gray-500 hover:text-blue-400 focus:outline-none focus:text-blue-400"
        >
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <!-- Menu Items -->
      <div
        :class="{
          hidden: !isMenuOpen,
          block: isMenuOpen,
          'md:flex': true, // Always flex on desktop
        }"
        class="w-full md:w-auto order-3 md:order-2 absolute md:static inset-x-0 top-full md:bg-transparent bg-gray-200 md:bg-none z-40 md:z-auto"
      >
        <ul class="flex flex-col md:flex-row font-semibold md:space-x-6">
          <li
            :class="{
              'text-blue-500': isActive('home'),
              'hover:text-blue-400': !isActive('home'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('home')">Dashboard</a>
          </li>
          <li
            :class="{
              'text-blue-500': isActive('departments'),
              'hover:text-blue-400': !isActive('departments'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('departments')">Departments</a>
          </li>
          <li
            :class="{
              'text-blue-500': isActive('invitations'),
              'hover:text-blue-400': !isActive('invitations'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('invitations')">Invitations</a>
          </li>
          <li
            :class="{
              'text-blue-500': isActive('devices'),
              'hover:text-blue-400': !isActive('devices'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('devices')">Devices</a>
          </li>
          <li
            :class="{
              'text-blue-500': isActive('shared_sessions'),
              'hover:text-blue-400': !isActive('shared_sessions'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('shared_sessions')"
              >Shared with me</a
            >
          </li>
          <li
            :class="{
              'text-blue-500': isActive('profile'),
              'hover:text-blue-400': !isActive('profile'),
            }"
            class="px-4 py-2 md:py-0"
          >
            <a href="#" @click="navigateTo('profile')">Profile</a>
          </li>
        </ul>
      </div>

      <!-- Sign Out -->
      <div class="order-4 md:order-3">
        <div
          class="text-gray-500 font-semibold hover:text-blue-400 cursor-pointer"
          @click="handleSignOut"
        >
          Sign out
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { signOut } from "aws-amplify/auth";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// State for menu visibility
const isMenuOpen = ref(false);

const handleSignOut = async () => {
  await signOut();
  router.push({ name: "signin" });
};

const navigateTo = (name) => {
  router.push({ name });
  // Close the menu when navigating (for mobile)
  isMenuOpen.value = false;
};

const isActive = (name) => {
  return route.name === name;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
nav {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 50;
}

@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
    width: 100%;
  }
}
</style>
