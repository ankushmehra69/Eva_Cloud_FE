<template>
  <div class="pt-3 flex flex-col h-full">
    <MobileHeader
      className="-m-4 p-4 md:p-0 md:-m-0 md:mb-5"
      :title="departmentName"
      :btnText="route.name === 'shared_media_list' ? 'Shared' : null"
      :clickHandler="
        () => {
          router.push({ name: 'shared_sessions' });
        }
      "
      :breadcrumbs="
        route.name === 'media_list'
          ? [
              { label: 'Deparments', action: () => goToDepartmentsPage() },
              { label: departmentName, action: () => goToDepartmentPage() },
              { label: 'Session' },
              { label: sessionName },
            ]
          : []
      "
    > 

      <button
          v-if="departmentId"
          @click="openReportModal"
          class="btn btn-primary flex-shrink-0 !rounded-xl !px-6 !py-3 text-base !font-light hidden md:flex items-center gap-2"
          >
          Report
        </button>

     <button
        @click="prepareCapture('image')"
        class="btn btn-primary flex-shrink-0 !rounded-xl !px-6 !py-3 text-base !font-light hidden md:flex items-center gap-2"
      >
        + Capture Image
      </button>

      <button
        @click="triggerFileInput"
        class="btn btn-primary flex-shrink-0 !rounded-xl !px-6 !py-3 text-base !font-light hidden md:flex items-center gap-2"
      >
        <span class="text-2xl leading-none">+</span> Add Media
      </button>
    </MobileHeader>
    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <!-- Search Section -->
    <div class="flex items-center mb-6 gap-4">
      <div class="flex items-center relative w-full">
        <input
          class="md:bg-white bg-grey-200/50 rounded-full w-full py-3 pl-11 md:pl-6 md:px-6 border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
          placeholder="Search img"
          type="text"
        />
        <button
          class="absolute md:right-1 left-0 md:left-auto top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
        >
          <SearchIcon />
        </button>
      </div>
      <select
        v-model="sortBy"
        class="border border-gray-300 md:px-4 px-2 py-3 rounded-lg focus:border-primary focus:shadow-primary/40"
      >
        <option value="recent">Recent</option>
        <option value="ASC">A to Z</option>
        <option value="last_updated">Last Updated</option>
        <option value="created_at">Created At</option>
      </select>
    </div>

    <!-- Session Details Section -->
    <div class="mb-6 bg-white shadow rounded-lg p-6 hidden">
      <!-- Add a button to open the comments modal -->
      <div class="flex justify-end">
        <button
          @click="showCommentsModal = true"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View Session Comments
        </button>
      </div>
      <h2 class="text-xl font-semibold text-gray-700 mb-2">Session Details</h2>
      <p><strong>ID:</strong> {{ session.id }}</p>
      <p><strong>Name:</strong> {{ session.name }}</p>
      <p><strong>Sample ID:</strong> {{ session.sample_id }}</p>
      <p><strong>Patient ID:</strong> {{ session.patient_id }}</p>
      <p><strong>Remarks:</strong> {{ session.remarks }}</p>
      <p><strong>Tags:</strong> {{ session.tags }}</p>
    </div>

    <!-- Add Media Button (Top-Right) -->
    <!-- <div class="mb-6 flex justify-end">
      <button
        @click="triggerFileInput"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        + Add Media
      </button>
    </div> -->

    <!-- Upload Progress Bar -->
    <div v-if="uploadProgress !== null" class="w-full mb-4">
      <h3 class="text-sm text-secondary mb-1 font-semibold">
        File Uploading...
      </h3>
      <div class="bg-white rounded-lg overflow-hidden h-4">
        <div
          :style="{ width: uploadProgress + '%' }"
          class="bg-blue-500 h-4 text-white text-center font-bold leading-4 text-sm"
        >
          {{ uploadProgress }}%
        </div>
      </div>
    </div>

    <!-- Media Table -->
    <div class="grid lg:grid-cols-5 grid-cols-3 gap-6 md:gap-y-10 py-4">
      <div
        class="cursor-pointer text-center flex flex-col justify-cente items-center relative"
        v-for="media in mediaList"
        :key="media.id"
      >
        <Menu
          :options="[
            {
              label: 'Edit',
              action: () => {
                openEditModal(media);
              },
            },
            {
              label: 'Download',
              action: () => {
                downloadMedia(media.id);
              },
            },
            {
              label: 'Delete',
              action: () => {
                deleteMedia(media.id);
              },
            },
          ]"
        >
          <div class="relative md:mb-5 mb-3" @click="goToMediaPage(media.id)">
            <!-- Badge -->
            <div
              class="absolute md:top-1 top-0 md:right-1 right-0 z-10 flex items-center justify-center w-7 h-7 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-black text-white rounded-full text-xs sm:text-sm md:text-base"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_163_951)">
                  <path
                    d="M1.53613 7.97428L5.63697 11.9931L13.8386 3.38135"
                    stroke="white"
                    stroke-opacity="0.85"
                    stroke-width="1.23025"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_163_951">
                    <rect
                      width="14.763"
                      height="14.763"
                      fill="white"
                      transform="translate(0.305908 0.305664)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <!-- Circular Image -->
            <div class="relative">
              <div
                v-if="media.thumbnail_url"
                class="relative z-8 size-24 md:size-32 xl:size-44 rounded-full overflow-hidden shadow-4xl"
              >
                <img
                  :src="media.thumbnail_url"
                  alt="Folder Image"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-else
                class="relative z-8 size-20 md:size-32 xl:size-48 flex items-center justify-center rounded-full overflow-hidden border border-grey-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="lg:size-20 md:size-16 size-8 text-secondary"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                  />
                </svg>
              </div>
              <div
                class="absolute inset-0 size-24 md:size-32 xl:size-44 rounded-full overflow-hidden flex items-end justify-center"
              >
                <div
                  class="bg-black/35 w-full md:pt-2 pt-1 md:pb-3 pb-2 px-4 backdrop-blur-sm"
                >
                  <div
                    class="md:text-sm text-xs mb-px px-3 md:mb-0 font-medium text-white truncate"
                  >
                    {{ media.name }}
                  </div>
                  <div
                    class="md:text-[9px] text-[8px] font-light text-grey-300 flex items-center gap-1 justify-center"
                  >
                    <span class="hidden md:inline">Time: </span>
                    <span>{{ formattedTime(media.created_at) }}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.38973 15.8272H5.71563C3.53976 15.8239 1.77588 14.126 1.77588 12.0313C1.77588 9.93751 3.53976 8.23962 5.71563 8.23962C6.0481 6.749 7.23332 5.53247 8.82462 5.04772C10.4151 4.56382 12.1713 4.88445 13.4302 5.89371C14.689 6.90043 15.2592 8.43758 14.9275 9.9282H15.7651C16.9393 9.9282 17.9519 10.6219 18.4198 11.6261M12.7737 16.6698L14.4656 18.3618L17.8496 14.9779"
                        stroke="currentColor"
                        stroke-width="1.26898"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Menu>
        <button class="btn btn-secondary !rounded-xl">Annotate</button>
      </div>
    </div>
    <div class="overflow-x-auto bg-white shadow rounded-lg !hidden">
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
                @click.stop="downloadMedia(media.id)"
                class="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 flex items-center space-x-2"
              >
                <ArrowDownTrayIcon class="h-5 w-5" />
                <span>Download</span>
              </button>
              <button
                @click.stop="deleteMedia(media.id)"
                class="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center space-x-2"
              >
                <TrashIcon class="h-5 w-5" />
                <span>Delete</span>
              </button>

              <button
                @click.stop="openEditModal(media)"
                class="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 flex items-center space-x-2"
              >
                <PencilIcon class="h-5 w-5" />
                <span>Edit</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination
      v-if="totalMedia > mediaPerPage"
      :totalItems="totalMedia"
      :currentPage="currentPage"
      :itemsPerPage="mediaPerPage"
      @update:currentPage="handlePageChange"
    />

    <div v-if="showEditModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-xl font-semibold mb-4">Edit Media Name</h2>
          <label for="mediaName" class="block text-gray-700"
            >New Media Name:</label
          >
          <input
            id="mediaName"
            type="text"
            v-model="editMediaName"
            class="w-full border border-gray-300 p-2 rounded-lg mb-4"
          />
          <div class="flex justify-end space-x-2">
            <button
              @click="updateMediaName()"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              @click="closeEditModal"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input
      type="file"
      ref="fileInput"
      accept="image/*,video/*"
      class="hidden"
      @change="handleFileSelected"
    />

      <!-- Hidden Capture Input for both image and video -->
      <input
      type="file"
      ref="captureInput"
      class="hidden"
      @change="handleFileSelected"
    />

    <!-- Include the CommentsModal component -->
    <CommentsModal
      :sessionId="sessionId"
      :isVisible="showCommentsModal"
      @close="showCommentsModal = false"
    />

    <SessionReportModal
      v-if="departmentId"
      :sessionId="sessionId"
      :departmentId="departmentId"
      :isVisible="showReportModal"
      @close="closeReportModal"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import backend from "@/backend";
