<template>
  <div class="container mx-auto p-8">
    <!-- Sign-in / Sign-up Button -->
    <div class="flex justify-end mb-4">
      <button
        @click="goToSignIn"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sign In / Sign Up
      </button>
    </div>

    <h1 class="text-2xl font-bold text-blue-500 mb-6 text-center">
      Session Media
    </h1>

    <!-- Session Details Section -->
    <div class="mb-6 bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Session Details</h2>
      <p><strong>ID:</strong> {{ session.id }}</p>
      <p><strong>Name:</strong> {{ session.name }}</p>
      <p><strong>Sample ID:</strong> {{ session.sample_id }}</p>
      <p><strong>Patient ID:</strong> {{ session.patient_id }}</p>
      <p><strong>Remarks:</strong> {{ session.remarks }}</p>
      <p><strong>Tags:</strong> {{ session.tags }}</p>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <!-- Media Table -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Thumbnail</th>
            <th class="py-2 px-4 text-left">Name</th>
            <th class="py-2 px-4 text-left">Media Type</th>
            <th class="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="media in mediaList"
            :key="media.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToMediaPage(media.id)"
          >
            <td class="py-2 px-4 text-sm text-left">{{ media.id }}</td>
            <td v-if="media?.thumbnail_url" class="py-2 px-4 text-sm text-left">
              <img
                :src="media.thumbnail_url"
                alt="Thumbnail"
                class="w-48 h-auto"
              />
            </td>
            <td v-else class="py-2 px-4 text-sm text-left">No Thumbnail</td>
            <td class="py-2 px-4 text-sm text-left">{{ media.name }}</td>
            <td class="py-2 px-4 text-sm text-left">{{ media.media_type }}</td>
            <td class="py-2 px-4 flex justify-left space-x-2">
              <button
                @click="downloadMedia(media.id)"
                class="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center space-x-2"
              >
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Download</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination Component -->
    <Pagination
      :total-items="totalItems"
      :items-per-page="limit"
      :current-page="currentPage"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import backend from "@/backend";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/solid";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";

const route = useRoute();
const router = useRouter();
const sessionId = ref(route.params.session_id || null);
const mediaList = ref([]);
const session = ref({});
const errorMessage = ref("");
const totalItems = ref(0);
const currentPage = ref(1);
const limit = ref(5);

// Fetch the media files for the session
const fetchMedia = async () => {
  try {
    const offset = (currentPage.value - 1) * limit.value;
    const response = await backend.public.listPublicMedia(
      sessionId.value,
      limit.value,
      offset,
      true
    );
    mediaList.value = response.media_files;
    totalItems.value = response.total_count;
  } catch (error) {
    errorMessage.value = "Failed to fetch media.";
  }
};

// Handle page change
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  fetchMedia();
};

// Watch for changes in currentPage and fetch media accordingly
watch(currentPage, () => {
  fetchMedia();
});

// Download media
const downloadMedia = async (mediaId) => {
  try {
    const mediaUrl = (await backend.public.getPublicMedia(mediaId))?.url;
    window.open(mediaUrl, "_blank");
  } catch (error) {
    errorMessage.value = "Failed to download media.";
  }
};

// Fetch session details
const fetchSessionDetails = async () => {
  try {
    session.value = await backend.public.getPublicSession(sessionId.value);
  } catch (error) {
    errorMessage.value = "Failed to fetch session details.";
  }
};

// Sign-in or Sign-up navigation
const goToSignIn = () => {
  router.push("/signin");
};

const goToMediaPage = (mediaId) => {
  const sessionId = route.params.session_id;

  router.push({
    name: "public_media",
    params: {
      session_id: sessionId,
      media_id: mediaId,
    },
  });
};

onMounted(() => {
  fetchMedia();
  fetchSessionDetails();
});
</script>

<style scoped>
/* Optional styling for a cleaner layout */
</style>
