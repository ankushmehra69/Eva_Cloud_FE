<template>
  <div class="pt-3 flex flex-col h-full">
    <MobileHeader
      title="All Departments"
      btnText="Add Department"
      :clickHandler="() => (showAddDeptModal = true)"
      :breadcrumbs="[
        { label: 'Deparments', action: () => goToDepartmentsPage() },
        { label: 'View All' },
      ]"
    />

    <div class="mb-6 hidden">
      <div class="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-2">Used Storage</h2>
        <div class="flex justify-between mb-1 text-sm">
          <span
            >{{ (totalStorageUsed / (1024 * 1024)).toFixed(2) }} MB of
            {{ (totalStorageAllocated / (1024 * 1024)).toFixed(2) }} MB</span
          >
        </div>
        <div class="w-full bg-gray-300 rounded h-2.5 mb-4">
          <div
            class="bg-blue-500 h-2.5 rounded"
            :style="{
              width: (totalStorageUsed / totalStorageAllocated) * 100 + '%',
            }"
          ></div>
        </div>
        <div class="flex justify-between text-xs">
          <span>System Data</span>
          <span>{{ (totalStorageUsed / (1024 * 1024)).toFixed(2) }} MB</span>
        </div>
      </div>
    </div>

    <div class="flex items-center relative md:mb-6 mb-2">
      <input
        class="md:bg-white bg-grey-200/50 rounded-full w-full md:py-3 py-2.5 pl-11 md:pl-6 md:px-6 text-sm md:text-base border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
        placeholder="Search Department"
        type="text"
      />
      <button
        class="absolute md:right-1 left-0 md:left-auto top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
      >
        <SearchIcon />
      </button>
    </div>

    <hr class="border-2 border-grey-200 my-2 md:hidden" />

    <div
      class="divide-y divide-grey-200 border-b border-grey-200 md:hidden flex-1 h-full overflow-y-auto"
    >
      <ul
        class="grid grid-cols-3 gap-x-8 gap-y-3 py-3.5"
        v-for="dept in departments"
        :key="dept.id"
      >
        <li class="">
          <p class="text-grey-100 text-xs">Department</p>
          <p class="text-secondary text-sm font-medium">{{ dept.name }}</p>
        </li>
        <li class="">
          <p class="text-grey-100 text-xs">Created At</p>
          <p class="text-secondary text-sm font-medium">
            {{ formattedDate(dept.created_at) }}
          </p>
        </li>
        <li class="">
          <p class="text-grey-100 text-xs">Sessions</p>
          <p class="text-secondary text-sm font-medium">
            {{ dept.total_sessions }}
          </p>
        </li>
        <li class="">
          <p class="text-grey-100 text-xs">Devices</p>
          <p class="text-secondary text-sm font-medium">
            {{ dept.total_devices }}
          </p>
        </li>
        <li class="">
          <p class="text-grey-100 text-xs">Users</p>
          <p class="text-secondary text-sm font-medium">
            {{ dept.total_users }}
          </p>
        </li>
        <li class="">
          <button
            @click="navigateToDepartment(dept.id)"
            class="btn border border-primary-200 bg-primary-100 hover:bg-primary text-primary hover:text-white !rounded-lg h-11 w-full flex items-center justify-center !p-0"
          >
            <ArrowRightIcon class="h-5 w-5" />
          </button>
        </li>
      </ul>
    </div>

    <div
      class="overflow-hidden !bg-white p-6 rounded-2xl w-full flex-1 hidden md:flex flex-col h-full"
    >
      <h3 class="text-2xl font-medium text-secondary">Departments</h3>
      <p class="text-black/50 text-base font-light mb-4">
        Check all the departments listed below and view their details.
      </p>
      <div class="overflow-auto">
        <table class="min-w-full">
          <thead class="text-secondary-100 sticky top-0">
            <tr>
              <!-- <th class="py-1.5 px-4 text-left text-sm md:text-base font-semibold">ID</th> -->
              <th
                class="py-1.5 px-6 text-left text-sm md:text-base font-semibold bg-primary-100 rounded-tl-2xl"
              >
                Name
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100"
              >
                Created At
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100"
              >
                Users
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100"
              >
                Devices
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100"
              >
                Sessions
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100 rounded-tr-2xl"
              >
                <!-- Actions -->
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="dept in departments"
              :key="dept.id"
              class="hover:bg-gray-100 cursor-pointer odd:bg-grey-50"
              @click="navigateToDepartment(dept.id)"
            >
              <td
                class="py-3 px-6 text-sm md:text-base text-black font-light whitespace-nowrap"
              >
                {{ dept.name }}
              </td>
              <td
                class="py-3 px-6 text-sm md:text-base text-black font-light text-center whitespace-nowrap"
              >
                {{ formattedDate(dept.created_at) }}
              </td>
              <td
                class="py-3 px-6 text-sm md:text-base text-black font-light text-center"
              >
                {{ dept.total_users }}
              </td>
              <td
                class="py-3 px-6 text-sm md:text-base text-black font-light text-center"
              >
                {{ dept.total_devices }}
              </td>
              <td
                class="py-3 px-6 text-sm md:text-base text-black font-light text-center"
              >
                {{ dept.total_sessions }}
              </td>
              <td class="py-3 px-4 text-sm flex justify-center space-x-2">
                <button
                  class="btn border border-primary-200 bg-primary-100 hover:bg-primary text-primary hover:text-white !rounded-lg h-11 w-11 flex items-center justify-center !p-0"
                >
                  <ArrowRightIcon class="h-5 w-5" />
                </button>
                <button
                  @click.stop="editDept(dept)"
                  class="btn btn-outline bg-grey-200/30 hover:bg-secondary hover:text-white !rounded-lg h-11 w-11 flex items-center justify-center !p-0"
                >
                  <EditIcon />
                </button>
                <button
                  @click.stop="confirmDeleteDept(dept.id)"
                  class="btn border border-danger/50 bg-danger/10 hover:bg-danger text-danger hover:text-white !rounded-lg h-11 w-11 flex items-center justify-center !p-0"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
                <!-- <button
                @click.stop="editDept(dept)"
                class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center space-x-2"
              >
                <PencilIcon class="h-5 w-5" />
                <span>Edit</span>
              </button>
              <button
                @click.stop="confirmDeleteDept(dept.id)"
                class="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center space-x-2"
              >
                <TrashIcon class="h-5 w-5" />
                <span>Delete</span>
              </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      v-if="totalDepartments > departmentsPerPage"
      :totalItems="totalDepartments"
      :currentPage="currentPage"
      :itemsPerPage="departmentsPerPage"
      @update:currentPage="handlePageChange"
    />

    <!-- Add Department Modal -->
    <div
      v-if="showAddDeptModal"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Add Department
        </h2>
        <form class="space-y-6" @submit.prevent="addDeptHandler">
          <form-input
            label="Name"
            id="Name"
            type="text"
            v-model="newDept.name"
            size="sm"
            placeholder="Enter Department Name"
          />
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showAddDeptModal = false"
              class="btn btn-outline !rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary !rounded-xl">
              Add Department
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Department Modal -->
    <div
      v-if="showEditDeptModal"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Edit Department
        </h2>
        <form class="space-y-6" @submit.prevent="updateDeptHandler">
          <form-input
            label="Name"
            id="Name"
            type="text"
            v-model="editDeptDetails.name"
            size="sm"
            placeholder="Enter Department Name"
          />
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showEditDeptModal = false"
              class="btn btn-outline !rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary !rounded-xl">
              Update Department
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Department Modal -->
    <DeleteModal
      v-if="showDeleteDeptModal"
      title="Are you sure you want to delete this department?"
      @close="showDeleteDeptModal = false"
      @remove="deleteDeptHandler(deleteDeptId)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import backend from "@/backend";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import FormInput from "@/components/form/Input.vue";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import EditIcon from "@/components/icons/EditIcon.vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import MobileHeader from "@/components/MobileHeader.vue";

