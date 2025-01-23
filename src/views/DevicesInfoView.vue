<template>
  <div class="pt-3">
    <div class="md:mb-6 mb-4">
      <h2 class="text-3xl font-bold text-secondary">{{ departmentName }}</h2>
      <p class="text-black/50 text-base font-light break-all">
        <span
          class="cursor-pointer hover:text-primary"
          @click="goToDepartmentsPage"
          >Deparments</span
        >
        >
        <span
          class="cursor-pointer hover:text-primary"
          @click="goToDepartmentPage"
          >{{ departmentName }}</span
        >
        <span v-if="departmentName">{{` > `}}</span>
        <span class="cursor-pointer hover:text-primary" @click="goToDevicesPage"
          >Devices</span
        >
        >
        <span>{{ device.name }}</span>
      </p>
    </div>
    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="text-sm text-red-600 bg-red-100/50 border border-red-500 w-full rounded-lg py-3 px-4 mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>
    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="text-sm text-green-600 bg-green-100 border border-green-500 w-full rounded-lg py-3 px-4 mb-4"
    >
      {{ successMessage }}
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:bg-white md:p-6 rounded-2xl w-full"
    >
      <!-- <h3 class="text-xl font-medium text-secondary md:mb-6 md:hidden">
        Device Info
      </h3> -->
      <div
        class="border md:rounded-lg flex items-center justify-center md:order-1 bg-white p-4 md:p-0 md:bg-transparent rounded-2xl"
      >
        <div class="relative md:size-56 size-44">
          <svg
            class="size-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Background Circle -->
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              class="stroke-current text-gray-200"
              stroke-width="3"
            ></circle>
            <!-- Progress Circle -->
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              class="stroke-current text-primary"
              stroke-width="3"
              :stroke-dasharray="`${(
                device.storage_used /
                (1024 * 1024 * 1024)
              ).toFixed(2)}, 100`"
              stroke-linecap="round"
            ></circle>
          </svg>

          <!-- Percentage Text -->
          <div
            class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 flex flex-col items-center justify-center"
          >
            <span class="md:text-2xl text-xl font-semibold text-center whitespace-nowrap"
              >{{ (device.storage_used / (1024 * 1024 * 1024)).toFixed(2) }} /
              10 GB</span
            >
            <span class="text-grey-100 text-sm">Used Space</span>
          </div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-0 md:bg-transparent rounded-2xl">
        <h3 class="text-xl font-medium text-secondary mb-6">
          Device Info
        </h3>
        <form class="space-y-3" @submit.prevent="updateDeviceHandler">
          <form-input
            label="Device Name"
            id="name"
            type="text"
            v-model="editDeviceName"
            size="sm"
            :disabled="!isEditDeviceName"
          >
            <button
              v-if="isEditDeviceName"
              type="submit"
              class="absolute inset-y-0 right-1 flex items-center pr-3 cursor-pointer z-20"
            >
              <EditIcon />
            </button>
            <div
              v-else
              class="absolute inset-y-0 right-1 flex items-center pr-3 cursor-pointer z-20"
              @click="editDeviceNameHandler"
            >
              <EditIcon />
            </div>
          </form-input>
          <div class="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 grid-cols-1 gap-4">
            <form-input
              label="Device Id"
              id="id"
              type="text"
              v-model="device.id"
              size="sm"
              disabled
            />
            <form-input
              label="Registered Date"
              id="created_at"
              type="text"
              v-model="formattedCreatedAt"
              size="sm"
              disabled
            />
          </div>
          <form-input
            label="User linked to Device"
            id="linked_user_name"
            type="text"
            v-model="device.linked_user_name"
            size="sm"
            disabled
          />
          <div class="flex justify-center gap-4 pt-3">
            <p
              class="text-danger underline cursor-pointer font-sans"
              @click.stop="showRemoveModal(device)"
            >
              Remove Device
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove Device Confirmation Modal -->
    <DeleteModal
      v-if="isRemoveModalVisible"
      type="device"
      :name="device.name"
      @close="isRemoveModalVisible = false"
      @remove="removeDeviceHandler"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import backend from "@/backend";
import { useRoute, useRouter } from "vue-router";
import FormInput from "@/components/form/Input.vue";
import EditIcon from "@/components/icons/EditIcon.vue";
import DeleteModal from "@/components/modals/DeleteModal.vue";

const route = useRoute();
const router = useRouter();
const departmentId = ref(route.params.department_id || null);

const device = ref({});
const departments = ref([]);
const errorMessage = ref("");
const successMessage = ref("");
const isEditDeviceName = ref(false);
const isRemoveModalVisible = ref(false);
const departmentName = ref("");
const searchQuery = ref("");
let removeDeviceId = null;

// Function to navigate to the departments page
const goToDepartmentsPage = () => {
  router.push("/departments");
};

// Function to navigate to the specific department page
const goToDevicesPage = () => {
  router.push(`/departments/${departmentId.value}/devices`);
};

// Function to navigate to the specific department page
const goToDepartmentPage = () => {
  router.push(`/departments/${departmentId.value}`);
};

const editDeviceName = computed({
  get: () => device.value.name || "",
  set: (value) => (device.value.name = value),
});

const editDeviceDepartmentId = computed({
  get: () => device.value.linked_department_id || null,
  set: () =>
    (device.value.linked_department_id = device.value.linked_department_id),
});

// Helper to format date
const formattedCreatedAt = computed(() => {
  if (device.value.created_at) {
    const date = new Date(device.value.created_at);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  return "";
});

const editDeviceNameHandler = () => {
  isEditDeviceName.value = !isEditDeviceName.value;
  console.log("isEditDeviceName", isEditDeviceName.value);
};

const fetchDevice = async () => {
  try {
    const deviceData = await backend.devices.getDevice(route.params.id);
    device.value = deviceData;
    console.log("device", device.value);
  } catch (error) {
    errorMessage.value = "Failed to fetch device with id: " + route.params.id;
  }
};

const fetchDepartment = async () => {
  try {
    const department = await backend.departments.getDepartment(
      departmentId.value
    );
    departmentName.value = department.name;
  } catch (error) {
    errorMessage.value = "Failed to fetch departments.";
  }
};

const fetchDepartments = async () => {
  try {
    departments.value = (
      await backend.departments.getDepartments(0, 20)
    )?.departments;
  } catch (error) {
    errorMessage.value = "Failed to fetch departments.";
  }
};

const updateDeviceHandler = async () => {
  try {
    isEditDeviceName.value = false;
    await backend.devices.updateDevice(
      route.params.id,
      editDeviceName.value,
      editDeviceDepartmentId.value
    );
    successMessage.value = "Device updated successfully.";
  } catch (error) {
    errorMessage.value = "Failed to update device.";
  }
};

const showRemoveModal = (device) => {
  removeDeviceId = device.id;
  isRemoveModalVisible.value = true;
};

const removeDeviceHandler = async () => {
  try {
    await backend.devices.deleteDevice(removeDeviceId);
    router.push({ name: "devices" });
    isRemoveModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to remove device.";
  }
};

onMounted(() => {
  fetchDevice();
  fetchDepartment();
  fetchDepartments();
});
</script>
