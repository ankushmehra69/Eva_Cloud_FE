<template>
  <div class="pt-3">
    <MobileHeader className="bg-white -m-4 -mt-7 p-4 pt-7 !mb-0 md:p-0 md:-m-0 md:bg-transparent md:!mb-5"
      :title="departmentName"
      btnText="Add Device"
      :clickHandler="()=>{isAddModalVisible = true}"
      :breadcrumbs="
        !isSharedWithMeRoute
          ? [
              { label: 'Deparments', action: () => goToDepartmentsPage() },
              { label: departmentName, action: () => goToDepartmentPage() },
              { label: 'Devices' },
            ]
          : []
      "
    />

    <Tabs
      :tabs="[
        {
          label: 'Sessions',
          action: () => {
            router.push({
              name: 'department_sessions',
              params: { department_id: departmentId },
            });
          },
        },
        {
          label: 'Users',
          action: () => {
            router.push({
              name: 'department_users',
              params: { id: route.params.department_id },
            });
          },
        },
        {
          label: 'Devices',
          action: () => {
            router.push({
              name: 'department_devices',
              params: { department_id: departmentId },
            });
          },
          active: true,
        },
      ]"
    />

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="text-sm text-red-600 bg-red-100/50 border border-red-500 w-full rounded-lg py-3 px-4 mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <div class="flex items-center relative mb-6">
      <input
        class="bg-white rounded-full w-full py-3 px-6 border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
        placeholder="Search text"
        type="text"
        v-model="searchQuery"
      />
      <button
        class="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
      >
        <SearchIcon />
      </button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="(item, index) in devices"
        :key="index"
        class="bg-white md:py-5 md:px-6 p-4 rounded-2xl flex flex-col gap-3 justify-between items-center cursor-pointer"
        @click="router.push(`/departments/${departmentId}/devices/${item.id}`)"
      >
        <!-- @click.stop="showEditModal(item)" -->
        <div class="flex items-center justify-between w-full">
          <p class="md:text-2xl text-lg font-light text-secondary">
            {{ item.name }}
          </p>
          <div class="text-right">
            <p class="md:text-xs text-[8px] text-black/70 font-light">
              Storage
            </p>
            <p class="md:text-base text-sm text-black/70 font-light">
              {{ (item.storage_used / (1024 * 1024 * 1024)).toFixed(2) }} / 10
              GB
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between w-full font-light">
          <div>
            <p class="md:text-2xl text-base font-normal text-secondary">
              {{ item.linked_department_name || "N/A" }}
            </p>
            <p class="md:text-base text-sm text-secondary">
              {{ item.linked_user_name || "N/A" }} •
              {{ item.linked_user_email || "N/A" }}
            </p>
          </div>
          <div class="mt-2">
            <ArrowRightIcon className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      v-if="totalDevices > devicesPerPage"
      :totalItems="totalDevices"
      :currentPage="currentPage"
      :itemsPerPage="devicesPerPage"
      @update:currentPage="handlePageChange"
    />

    <!-- Add Device Modal -->
    <div
      v-if="isAddModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Add New Device
        </h2>
        <form class="space-y-3" @submit.prevent="addDeviceHandler">
          <form-input
            label="Android ID"
            id="android_id"
            type="text"
            v-model="newDeviceAndroidId"
            size="sm"
            placeholder="Enter Android ID"
          />
          <form-input
            label="Name"
            id="name"
            type="text"
            v-model="newDeviceName"
            size="sm"
            placeholder="Enter device name"
          />
          <div class="!mb-6">
            <label
              class="block mb-1 text-secondary text-sm md:text-base font-medium"
              >Linked Department (Optional)</label
            >
            <select
              v-model="newDeviceDepartmentId"
              class="w-full px-3 py-2 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light rounded-lg focus:outline-none focus:shadow-sm"
            >
              <option :value="null">None</option>
              <option
                v-for="department in departments"
                :key="department.id"
                :value="department.id"
              >
                {{ department.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="isAddModalVisible = false"
              class="btn btn-outline !rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary !rounded-xl">
              Add Device
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import backend from "@/backend";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import FormInput from "@/components/form/Input.vue";
import MobileHeader from "@/components/MobileHeader.vue";
import Tabs from "@/components/Tabs.vue";

const route = useRoute(); // Access the route object
const router = useRouter();
const departmentId = ref(route.params.department_id || null);

const devices = ref([]);
const departments = ref([]);

const errorMessage = ref("");
const isAddModalVisible = ref(false);
const newDeviceAndroidId = ref("");
const newDeviceName = ref("");
const newDeviceDepartmentId = ref(null);

const departmentName = ref("");
const searchQuery = ref("");

// Track pagination state
const currentPage = ref(1);
const totalDevices = ref(0);
const devicesPerPage = 8; // Set the number of devices per page

// Function to navigate to the departments page
const goToDepartmentsPage = () => {
  router.push("/departments");
};

// Function to navigate to the specific department page
const goToDepartmentPage = () => {
  router.push(`/departments/${departmentId.value}`);
};

// Fetch devices with pagination
const fetchDevices = async () => {
  try {
    const offset = (currentPage.value - 1) * devicesPerPage;

    if (departmentId.value) {
      const department = await backend.departments.getDepartment(
        departmentId.value
      );
      departmentName.value = department.name;

      // Fetch devices for a specific department with pagination
      const response = await backend.devices.getDevices(
        departmentId.value,
        devicesPerPage,
        offset
      );

      devices.value = response.devices;
      totalDevices.value = response.total_count; // Capture total count for pagination
    } else {
      // Fetch all devices with pagination if no department_id is specified
      const response = await backend.devices.getDevices(
        null,
        devicesPerPage,
        offset
      );
      devices.value = response.devices;
      totalDevices.value = response.total_count;
    }
  } catch (error) {
    errorMessage.value = "Failed to fetch devices.";
  }
};

// Handle page change event from Pagination component
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Watch for page changes to refetch devices
watch(currentPage, fetchDevices);

const fetchDepartments = async () => {
  try {
    departments.value = (
      await backend.departments.getDepartments(0, 20)
    )?.departments;
  } catch (error) {
    errorMessage.value = "Failed to fetch departments.";
  }
};

// Add a new device
const addDeviceHandler = async () => {
  try {
    await backend.devices.createDevice(
      newDeviceAndroidId.value,
      newDeviceName.value,
      newDeviceDepartmentId.value
    );
    fetchDevices();
    isAddModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to add device.";
  }
};

onMounted(() => {
  fetchDevices();
  fetchDepartments();
});
</script>