import {
  TrashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/vue/24/solid";
import { useRoute, useRouter } from "vue-router";
import CommentsModal from "@/components/CommentsModal.vue";
import Pagination from "@/components/Pagination.vue";
import SessionReportModal from "@/components/SessionReportModal.vue";
import MobileHeader from "@/components/MobileHeader.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import Menu from "@/components/form/menu.vue";

const route = useRoute();
const router = useRouter();
const fileInput = ref(null);
const departmentId = ref(route.params.department_id || null);
const sessionId = ref(route.params.session_id || null);
const mediaList = ref([]);
const errorMessage = ref("");
const selectedFile = ref(null);
const uploadProgress = ref(null);

const departmentName = ref(""); 
const sessionName = ref("");
const session = ref({});
const showCommentsModal = ref(false);

const showEditModal = ref(false);
const editMediaName = ref("");
const currentMediaId = ref(null);

const currentPage = ref(1); // Track the current page
const mediaPerPage = 5; // Number of media items per page
const totalMedia = ref(0); // Total number of media items

//modals
const showReportModal = ref(false);

// for capturing the image and the video 
const captureInput = ref(null);
const captureType = ref("image");

const formattedTime = (value) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};


const prepareCapture = (type) => {
  captureType.value = type;
  triggerCaptureInput();
}

