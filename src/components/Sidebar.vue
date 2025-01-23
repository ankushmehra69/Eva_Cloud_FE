<template>
  <div class="relative hidden md:block">
    <div class="flex items-center gap-4 absolute top-14 -right-4 z-50">
      <button
        class="text-secondary text-sm h-8 w-8 rounded-full flex items-center justify-center bg-white"
        @click="isOpen = !isOpen"
      >
        <ArrowIcon :class="isOpen ? '' : 'rotate-180'" />
      </button>
    </div>
    <div
      class="flex-shrink-0 flex flex-col z-40 shadow-3xl bg-white rounded-3xl py-2 h-full relative transition-all duration-300 overflow-hidden"
      :class="isOpen ? 'w-64 p-6' : 'w-20 p-4'"
    >
      <div
        class="flex items-center gap-4 pt-6 transition-all"
        :class="isOpen ? 'px-2' : 'px-0.5'"
      >
        <div
          class="w-11 h-11 flex items-center justify-center font-light text-sm bg-primary text-white rounded-full flex-shrink-0"
        >
          {{ user.name.charAt(0) }}
        </div>
        <div
          class="flex flex-col"
          :class="isOpen ? 'opacity-100' : 'opacity-0'"
        >
          <h1 class="text-xs font-medium text-grey-100 uppercase">Admin</h1>
          <p class="text-base text-secondary font-semibold">{{ user.name }}</p>
        </div>
      </div>
      <hr class="my-4 bg-custom-radial border-0 h-px" />
      <ul class="flex flex-col flex-1">
        <li
          v-for="navigation in navigations"
          :key="navigation.name"
          :class="[
            isOpen ? 'px-5 py-3.5' : 'p-3',
            isActive(navigation.name)
              ? 'bg-primary text-white'
              : 'hover:bg-grey-300/50 text-grey-100',
          ]"
          class="rounded-lg cursor-pointer text-sm flex items-center gap-4 whitespace-nowrap transition-all overflow-hidden"
          @click="navigateTo(navigation.name)"
        >
          <component :is="navigation.icon" class="flex-shrink-0" />
          <span :class="isOpen ? 'w-auto' : '!w-0 opacity-0'">{{
            navigation.label
          }}</span>
        </li>
      </ul>
      <div
        :class="isOpen ? 'px-5 py-3.5' : 'p-3'"
        class="mt-auto mb-4 hover:bg-danger/10 text-danger rounded-lg cursor-pointer text-sm flex items-center gap-4 whitespace-nowrap transition-all overflow-hidden"
        @click="handleSignOut"
      >
        <ArrowLeftStartOnRectangleIcon class="flex-shrink-0 w-6" />
        <span :class="isOpen ? 'w-auto' : '!w-0 opacity-0'">Sign out</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { signOut } from "aws-amplify/auth";
import { useRouter, useRoute } from "vue-router";
import ArrowIcon from "./icons/ArrowIcon.vue";
import HomeIcon from "./icons/HomeIcon.vue";
import ShareWithMeIcon from "./icons/ShareWithMeIcon.vue";
import ProfileIcon from "./icons/ProfileIcon.vue";
import InvitationsIcon from "./icons/InvitationsIcon.vue";
import backend from "@/backend";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();

const user = ref({
  name: "",
});

const handleSignOut = async () => {
  await signOut();
  router.push({ name: "signin" });
};

const navigations = [
  { icon: HomeIcon, name: "home", label: "Dashboard" },
  {
    icon: ShareWithMeIcon,
    name: "shared_sessions",
    label: "Shared with me",
  },
  { icon: ProfileIcon, name: "profile", label: "Profile" },
  { icon: InvitationsIcon, name: "invitations", label: "Invitations" },
];


onMounted(async () => {
  try {
    const response = await backend.users.getUser("self");
    user.value = { ...response };
  } catch (e) {
    error.value = "Failed to load profile data.";
  }
});
let isOpen = ref(false);

const navigateTo = (name) => {
  router.push({ name });
  isOpen = false;
};

const isActive = (name) => {
  return route.name === name;
};
</script>
