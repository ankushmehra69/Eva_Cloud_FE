<template>
  <div class="pt-3 flex flex-col h-full">
    <MobileHeader
      className="-m-4 p-4 md:p-0 md:-m-0 md:mb-5"
      :title="departmentName"
      btnText="Add User"
      :clickHandler="
        () => {
          isAddModalVisible = true;
        }
      "
      :breadcrumbs="
        !isSharedWithMeRoute
          ? [
              { label: 'Deparments', action: () => goToDepartmentsPage() },
              { label: departmentName, action: () => goToDepartmentPage() },
              { label: 'Users' },
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
          action: () => {},
          active: true,
        },
        {
          label: 'Devices',
          action: () => {
            router.push({
              name: 'department_devices',
              params: { department_id: departmentId },
            });
          },
        },
      ]"
    />

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ errorMessage }}</span>
    </div>

    <div class="hidden md:flex items-center relative mb-6">
      <input
        class="bg-white rounded-full w-full py-3 px-6 border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
        placeholder="Search User"
        type="text"
      />
      <button
        class="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
      >
        <SearchIcon />
      </button>
    </div>

    <!-- Users Table -->

    <div class="md:hidden">
      <hr class="border-tranparent bg-grey-200 mb-2 py-1 -mx-4 -mt-4" />
      <div class="pt-3">
        <h3 class="md:text-2xl text-xl font-medium text-secondary">
          Manage User
        </h3>
        <p class="text-black/50 md:text-base text-sm font-light">
          Administer and oversee user accounts and privileges within the
          platform.
        </p>
      </div>
      <hr class="border-white bg-grey-200 mt-4 mb-2 py-1 -mx-4" />
      <ul class="divide-y divide-grey-200">
        <li class="space-y-2 py-2.5" v-for="user in departmentUsers" :key="user.id">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-secondary text-sm font-medium">{{ user.name }}</p>
              <p class="text-grey-100 text-xs">{{ user.role }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  rx="12"
                  fill="#006BBF"
                  fill-opacity="0.1"
                />
                <path
                  d="M12 16.6666H7.33333C6.97971 16.6666 6.64057 16.5261 6.39052 16.2761C6.14048 16.026 6 15.6869 6 15.3333V8.66659M6 8.66659C6 8.31296 6.14048 7.97382 6.39052 7.72378C6.64057 7.47373 6.97971 7.33325 7.33333 7.33325H16.6667C17.0203 7.33325 17.3594 7.47373 17.6095 7.72378C17.8595 7.97382 18 8.31296 18 8.66659M6 8.66659L12 12.6666L18 8.66659M18 8.66659V12.3333M14.6667 16.6666H18.6667M16.6667 14.6666V18.6666"
                  stroke="#006BBF"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="24"
                  height="24"
                  rx="12"
                  fill="#006BBF"
                  fill-opacity="0.1"
                />
                <path
                  d="M8 18V16.6667C8 15.9594 8.28095 15.2811 8.78105 14.781C9.28115 14.281 9.95942 14 10.6667 14H12.3333M16.6673 18C16.3137 18 15.9746 17.8595 15.7245 17.6095C15.4745 17.3594 15.334 17.0203 15.334 16.6667C15.334 16.313 15.4745 15.9739 15.7245 15.7239C15.9746 15.4738 16.3137 15.3333 16.6673 15.3333M16.6673 18C17.0209 18 17.3601 17.8595 17.6101 17.6095C17.8602 17.3594 18.0007 17.0203 18.0007 16.6667C18.0007 16.313 17.8602 15.9739 17.6101 15.7239C17.3601 15.4738 17.0209 15.3333 16.6673 15.3333M16.6673 18V19M16.6673 15.3333V14.3333M18.688 15.5L17.822 16M15.5133 17.3333L14.6466 17.8333M14.6466 15.5L15.5133 16M17.822 17.3333L18.6887 17.8333M9.33333 8.66667C9.33333 9.37391 9.61428 10.0522 10.1144 10.5523C10.6145 11.0524 11.2928 11.3333 12 11.3333C12.7072 11.3333 13.3855 11.0524 13.8856 10.5523C14.3857 10.0522 14.6667 9.37391 14.6667 8.66667C14.6667 7.95942 14.3857 7.28115 13.8856 6.78105C13.3855 6.28095 12.7072 6 12 6C11.2928 6 10.6145 6.28095 10.1144 6.78105C9.61428 7.28115 9.33333 7.95942 9.33333 8.66667Z"
                  stroke="#006BBF"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-secondary text-sm font-medium">
                {{ formattedDate(user.created_at) }}
              </p>
              <p class="text-grey-100 text-xs">{{ user.email }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button @click.stop="showEditModal(user)">
                <EditIcon />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="overflow-hidden bg-white p-6 rounded-2xl w-full flex-1 hidden md:flex flex-col h-full"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-2xl font-medium text-secondary">Manage User</h3>
          <p class="text-black/50 text-base font-light">
            Administer and oversee user accounts and privileges within the
            platform.
          </p>
        </div>
        <div class="flex items-center gap-4 pr-4">
          <button>
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.25578 4.05594C9.41132 4.21129 9.62217 4.29855 9.842 4.29855C10.0618 4.29855 10.2727 4.21129 10.4282 4.05594L11.2246 3.25956V14.5306C11.2246 14.7506 11.312 14.9616 11.4676 15.1172C11.6232 15.2727 11.8342 15.3601 12.0542 15.3601C12.2742 15.3601 12.4852 15.2727 12.6408 15.1172C12.7963 14.9616 12.8837 14.7506 12.8837 14.5306V3.25956L13.6801 4.05594C13.7561 4.13744 13.8476 4.20282 13.9494 4.24816C14.0512 4.2935 14.161 4.31788 14.2724 4.31984C14.3838 4.32181 14.4944 4.30132 14.5977 4.2596C14.701 4.21787 14.7949 4.15577 14.8736 4.077C14.9524 3.99822 15.0145 3.90439 15.0562 3.8011C15.0979 3.6978 15.1184 3.58716 15.1165 3.47577C15.1145 3.36439 15.0901 3.25454 15.0448 3.15278C14.9994 3.05102 14.9341 2.95944 14.8526 2.88349L12.6404 0.671319C12.4849 0.515969 12.274 0.428711 12.0542 0.428711C11.8343 0.428711 11.6235 0.515969 11.468 0.671319L9.25578 2.88349C9.10043 3.03903 9.01317 3.24988 9.01317 3.46971C9.01317 3.68955 9.10043 3.9004 9.25578 4.05594ZM4.03506 14.7407L4.83144 13.9443C4.90739 13.8628 4.99897 13.7975 5.10073 13.7521C5.20249 13.7068 5.31234 13.6824 5.42372 13.6804C5.53511 13.6785 5.64575 13.699 5.74904 13.7407C5.85234 13.7824 5.94617 13.8445 6.02495 13.9233C6.10372 14.0021 6.16582 14.0959 6.20754 14.1992C6.24927 14.3025 6.26976 14.4131 6.26779 14.5245C6.26583 14.6359 6.24145 14.7457 6.19611 14.8475C6.15077 14.9493 6.08539 15.0408 6.00389 15.1168L3.79172 17.329C3.63617 17.4843 3.42533 17.5716 3.20549 17.5716C2.98566 17.5716 2.77481 17.4843 2.61927 17.329L0.407098 15.1168C0.325594 15.0408 0.260222 14.9493 0.214881 14.8475C0.169541 14.7457 0.145161 14.6359 0.143196 14.5245C0.14123 14.4131 0.16172 14.3025 0.203442 14.1992C0.245165 14.0959 0.307266 14.0021 0.38604 13.9233C0.464814 13.8445 0.558647 13.7824 0.661942 13.7407C0.765238 13.699 0.875879 13.6785 0.987265 13.6804C1.09865 13.6824 1.2085 13.7068 1.31026 13.7521C1.41202 13.7975 1.5036 13.8628 1.57955 13.9443L2.37593 14.7407V3.46971C2.37593 3.2497 2.46333 3.0387 2.6189 2.88312C2.77448 2.72755 2.98548 2.64015 3.20549 2.64015C3.42551 2.64015 3.63651 2.72755 3.79208 2.88312C3.94766 3.0387 4.03506 3.2497 4.03506 3.46971V14.7407Z"
                fill="#111015"
              />
            </svg>
          </button>
          <button>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 7V9H19V7H5ZM7 13H16V11H7V13ZM13 17H10V15H13V17Z"
                fill="#111015"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="min-w-full">
          <thead class="text-secondary-100 sticky top-0">
            <tr>
              <th
                class="py-1.5 px-6 text-left text-sm md:text-base font-semibold bg-primary-100 rounded-tl-2xl"
              >
                Name
              </th>
              <th
                class="py-1.5 px-6 text-left text-sm md:text-base font-semibold bg-primary-100"
              >
                Role
              </th>
              <th
                class="py-1.5 px-6 text-left text-sm md:text-base font-semibold bg-primary-100"
              >
                Email
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100"
              >
                Created Date
              </th>
              <th
                class="py-1.5 px-6 text-center text-sm md:text-base font-semibold bg-primary-100 rounded-tr-2xl"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop over actual department users -->
            <tr
              v-for="user in departmentUsers"
              :key="user.id"
              class="hover:bg-gray-100 cursor-pointer odd:bg-grey-50"
            >
              <td
                class="py-2 px-6 text-sm text-black font-light whitespace-nowrap"
              >
                <div class="flex items-center justify-between gap-4">
                  {{ user.name }}
                  <div class="flex items-center space-x-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="12"
                        fill="#006BBF"
                        fill-opacity="0.1"
                      />
                      <path
                        d="M12 16.6666H7.33333C6.97971 16.6666 6.64057 16.5261 6.39052 16.2761C6.14048 16.026 6 15.6869 6 15.3333V8.66659M6 8.66659C6 8.31296 6.14048 7.97382 6.39052 7.72378C6.64057 7.47373 6.97971 7.33325 7.33333 7.33325H16.6667C17.0203 7.33325 17.3594 7.47373 17.6095 7.72378C17.8595 7.97382 18 8.31296 18 8.66659M6 8.66659L12 12.6666L18 8.66659M18 8.66659V12.3333M14.6667 16.6666H18.6667M16.6667 14.6666V18.6666"
                        stroke="#006BBF"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="24"
                        height="24"
                        rx="12"
                        fill="#006BBF"
                        fill-opacity="0.1"
                      />
                      <path
                        d="M8 18V16.6667C8 15.9594 8.28095 15.2811 8.78105 14.781C9.28115 14.281 9.95942 14 10.6667 14H12.3333M16.6673 18C16.3137 18 15.9746 17.8595 15.7245 17.6095C15.4745 17.3594 15.334 17.0203 15.334 16.6667C15.334 16.313 15.4745 15.9739 15.7245 15.7239C15.9746 15.4738 16.3137 15.3333 16.6673 15.3333M16.6673 18C17.0209 18 17.3601 17.8595 17.6101 17.6095C17.8602 17.3594 18.0007 17.0203 18.0007 16.6667C18.0007 16.313 17.8602 15.9739 17.6101 15.7239C17.3601 15.4738 17.0209 15.3333 16.6673 15.3333M16.6673 18V19M16.6673 15.3333V14.3333M18.688 15.5L17.822 16M15.5133 17.3333L14.6466 17.8333M14.6466 15.5L15.5133 16M17.822 17.3333L18.6887 17.8333M9.33333 8.66667C9.33333 9.37391 9.61428 10.0522 10.1144 10.5523C10.6145 11.0524 11.2928 11.3333 12 11.3333C12.7072 11.3333 13.3855 11.0524 13.8856 10.5523C14.3857 10.0522 14.6667 9.37391 14.6667 8.66667C14.6667 7.95942 14.3857 7.28115 13.8856 6.78105C13.3855 6.28095 12.7072 6 12 6C11.2928 6 10.6145 6.28095 10.1144 6.78105C9.61428 7.28115 9.33333 7.95942 9.33333 8.66667Z"
                        stroke="#006BBF"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td
                class="py-2 px-6 text-sm text-black font-light whitespace-nowrap"
              >
                {{ user.role }}
              </td>
              <td
                class="py-2 px-6 text-sm text-black font-light whitespace-nowrap"
              >
                {{ user.email }}
              </td>
              <td
                class="py-2 px-6 text-sm text-black font-light whitespace-nowrap text-center"
              >
                {{ formattedDate(user.created_at) }}
              </td>
              <td class="py-2.5 px-4 text-sm flex justify-center items-center">
                <button @click.stop="showEditModal(user)">
                  <EditIcon />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      v-if="totalUsers > usersPerPage"
      :totalItems="totalUsers"
      :currentPage="currentPage"
      :itemsPerPage="usersPerPage"
      @update:currentPage="handlePageChange"
    />

    <!-- <div class="flex items-center my-4">
      <div class="flex-grow border-t border-blue-500"></div>
      <span class="mx-4 text-blue-500 font-semibold">Invitations</span>
      <div class="flex-grow border-t border-blue-500"></div>
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="invite in departmentInvitations"
            :key="invite.id"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 text-sm">-</td>
            <td class="py-2 px-4 text-sm">{{ invite.email }} (invited)</td>
            <td class="py-2 px-4 text-sm">{{ invite.role }}</td>
            <td class="py-2 px-4 text-sm">
              {{ invite.is_admin ? "Yes" : "No" }}
            </td>
            <td class="py-2 px-4 flex space-x-2">
              <button
                @click.stop="showRemoveModal(invite, true)"
                class="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center space-x-2"
              >
                <TrashIcon class="h-5 w-5" />
                <span>Cancel Invitation</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <!-- Add User Modal -->
    <div
      v-if="isAddModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Add New User
        </h2>
        <form class="space-y-4" @submit.prevent="addUserHandler">
          <form-input
            v-model="newUserEmail"
            label="Email"
            id="Email"
            type="email"
            size="sm"
            placeholder="Enter new email id"
          />
          <form-input
            v-model="newUserRole"
            label="Role"
            id="Role"
            type="text"
            size="sm"
            placeholder="Enter new role"
          />
          <div class="!mb-8 flex justify-between items-center">
            <label class="block md:text-lg text-base font-light">Admin Access</label>
            <label>
              <input
                type="checkbox"
                v-model="newUserIsAdmin"
                class="sr-only peer"
              />
              <div
                class="relative cursor-pointer w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
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
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="isEditModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Edit User Details
        </h2>
        <form class="space-y-4" @submit.prevent="updateUserHandler">
          <ul class="space-y-2">
            <li class="flex items-center justify-between font-light">
              <span class="md:text-lg text-base">Name</span>
              <span class="text-grey-100 md:text-base text-sm">{{ editUser.name }}</span>
            </li>
            <li class="flex items-center justify-between font-light">
              <span class="md:text-lg text-base">Email</span>
              <span class="text-grey-100 md:text-base text-sm">{{ editUser.email }}</span>
            </li>
            <li class="flex items-center justify-between font-light">
              <span class="md:text-lg text-base">Invited by</span>
              <span class="text-grey-100 md:text-base text-sm">{{ editUser.email }}</span>
            </li>
            <li class="flex items-center justify-between font-light">
              <span class="md:text-lg text-base">Role</span>
              <form-input
                v-if="isEditableRole"
                v-model="editUserRole"
                id="Role"
                type="text"
                size="sm"
                placeholder="Enter Role"
              />
              <div v-else class="flex items-center space-x-2">
                <EditIcon
                  class="cursor-pointer"
                  @click="isEditableRole = true"
                />
                <span class="text-grey-100">{{ editUser.role }}</span>
              </div>
            </li>
          </ul>
          <hr />
          <div class="!mb-8 flex justify-between items-center">
            <label class="block md:text-lg text-base font-light">Admin Access</label>
            <label>
              <input
                type="checkbox"
                v-model="editUserIsAdmin"
                class="sr-only peer"
              />
              <div
                class="relative cursor-pointer w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
              ></div>
            </label>
          </div>
          <div class="flex justify-between gap-2">
            <button
              type="button"
              @click.stop="showRemoveModal(editUser, false)"
              class="btn btn-danger-outline !rounded-xl"
            >
              Remove User
            </button>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="isEditModalVisible = false"
                class="btn btn-outline !rounded-xl"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary !rounded-xl">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove User Confirmation Modal -->
    <DeleteModal
      v-if="isRemoveModalVisible"
      :title="`Are you sure you want to remove user “${editUser.name}”?`"
      @close="isRemoveModalVisible = false"
      @remove="removeUserHandler"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import backend from "@/backend";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import Pagination from "@/components/Pagination.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import EditIcon from "@/components/icons/EditIcon.vue";
import FormInput from "@/components/form/Input.vue";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import Tabs from "@/components/Tabs.vue";
import MobileHeader from "@/components/MobileHeader.vue";

const route = useRoute();
const router = useRouter();
const departmentId = route.params.id;

console.log("departmentId", departmentId);

const departmentUsers = ref([]);
const errorMessage = ref("");
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isRemoveModalVisible = ref(false);
const newUserEmail = ref("");
const newUserRole = ref("");
const newUserIsAdmin = ref(false);
const editUserRole = ref("");
const editUser = ref({});
const isEditableRole = ref("");
const editUserIsAdmin = ref(false);
let editUserId = null;
let removeUserId = null;
const departmentInvitations = ref([]);
const isInvitationBeingRemoved = ref(false);

const departmentName = ref("");

const currentPage = ref(1); // Tracks the current page
const totalUsers = ref(0); // Stores the total number of users
const usersPerPage = 10; // Define how many users per page

const formattedDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Function to navigate to the departments page
const goToDepartmentsPage = () => {
  router.push("/departments");
};

// Function to navigate to the specific department page
const goToDepartmentPage = () => {
  router.push(`/departments/${departmentId}`);
};

// Fetch the department's name along with its users and invitations
const fetchDepartmentUsers = async () => {
  try {
    // Fetch department details (e.g., name) and users with pagination
    const department = await backend.departments.getDepartment(departmentId);
    departmentName.value = department.name;

    // Calculate the offset based on the current page
    const offset = (currentPage.value - 1) * usersPerPage;

    // Fetch department users with offset and limit
    const response = await backend.department_users.getUsersInDepartment(
      departmentId,
      offset,
      usersPerPage
    );

    departmentUsers.value = response.users; // Update users
    totalUsers.value = response.total_count; // Update total user count

    // Fetch department invitations
    departmentInvitations.value =
      await backend.invitations.getInvitationsForDepartment(departmentId);
  } catch (error) {
    errorMessage.value = error;
  }
};

// Function to handle page change
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchDepartmentUsers(); // Call your API or function to fetch new data
};

const addUserHandler = async () => {
  try {
    await backend.invitations.createInvitation(
      departmentId,
      newUserEmail.value,
      newUserRole.value,
      newUserIsAdmin.value
    );
    fetchDepartmentUsers();
    isAddModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to send invitation.";
  }
};

const showEditModal = (user) => {
  editUser.value = user;
  editUserRole.value = user.role;
  editUserIsAdmin.value = user.is_admin;
  editUserId = user.id;
  isEditModalVisible.value = true;
};

const updateUserHandler = async () => {
  try {
    await backend.department_users.updateUserInDepartment(
      departmentId,
      editUserId,
      editUserRole.value,
      editUserIsAdmin.value
    );
    fetchDepartmentUsers();
    isEditModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to update user in department.";
  }
};

const showRemoveModal = (entity, isInvitation) => {
  removeUserId = entity.id;
  isInvitationBeingRemoved.value = isInvitation;
  isRemoveModalVisible.value = true;
  isEditModalVisible.value = false;
};

const removeUserHandler = async () => {
  try {
    if (isInvitationBeingRemoved.value) {
      // Cancel invitation
      await backend.invitations.deleteInvitation(removeUserId);
    } else {
      // Remove actual department user
      await backend.department_users.removeUserFromDepartment(
        departmentId,
        removeUserId
      );
    }
    fetchDepartmentUsers();
    isRemoveModalVisible.value = false;
    isEditModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to remove user or cancel invitation.";
  }
};

watch(currentPage, fetchDepartmentUsers);

onMounted(fetchDepartmentUsers);
</script>
