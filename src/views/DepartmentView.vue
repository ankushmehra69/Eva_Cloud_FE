<template>
  <div class="container mx-auto p-8">
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>
    <div v-else-if="department">
      <div class="mb-8 text-center">
        <p class="text-3xl font-bold text-blue-500">{{ department.name }}</p>
        <p class="text-lg text-gray-600 mt-2">Manage the department below</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          @click="navigateToUsers"
          class="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:bg-blue-50"
        >
          <div class="flex flex-col items-center">
            <svg
              class="w-16 h-16 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A7.964 7.964 0 0112 15.5a7.964 7.964 0 016.879 2.304M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p class="text-xl font-semibold text-gray-700">
              Users ({{ department.total_users }})
            </p>
          </div>
        </div>
        <div
          @click="navigateToDevices"
          class="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:bg-blue-50"
        >
          <div class="flex flex-col items-center">
            <svg
              class="w-16 h-16 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16V8l-4 4m0 0l-4-4m4 4l4 4M3 5h18"
              />
            </svg>
            <p class="text-xl font-semibold text-gray-700">
              Devices ({{ department.total_devices }})
            </p>
          </div>
        </div>
        <div
          @click="navigateToSessions"
          class="cursor-pointer p-6 bg-white shadow-md rounded-lg hover:bg-blue-50"
        >
          <div class="flex flex-col items-center">
            <svg
              class="w-16 h-16 text-blue-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4h16v16H4V4zM9 9h6v6H9V9z"
              />
            </svg>
            <p class="text-xl font-semibold text-gray-700">
              Sessions ({{ department.total_sessions }})
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import backend from "@/backend";

const route = useRoute();
const router = useRouter();
const department = ref(null);
const errorMessage = ref("");

onMounted(async () => {
  const departmentId = route.params.id;
  try {
    department.value = await backend.departments.getDepartment(departmentId);
    navigateToSessions();
  } catch (error) {
    if (error.response && error.response.status === 403) {
      errorMessage.value =
        "You don't have permission to access this department.";
    } else {
      errorMessage.value =
        "An unexpected error occurred while fetching the department.";
    }
  }
});

const navigateTo = (path) => {
  router.push({ name: path, params: { id: route.params.id } });
};

function navigateToUsers() {
  router.push({ name: "department_users", params: { id: route.params.id } });
}

function navigateToDevices() {
  router.push({
    name: "department_devices",
    params: { department_id: route.params.id },
  });
}

function navigateToSessions() {
  router.push({
    name: "department_sessions",
    params: { department_id: route.params.id },
  });
}
</script>
