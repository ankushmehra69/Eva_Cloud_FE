<template>
  <div class="relative shadow-5xl py-2 px-4 md:hidden">
    <ul class="flex justify-between gap-2">
      <li
        v-for="navigation in navigations"
        :key="navigation.name"
        :class="[isActive(navigation.name) ? 'text-primary' : 'text-grey-100']"
        class="rounded-lg cursor-pointer text-[11px] flex flex-col items-center gap-px whitespace-nowrap transition-all overflow-hidden"
        @click="navigateTo(navigation.name)"
      >
        <component :is="navigation.icon" class="flex-shrink-0" />
        <span>{{ navigation.label }}</span>
      </li>
      <li
        class="text-danger cursor-pointer text-[11px] flex flex-col items-center gap-px whitespace-nowrap transition-all overflow-hidden"
        @click="handleSignOut"
      >
        <ArrowLeftStartOnRectangleIcon class="flex-shrink-0 w-6" />
        <span :class="isOpen ? 'w-auto' : '!w-0 opacity-0'">Sign out</span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { signOut } from "aws-amplify/auth";
import { useRouter, useRoute } from "vue-router";
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
    label: "Shared",
  },
  { icon: InvitationsIcon, name: "invitations", label: "Invitations" },
  { icon: ProfileIcon, name: "profile", label: "Profile" },
];

onMounted(async () => {
  try {
    const response = await backend.users.getUser("self");
    user.value = { ...response };
    console.log(user.value);
  } catch (e) {
    error.value = "Failed to load profile data.";
  }
});
let isOpen = ref(true);

const navigateTo = (name) => {
  router.push({ name });
  isOpen = false;
};

const isActive = (name) => {
  return route.name === name;
};
</script>
