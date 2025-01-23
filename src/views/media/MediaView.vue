<template>
  <div class="flex flex-col h-full">
    <div class="bg-white rounded-2xl md:p-4 pb-4">
      <MobileHeader
        className="!mb-0"
        title="Media Details"
        :btnText="null"
        :breadcrumbs="
          route.name === 'media'
            ? [
                { label: 'Deparments', action: () => goToDepartmentsPage() },
                { label: departmentName, action: () => goToDepartmentPage() },
                { label: 'Sessions', action: () => goToSessionsPage() },
                { label: sessionName, action: () => goToSessionPage() },
                { label: media.name || 'Unnamed Media' },
              ]
            : route.name === 'shared_media'
            ? [
                {
                  label: 'Shared Sessions',
                  action: () => router.push({ name: 'shared_sessions' }),
                },
                { label: sessionName, action: () => goToSharedSessionPage() },
              ]
            : route.name === 'public_media'
            ? [
                {
                  label: 'Session',
                  action: () => goToPublicSessionPage(),
                },
              ]
            : []
        "
      >
        <div class="md:hidden">
          <Menu
            :isDoubleClick="false"
            :options="[
              { label: 'Share', action: () => {} },
              { label: 'Delete', action: () => {} },
              { label: 'Info', action: () => infoHandler() },
            ]"
          >
            <button
              class="focus:bg-secondary cursor-pointer size-6 focus:text-white flex items-center justify-center rounded-full"
            >
              <svg
                class="size-4"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.675 2.317C11.249 0.561 8.751 0.561 8.325 2.317C8.26108 2.5808 8.13578 2.82578 7.95929 3.032C7.7828 3.23822 7.56011 3.39985 7.30935 3.50375C7.05859 3.60764 6.78683 3.65085 6.51621 3.62987C6.24559 3.60889 5.98375 3.5243 5.752 3.383C4.209 2.443 2.442 4.209 3.382 5.753C3.5231 5.98466 3.60755 6.24634 3.62848 6.51677C3.64942 6.78721 3.60624 7.05877 3.50247 7.30938C3.3987 7.55999 3.23726 7.78258 3.03127 7.95905C2.82529 8.13553 2.58056 8.26091 2.317 8.325C0.560999 8.751 0.560999 11.249 2.317 11.675C2.5808 11.7389 2.82578 11.8642 3.032 12.0407C3.23822 12.2172 3.39985 12.4399 3.50375 12.6907C3.60764 12.9414 3.65085 13.2132 3.62987 13.4838C3.60889 13.7544 3.5243 14.0162 3.383 14.248C2.443 15.791 4.209 17.558 5.753 16.618C5.98466 16.4769 6.24634 16.3924 6.51677 16.3715C6.78721 16.3506 7.05877 16.3938 7.30938 16.4975C7.55999 16.6013 7.78258 16.7627 7.95905 16.9687C8.13553 17.1747 8.26091 17.4194 8.325 17.683C8.751 19.439 11.249 19.439 11.675 17.683C11.7389 17.4192 11.8642 17.1742 12.0407 16.968C12.2172 16.7618 12.4399 16.6001 12.6907 16.4963C12.9414 16.3924 13.2132 16.3491 13.4838 16.3701C13.7544 16.3911 14.0162 16.4757 14.248 16.617C15.791 17.557 17.558 15.791 16.618 14.247C16.4769 14.0153 16.3924 13.7537 16.3715 13.4832C16.3506 13.2128 16.3938 12.9412 16.4975 12.6906C16.6013 12.44 16.7627 12.2174 16.9687 12.0409C17.1747 11.8645 17.4194 11.7391 17.683 11.675C19.439 11.249 19.439 8.751 17.683 8.325C17.4192 8.26108 17.1742 8.13578 16.968 7.95929C16.7618 7.7828 16.6001 7.56011 16.4963 7.30935C16.3924 7.05859 16.3491 6.78683 16.3701 6.51621C16.3911 6.24559 16.4757 5.98375 16.617 5.752C17.557 4.209 15.791 2.442 14.247 3.382C13.247 3.99 11.951 3.452 11.675 2.317Z"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13 10C13 10.7956 12.6839 11.5587 12.1213 12.1213C11.5587 12.6839 10.7956 13 10 13C9.20435 13 8.44129 12.6839 7.87868 12.1213C7.31607 11.5587 7 10.7956 7 10C7 9.20435 7.31607 8.44129 7.87868 7.87868C8.44129 7.31607 9.20435 7 10 7C10.7956 7 11.5587 7.31607 12.1213 7.87868C12.6839 8.44129 13 9.20435 13 10Z"
                  stroke="currentColor"
                  stroke-width="1.50857"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </Menu>
        </div>
      </MobileHeader>
    </div>

    <AnnotationCanvas
      ref="ac"
      alt="Media Image"
      v-show="media.media_type === 'image'"
      :infoHandler="infoHandler"
    />

    <div v-if="media.media_type === 'video'" class="mt-4">
      <video controls :src="media.url" class="w-full h-full"></video>
    </div>

    <div
      v-if="media.media_type !== 'image' && media.media_type !== 'video'"
      class="flex flex-1 justify-center items-center"
    >
      <p class="text-gray-500">Unsupported media type.</p>
    </div>

    <!-- Media Details Section -->
    <div
      v-if="infoModal"
      class="fixed inset-0 md:z-30 z-40 md:pl-44 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
      @click="handleOutsideClick"
    >
      <div
        class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-sm"
        ref="modalInfo"
      >
        <!-- Close Button -->
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="md:-mt-3 md:-mr-3 text-3xl text-gray-600 hover:text-secondary transition transform hover:scale-110"
          >
            &times;
          </button>
        </div>
        <h2
          class="-mt-6 text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Media Information
        </h2>
        <ul class="space-y-2 text-sm pb-4">
          <li class="md:flex">
            <p class="md:w-24 font-semibold">ID:</p>
            {{ media.id }}
          </li>
          <li class="md:flex">
            <p class="md:w-24 font-semibold">Name:</p>
            {{ media?.name }}
          </li>
          <li class="md:flex">
            <p class="md:w-24 font-semibold">Session ID:</p>
            {{ media.session_id }}
          </li>
          <li class="md:flex">
            <p class="md:w-24 font-semibold">Media Type:</p>
            {{ media.media_type }}
          </li>
          <li class="md:flex">
            <p class="md:w-24 font-semibold">Created At:</p>
            {{ formattedDate(media.created_at) }}
          </li>
          <li class="md:flex">
            <p class="md:w-24 font-semibold">Updated At:</p>
            {{ formattedDate(media.updated_at) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import backend from "@/backend";
import AnnotationCanvas from "./components/AnnotationCanvas.vue";
import MobileHeader from "@/components/MobileHeader.vue";
import Menu from "@/components/form/menu.vue";

// Define refs
const route = useRoute();
const router = useRouter();
const mediaId = ref(route.params.media_id || null);
const media = ref({});
const departmentName = ref("");
const sessionName = ref("");
const departmentId = ref(null);
const sessionId = ref(null);
const errorMessage = ref("");
const ac = ref(null);
const infoModal = ref(false);
const modalInfo = ref(null);

const infoHandler = () => {
  infoModal.value = !infoModal.value;
};
const closeModal = () => {
  infoModal.value = !infoModal.value;
};
// Handle clicks outside the modal content to close the modal
const handleOutsideClick = (event) => {
  if (modalInfo.value && !modalInfo.value.contains(event.target)) {
    closeModal();
  }
};

const formattedDate = (value) => {
  const date = new Date(value);
  return date
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");
};

// Fetch media details
const fetchMedia = async () => {
  try {
    if (route.name === "public_media") {
      media.value = await backend.public.getPublicMedia(mediaId.value);
      if (media.value.media_type === "image") {
        await ac.value.load(media.value, true);
      }
      sessionId.value = media.value.session_id;
    } else {
      media.value = await backend.media.getMedia(mediaId.value);
      if (media.value.media_type === "image") {
        await ac.value.load(media.value);
      }
      sessionId.value = media.value.session_id;
      if (route.name !== "shared_media") {
        await fetchBreadcrumbData(); // Fetch breadcrumbs after getting session details
      }
    }
  } catch (error) {
    errorMessage.value = "Failed to fetch media details.";
  }
};

// Fetch session and department details for breadcrumbs
const fetchBreadcrumbData = async () => {
  try {
    const session = await backend.sessions.getSession(sessionId.value);
    sessionName.value = session.name;
    departmentId.value = session.department_id;

    const department = await backend.departments.getDepartment(
      departmentId.value
    );
    departmentName.value = department.name;
  } catch (error) {
    errorMessage.value = "Failed to fetch breadcrumb data.";
  }
};

// Navigation functions for breadcrumbs
const goToDepartmentsPage = () => {
  router.push("/departments");
};

const goToDepartmentPage = () => {
  if (departmentId.value) {
    router.push(`/departments/${departmentId.value}`);
  }
};

const goToSessionsPage = () => {
  router.push(`/departments/${departmentId.value}/sessions`);
};

const goToSessionPage = () => {
  if (sessionId.value && departmentId.value) {
    router.push(
      `/departments/${departmentId.value}/sessions/${sessionId.value}`
    );
  }
};

const goToSharedSessionPage = () => {
  router.push({
    name: "shared_media_list",
    params: { session_id: sessionId.value },
  });
};

const goToPublicSessionPage = () => {
  router.push({
    name: "public_session",
    params: { session_id: sessionId.value },
  });
};

// Fetch media details on mount
onMounted(() => {
  fetchMedia();
});
</script>