const triggerCaptureInput = () => {
  if (captureType.value === "image") {
    captureInput.value.setAttribute("accept", "image/*");
    captureInput.value.setAttribute("capture", "camera"); // Use camera for images
  } else if (captureType.value === "video") {
    captureInput.value.setAttribute("accept", "video/*");
    captureInput.value.setAttribute("capture", "camcorder"); // Use camcorder for videos
  }
  captureInput.value.click();
};


// Fetch the media files with pagination
const fetchMedia = async () => {
  try {
    const offset = (currentPage.value - 1) * mediaPerPage;

    const response = await backend.media.listMedia(
      sessionId.value,
      mediaPerPage,
      offset,
      true
    );

    mediaList.value = response.media_files;
    totalMedia.value = response.total_count; // Capture total count for pagination
  } catch (error) {
    errorMessage.value = "Failed to fetch media.";
  }
};

// Handle page change event from Pagination component
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Watch for page changes and refetch media
watch(currentPage, fetchMedia);

// Trigger file input
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selected for upload
const handleFileSelected = (event) => {
  event.preventDefault(); // Prevent default behavior
  event.stopPropagation();
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    uploadFile();
  }

};

// report modals
const openReportModal = () => {
  showReportModal.value = true;
};

const closeReportModal = () => {
  showReportModal.value = false;
};