const router = useRouter();

const departments = ref([]);
const showAddDeptModal = ref(false);
const showEditDeptModal = ref(false);
const showDeleteDeptModal = ref(false);
const newDept = ref({
  name: "",
});
const editDeptDetails = ref({});
const deleteDeptId = ref(null);

const totalStorageUsed = ref(0);
const totalStorageAllocated = ref(0);

const currentPage = ref(1); // Track the current page
const departmentsPerPage = 10; // Set the number of departments per page
const totalDepartments = ref(0); // Track total number of departments

const fetchStorageData = async () => {
  const storageData = await backend.devices.getStorage();
  totalStorageUsed.value = storageData.total_storage_used;
  totalStorageAllocated.value = storageData.total_storage_allocated;
};

const navigateToDepartment = (id) => {
  router.push({ name: "department", params: { id } });
};

const formattedDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Fetch departments with pagination
const fetchDepartments = async () => {
  try {
    const offset = (currentPage.value - 1) * departmentsPerPage;

    const response = await backend.departments.getDepartments(
      offset,
      departmentsPerPage
    );

    departments.value = response.departments;
    totalDepartments.value = response.total_count; // Capture total count for pagination
  } catch (error) {
    errorMessage.value = "Failed to fetch departments.";
  }
};

// Handle page change event from the Pagination component
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Watch for page changes and refetch departments
watch(currentPage, fetchDepartments);

const addDeptHandler = async () => {
  await backend.departments.addDepartment(newDept.value.name);
  fetchDepartments();
  showAddDeptModal.value = false;
  newDept.value.name = "";
};

const editDept = (dept) => {
  editDeptDetails.value = { ...dept };
  showEditDeptModal.value = true;
};

const updateDeptHandler = async () => {
  await backend.departments.updateDepartment(
    editDeptDetails.value.id,
    editDeptDetails.value
  );
  fetchDepartments();
  showEditDeptModal.value = false;
};

const confirmDeleteDept = (dept_id) => {
  deleteDeptId.value = dept_id;
  showDeleteDeptModal.value = true;
};

const deleteDeptHandler = async (dept_id) => {
  console.log("dept_id", dept_id);
  await backend.departments.deleteDepartment(dept_id);
  fetchDepartments();
  showDeleteDeptModal.value = false;
};

onMounted(() => {
  fetchStorageData();
  fetchDepartments();
});
</script>
