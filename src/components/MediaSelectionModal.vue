<template>
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click="close"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[60vh] overflow-y-auto mx-4 sm:mx-auto p-6 relative"
        @click.stop
      >
        <!-- Modal Header -->
        <h2 class="text-xl font-semibold text-center mb-4">Select Media</h2>
  
        <!-- Loading / No Media Message -->
        <div v-if="loading" class="text-center text-gray-500 mb-4">
          Loading...
        </div>
        <div v-else-if="!mediaList.length" class="text-center text-gray-500 mb-4">
          No media with images found.
        </div>
  
        <!-- Media Thumbnails Grid -->
        <div
          v-if="mediaList.length"
          class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4"
        >
          <div
            v-for="media in mediaList"
            :key="media.id"
            class="cursor-pointer"
            @click="selectMedia(media.id)"
          >
            <img
              :src="media.thumbnail_url"
              alt="Thumbnail"
              class="w-full h-auto rounded shadow hover:opacity-80 border-2"
              :class="{
                'border-blue-500': selectedMediaId === media.id,
                'border-transparent': selectedMediaId !== media.id,
              }"
            />
          </div>
        </div>
  
        <!-- Description Input (Show only if media is selected) -->
        <div v-if="selectedMediaId" class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Description</label
          >
          <textarea
            v-model="description"
            id="description"
            rows="2"
            placeholder="Add an optional description..."
            class="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <button
            @click="close"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            @click="addMediaToReport"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            :disabled="!selectedMediaId"
          >
            Add Media
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import backend from "@/backend";
  
  const props = defineProps({
    isVisible: { type: Boolean, required: true },
    sessionId: { type: String, required: true },
    reportId: { type: String, required: true },
  });
  const emit = defineEmits(["close", "mediaAdded"]);
  
  const mediaList = ref([]);
  const selectedMediaId = ref(null);
  const description = ref("");
  const loading = ref(true);
  
  // Fetch media files
  const fetchMedia = async () => {
    try {
      const response = await backend.media.listMedia(
        props.sessionId,
        20,
        0,
        true
      );
      mediaList.value = response.media_files.filter(
        (media) => media.media_type === "image" && media.thumbnail_url
      );
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      loading.value = false;
    }
  };
  
  // Select media function
  const selectMedia = (mediaId) => {
    selectedMediaId.value = mediaId;
  };
  
  // Add media to session report
  const addMediaToReport = async () => {
    if (selectedMediaId.value) {
      await backend.session_report_media.addMediaToSessionReport(
        props.reportId,
        selectedMediaId.value,
        description.value
      );
      emit("mediaAdded", {
        mediaId: selectedMediaId.value,
        description: description.value,
      });
      close();
    }
  };
  
  // Close modal and reset selection
  const close = () => {
    selectedMediaId.value = null;
    description.value = "";
    emit("close");
  };
  
  onMounted(fetchMedia);
  </script>
  
  <style scoped>
  /* Adjust grid layout for different screen sizes */
  @media (min-width: 640px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (max-width: 639px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
  