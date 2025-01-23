<script setup>
import { RouterView, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import ErrorPopup from "@/components/ErrorPopup.vue";
import { ref, watch } from "vue";
import { fetchAuthSession } from "aws-amplify/auth";
import Sidebar from "@/components/Sidebar.vue";
import MobileNav from "@/components/MobileNav.vue";
const isAuthPage = ref(false);
const isPublicPage = ref(false);
const isLoggedIn = ref(false);

const route = useRoute();
watch(
  route,
  async (newRoute) => {
    isAuthPage.value =
      newRoute.name === "signin" ||
      newRoute.name === "signup" ||
      newRoute.name === "splash";

    isPublicPage.value =
      newRoute.name === "public_session" || newRoute.name === "public_media";

    if ((await fetchAuthSession())?.tokens) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  },
  { immediate: true }
);
console.log("route =>", route.name);
</script>

<template>
  <div class="h-screen">
    <LoadingOverlay />
    <ErrorPopup />
    <!-- Conditionally render the navbar -->
    <!-- <Navbar v-if="!isAuthPage && (!isPublicPage || isLoggedIn)" /> -->
    <!-- Main content -->
    <div
      class="flex bg-white md:bg-grey-300 gap-8 md:h-full h-[calc(100vh-58px)]"
      :class="{
        '!bg-grey-300': route.name === 'department_devices',
        'md:py-6 py-4 md:pl-6 pl-4': !isAuthPage && !isPublicPage,
        '!h-screen': route.name === 'media'
      }"
    >
      <Sidebar v-if="!isAuthPage && !isPublicPage" />
      <!-- Add padding to prevent content from being hidden behind the fixed navbar -->
      <div
        class="w-full md:overflow-y-auto"
        :class="{ 'md:pr-6 pr-4': !isAuthPage && !isPublicPage }"
      >
        <RouterView />
      </div>
    </div>
    <MobileNav v-if="(!isAuthPage || !isPublicPage) && route.name !== 'media'" />
  </div>
</template>

<style>
/* Ensure main content is not hidden behind the fixed navbar */
</style>