// Determine media type from file extension
const getMediaType = (file) => {
  const fileName = file.name || "";
  const fileExtension = fileName.includes(".")
    ? fileName.split(".").pop().toLowerCase()
    : "";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv"];

  if (imageExtensions.includes(fileExtension)) {
    return "image";
  } else if (videoExtensions.includes(fileExtension)) {
    return "video";
  }

  // If the file type is not recognized, return null
  return null;
};

// Upload file to the backend
const uploadFile = async () => {
  try {
    const mediaType = getMediaType(selectedFile.value);

    if (!mediaType) {
      errorMessage.value =
        "Invalid file type. Only images and videos are allowed.";
      return;
    }

    // Get a presigned URL from the backend
    const uploadUrl = (
      await backend.media.addMedia(
        sessionId.value,
        mediaType,
        selectedFile.value.name
      )
    )?.url;

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        uploadProgress.value = Math.round((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        fetchMedia();
        uploadProgress.value = null;
      } else {
        console.error("Upload failed with status:", xhr.status);
        uploadProgress.value = null;
      }
    };

    xhr.onerror = () => {
      console.error("Upload failed");
      uploadProgress.value = null;
    };

    xhr.send(selectedFile.value);
  } catch (error) {
    console.error("Error uploading file:", error);
    uploadProgress.value = null;
  }
};

// Download media
const downloadMedia = async (mediaId) => {
  try {
    const mediaUrl = (await backend.media.getMedia(mediaId))?.url;
    window.open(mediaUrl, "_blank");
  } catch (error) {
    errorMessage.value = "Failed to download media.";
  }
};

// Delete media
const deleteMedia = async (mediaId) => {
  try {
    await backend.media.deleteMedia(mediaId);
    fetchMedia(); // Refresh the media list after deleting
  } catch (error) {
    errorMessage.value = "Failed to delete media.";
  }
};

// Open Edit Modal
const openEditModal = (media) => {
  editMediaName.value = media.name;
  currentMediaId.value = media.id;
  showEditModal.value = true;
};

// Close Edit Modal
const closeEditModal = () => {
  showEditModal.value = false;
  editMediaName.value = "";
  currentMediaId.value = null;
};

// Update Media Name
const updateMediaName = async () => {
  try {
    await backend.media.updateMedia(currentMediaId.value, {
      name: editMediaName.value,
    });
    fetchMedia(); // Refresh the media list after updating
    closeEditModal();
  } catch (error) {
    errorMessage.value = "Failed to update media.";
  }
};

// Fetch department and session names
const fetchBreadcrumbData = async () => {
  try {
    // Fetch department name only if there's a department ID (for department view)
    if (departmentId.value) {
      const department = await backend.departments.getDepartment(
        departmentId.value
      );
      departmentName.value = department.name;
    }

    // Fetch session name (applies to both department and shared_with_me views)
    session.value = await backend.sessions.getSession(sessionId.value);
    sessionName.value = session.value.name;
  } catch (error) {
    errorMessage.value = "Failed to fetch department or session details.";
  }
};

// Navigation functions for breadcrumbs
const goToDepartmentsPage = () => {
  router.push("/departments");
};

const goToDepartmentPage = () => {
  router.push(`/departments/${route.params.department_id}`);
};

const goToSessionPage = () => {
  router.push(`/departments/${route.params.department_id}/sessions`);
};

const goToMediaPage = (mediaId) => {
  const departmentId = route.params.department_id;
  const sessionId = route.params.session_id;

  if (departmentId) {
    router.push({
      name: "media",
      params: {
        department_id: departmentId,
        session_id: sessionId,
        media_id: mediaId,
      },
    });
  } else {
    router.push({
      name: "shared_media",
      params: {
        session_id: sessionId,
        media_id: mediaId,
      },
    });
  }
};

onMounted(() => {
  fetchMedia();
  fetchBreadcrumbData();
});
</script>
