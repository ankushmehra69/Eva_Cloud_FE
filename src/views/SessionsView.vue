<template>
  <div class="pt-3 flex flex-col h-full">
    <MobileHeader
      :title="
        isSharedWithMeRoute ? 'Shared Sessions with Me' : 'Session Management'
      "
      :btnText="!isSharedWithMeRoute ? 'Add User' : null"
      :clickHandler="showAddModal"
      :breadcrumbs="
        !isSharedWithMeRoute
          ? [
              { label: 'Deparments', action: () => goToDepartmentsPage() },
              { label: departmentName, action: () => goToDepartmentPage() },
              { label: 'Sessions' },
            ]
          : []
      "
    />

    <Tabs v-if="!isSharedWithMeRoute"
      :tabs="[
        { label: 'Sessions', action: () => {}, active: true },
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

    <!-- Search and Sort Controls -->
    <div class="flex items-center mb-6 gap-4">
      <div class="flex items-center relative w-full">
        <input
          class="md:bg-white bg-grey-200/50 rounded-full w-full py-3 pl-11 md:pl-6 md:px-6 border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
          placeholder="Search"
          type="text"
          v-model="searchQuery"
          @keyup.enter="fetchSessions"
          @input="searchQuery === '' && fetchSessions()"
        />
        <button
          @click="fetchSessions"
          class="absolute md:right-1 left-0 md:left-auto top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
        >
          <SearchIcon />
        </button>
      </div>
      <select
        v-model="sortBy"
        class="border border-gray-300 md:px-4 px-2 py-3 rounded-lg focus:border-primary focus:shadow-primary/40"
        @change="fetchSessions"
      >
        <option value="recent">Recent</option>
        <option value="ASC">A to Z</option>
        <option value="last_updated">Last Updated</option>
        <option value="created_at">Created At</option>
      </select>
    </div>

    <div class="mb-6 flex justify-start items-center space-x-4 !hidden">
      <!-- Search Input -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search sessions..."
        class="border border-gray-300 px-4 py-2 rounded"
      />

      <!-- Sorting Dropdowns -->
      <div class="flex space-x-4 items-center">
        <label for="sortBy">Sort by:</label>
        <select
          v-model="sortBy"
          class="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="created_at">Created At</option>
          <option value="name">Name</option>
          <option value="sample_id">Sample ID</option>
          <option value="patient_id">Patient ID</option>
        </select>

        <select
          v-model="sortOrder"
          class="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>

      <!-- Search Button -->
      <button
        @click="fetchSessions"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>

    <!-- Sessions Table -->
    <div
      class="bg-white md:p-6 lg:pt-10 py-2 rounded-2xl w-full flex-1 flex flex-col h-full overflow-auto"
    >
      <div class="grid lg:grid-cols-4 grid-cols-3 gap-6 md:gap-y-10">
        <div
          class="cursor-pointer text-center relative"
          v-for="session in sessions"
          :key="session.id"
        >
          <Menu
            v-if="!isSharedWithMeRoute"
            :options="[
              {
                label: 'Edit',
                action: () => {
                  showEditModal(session);
                },
              },
              {
                label: 'Share',
                action: () => {
                  showShareModal(session);
                },
              },
              {
                label: 'Delete',
                action: () => {
                  showRemoveModal(session);
                },
              },
            ]"
          >
            <div class="flex flex-col justify-cente items-center">
              <div class="relative mb-5" @click="goToSession(session)">
                <!-- Badge -->
                <div
                  class="absolute md:top-1 top-0 md:left-1 left-0 z-10 flex items-center justify-center w-7 h-7 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-black text-white rounded-full text-xs sm:text-sm md:text-base"
                >
                  {{ session.total_media }}
                </div>

                <!-- Circular Image -->
                <div class="flex">
                  <!-- v-for="i in session.total_media < 3 ? session.total_media : 3"
            :key="i" -->
                  <div
                    v-if="session.total_media"
                    class="relative z-8 size-20 md:size-32 xl:size-48 rounded-full overflow-hidden shadow-4xl"
                  >
                    <img
                      :src="session.thumbnail_url"
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
                </div>
              </div>
              <div @click="goToSession(session)">
                <div
                  class="md:text-lg text-sm mb-1 md:mb-0 font-medium text-secondary"
                >
                  {{ session.name }}
                </div>
                <div
                  class="md:text-sm text-xs font-light text-secondary flex items-center gap-2 justify-center"
                >
                  <span>{{ formattedDate(session.created_at) }}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.38973 15.8272H5.71563C3.53976 15.8239 1.77588 14.126 1.77588 12.0313C1.77588 9.93751 3.53976 8.23962 5.71563 8.23962C6.0481 6.749 7.23332 5.53247 8.82462 5.04772C10.4151 4.56382 12.1713 4.88445 13.4302 5.89371C14.689 6.90043 15.2592 8.43758 14.9275 9.9282H15.7651C16.9393 9.9282 17.9519 10.6219 18.4198 11.6261M12.7737 16.6698L14.4656 18.3618L17.8496 14.9779"
                      stroke="#1C1D1F"
                      stroke-width="1.26898"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Menu>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto bg-white shadow rounded-lg !hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-500 text-white">
          <tr>
            <th class="py-2 px-4 text-left">ID</th>
            <th class="py-2 px-4 text-left">Thumbnail</th>
            <th class="py-2 px-4 text-left">Name</th>
            <th class="py-2 px-4 text-left">Sample ID</th>
            <th class="py-2 px-4 text-left">Patient ID</th>
            <th class="py-2 px-4 text-left">Remarks</th>
            <th class="py-2 px-4 text-left">Tags</th>
            <th class="py-2 px-4 text-left">Device</th>
            <th v-if="!isSharedWithMeRoute" class="py-2 px-4 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="session in sessions"
            :key="session.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="goToSession(session)"
          >
            <td class="py-2 px-4 text-sm text-left">{{ session.id }}</td>
            <td
              v-if="session?.thumbnail_url"
              class="py-2 px-4 text-sm text-left"
            >
              <img
                :src="session.thumbnail_url"
                alt="Thumbnail"
                class="w-full h-auto"
              />
            </td>
            <td v-else class="py-2 px-4 text-sm text-left">No Thumbnail</td>
            <td class="py-2 px-4 text-sm text-left">{{ session.name }}</td>
            <td class="py-2 px-4 text-sm text-left">{{ session.sample_id }}</td>
            <td class="py-2 px-4 text-sm text-left">
              {{ session.patient_id }}
            </td>
            <td class="py-2 px-4 text-sm text-left">{{ session.remarks }}</td>
            <td class="py-2 px-4 text-sm text-left">{{ session.tags }}</td>
            <td class="py-2 px-4 text-sm text-left">
              {{ session.device_name }}
            </td>
            <td
              v-if="!isSharedWithMeRoute"
              class="py-2 px-4 flex justify-left space-x-2"
            >
              <button
                @click.stop="showShareModal(session)"
                class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center space-x-2"
              >
                <ShareIcon class="h-5 w-5" />
                <span>Share</span>
              </button>

              <button
                @click.stop="showEditModal(session)"
                class="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center space-x-2"
              >
                <PencilIcon class="h-5 w-5" />
                <span>Edit</span>
              </button>
              <button
                @click.stop="showRemoveModal(session)"
                class="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center space-x-2"
              >
                <TrashIcon class="h-5 w-5" />
                <span>Delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Component -->
    <Pagination
      v-if="totalSessions > sessionsPerPage"
      :totalItems="totalSessions"
      :currentPage="currentPage"
      :itemsPerPage="sessionsPerPage"
      @update:currentPage="handlePageChange"
    />

    <!-- Add Session Modal -->
    <div
      v-if="isAddModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Add Session
        </h2>
        <form @submit.prevent="addSessionHandler">
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Name</label>
            <input
              v-model="newSessionName"
              class="border border-gray-300 px-4 py-2 w-full rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Sample ID</label>
            <input
              v-model="newSessionSampleId"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Patient ID</label>
            <input
              v-model="newSessionPatientId"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Remarks</label>
            <input
              v-model="newSessionRemarks"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Tags</label>
            <input
              v-model="newSessionTags"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>

          <!-- Add Device Dropdown -->
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Select Device</label>
            <select
              v-model="selectedDeviceId"
              class="border border-gray-300 px-4 py-2 w-full rounded"
              required
              v-if="filteredDevices.length > 0"
            >
              <option disabled value="">Please select a device</option>
              <option
                v-for="device in filteredDevices"
                :key="device.id"
                :value="device.android_id"
              >
                {{ device.name || device.android_id }}
              </option>
            </select>

            <!-- Error message if no devices are linked -->
            <p v-else class="text-danger">
              No devices found linked to this department. Please link a device
              to the department first.
            </p>
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
              Add Session
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Remove Session Confirmation Modal -->
    <DeleteModal
      v-if="isRemoveModalVisible"
      :title="`Are you sure you want to remove session “${removeSessionId}”?`"
      @close="isRemoveModalVisible = false"
      @remove="removeSessionHandler"
    />

    <!-- Edit Session Modal -->
    <div
      v-if="isEditModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Edit Session
        </h2>
        <form @submit.prevent="updateSessionHandler">
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Name</label>
            <input
              v-model="editSessionName"
              class="border border-gray-300 px-4 py-2 w-full rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Sample ID</label>
            <input
              v-model="editSessionSampleId"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Patient ID</label>
            <input
              v-model="editSessionPatientId"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Remarks</label>
            <input
              v-model="editSessionRemarks"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>
          <div class="mb-4">
            <label class="block mb-2 font-semibold">Tags</label>
            <input
              v-model="editSessionTags"
              class="border border-gray-300 px-4 py-2 w-full rounded"
            />
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="isEditModalVisible = false"
              class="btn btn-outline !rounded-xl"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary !rounded-xl">
              Update Session
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Shared Modal -->
    <div
      v-if="isShareModalVisible"
      class="fixed inset-0 z-30 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
    >
      <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
        <h2
          class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
        >
          Share Session
        </h2>

        <!-- Input to add new user -->
        <div class="flex items-center relative w-full mb-4">
          <input
            class="bg-white rounded-full w-full py-3 pl-12 pr-6 border border-grey-200 focus:border-primary focus:shadow-primary/40 placeholder:text-grey-600"
            placeholder="Search Email"
            type="text"
            v-model="newUserEmail"
            @keyup.enter="addShare"
          />
          <button
            @click="addShare"
            class="absolute left-1 top-1/2 transform -translate-y-1/2 cursor-pointer p-4"
          >
            <SearchIcon />
          </button>
        </div>

        <!-- List of users with access -->
        <div class="mb-4">
          <div
            class="flex items-center gap-2 mb-2"
            @click="isPeopleWithAccess = !isPeopleWithAccess"
          >
            <h3 class="text-base font-medium text-secondary">
              People with access
            </h3>
            <ArrowIcon
              class="size-2.5 transition-all"
              :class="isPeopleWithAccess ? 'rotate-90' : '-rotate-90'"
            />
          </div>
          <ul class="space-y-4" v-if="isPeopleWithAccess">
            <li
              v-for="share in sharedUsers"
              :key="share.shared_with_email"
              class="flex justify-between items-center space-x-4"
            >
              {{ console.log("sharedUsers", sharedUsers) }}
              <div class="flex items-center gap-3 transition-all">
                <div
                  class="w-11 h-11 flex items-center uppercase justify-center font-light text-sm bg-primary text-white rounded-full flex-shrink-0"
                >
                  {{ share.shared_with_email.charAt(0) }}
                </div>
                <div class="flex flex-col">
                  <!-- <h1 class="text-xs font-medium text-grey-100 uppercase">
                    {{share.shared_with_name}}
                  </h1> -->
                  <p class="text-sm text-grey-100">
                    {{ share.shared_with_email }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <!-- Editor/Viewer Dropdown -->
                <select
                  v-model="share.is_editor"
                  @change="updateShare(share)"
                  class="border border-gray-300 px-2 py-1.5 cursor-pointer text-sm rounded-lg"
                >
                  <option :value="true">Editor</option>
                  <option :value="false">Viewer</option>
                </select>

                <!-- Remove Button -->
                <button
                  @click="removeShare(share)"
                  class="text-danger hover:bg-danger/20 transition-all !rounded-lg !py-2 text-sm !px-2"
                >
                  <TrashIcon class="size-4" />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Add Public/Private Toggle -->
        <div class="mb-4">
          <h3 class="text-lg font-medium text-secondary mb-2">
            General access
          </h3>
          <div class="flex items-center gap-3 my-3">
            <div class="bg-grey-200 rounded-full p-1.5">
              <svg
                width="32"
                height="32"
                viewBox="0 0 37 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 5.82129C16.0525 5.82129 13.6599 6.54707 11.6248 7.90685C9.58977 9.26664 8.00363 11.1993 7.067 13.4606C6.13036 15.7218 5.8853 18.21 6.36279 20.6105C6.84028 23.011 8.01888 25.2161 9.74956 26.9467C11.4802 28.6774 13.6852 29.856 16.0858 30.3335C18.4863 30.811 20.9745 30.5659 23.2357 29.6293C25.4969 28.6927 27.4297 27.1065 28.7894 25.0715C30.1492 23.0364 30.875 20.6438 30.875 18.1963C30.875 14.9142 29.5712 11.7666 27.2505 9.44584C24.9297 7.12508 21.7821 5.82129 18.5 5.82129Z"
                  stroke="#111015"
                  stroke-width="2.25"
                  stroke-miterlimit="10"
                />
                <path
                  d="M14.5625 14.4194C14.5625 14.4194 14.6216 13.1889 15.9385 12.1293C16.7197 11.5 17.6562 11.3179 18.5 11.3052C19.2685 11.2954 19.9548 11.4226 20.3654 11.6181C21.0685 11.9528 22.4375 12.7698 22.4375 14.5073C22.4375 16.3354 21.2422 17.1658 19.8802 18.0791C18.5183 18.9925 18.1484 19.9839 18.1484 21.0083"
                  stroke="#111015"
                  stroke-width="1.96875"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                />
                <path
                  d="M18.0781 26.0713C18.8548 26.0713 19.4844 25.4417 19.4844 24.665C19.4844 23.8884 18.8548 23.2588 18.0781 23.2588C17.3015 23.2588 16.6719 23.8884 16.6719 24.665C16.6719 25.4417 17.3015 26.0713 18.0781 26.0713Z"
                  fill="#111015"
                />
              </svg>
            </div>
            <div class="relative">
              <button
                @click="toggleDropdown"
                class="flex items-center text-base text-secondary"
              >
                {{ selectedAccess }}
                <svg
                  class="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute z-30 mt-1 py-1 w-32 bg-white border border-gray-200 rounded shadow-lg"
              >
                <ul>
                  <li
                    v-for="option in accessOptions"
                    :key="option"
                    @click="selectAccess(option)"
                    class="px-4 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {{ option }}
                  </li>
                </ul>
              </div>
              <p class="text-sm text-gray-500">
                People with access can only view the file
              </p>
            </div>
          </div>
        </div>

        <!-- Copied Message -->
        <div
          v-if="isCopied"
          class="text-sm text-green-600 bg-green-100 border border-green-500 max-w-lg w-full rounded-lg py-3 px-4 mb-2"
        >
          Link copied to clipboard!
        </div>

        <div class="flex gap-2 justify-between">
          <button
            type="button"
            @click="copyPublicLink"
            class="btn btn-primary-outline !rounded-xl flex items-center gap-2 !px-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
            <span v-if="!isCopied">Copy Link</span>
            <span v-else>Copied!</span>
          </button>
          <button
            type="button"
            @click="
              () => {
                isShareModalVisible = false;
                isCopied = false;
              }
            "
            class="btn btn-outline !rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import backend from "@/backend";
import { PencilIcon, TrashIcon, ShareIcon } from "@heroicons/vue/24/solid";
import { useRoute, useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import Menu from "@/components/form/menu.vue";
import { EllipsisHorizontalIcon } from "@heroicons/vue/24/outline";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import MobileHeader from "@/components/MobileHeader.vue";
import Tabs from "@/components/Tabs.vue";

const route = useRoute();
const router = useRouter();
const departmentId = ref(route.params.department_id || null);
const isSharedWithMeRoute = computed(() => route.name === "shared_sessions");

const sessions = ref([]);
const errorMessage = ref("");
const isAddModalVisible = ref(false);
const isEditModalVisible = ref(false);
const isRemoveModalVisible = ref(false);
const newSessionName = ref("");
const newSessionSampleId = ref("");
const newSessionPatientId = ref("");
const newSessionRemarks = ref("");
const newSessionTags = ref("");

let editSessionId = null;
const editSessionName = ref("");
const editSessionSampleId = ref("");
const editSessionPatientId = ref("");
const editSessionRemarks = ref("");
const editSessionTags = ref("");
const removeSessionId = ref("");

const filteredDevices = ref([]);
const selectedDeviceId = ref("");
const departmentName = ref("");

const isShareModalVisible = ref(false);
const sharedUsers = ref([]);
const shareSessionId = ref(null);
const newUserEmail = ref("");
const newUserEditor = ref(false); // Track if new user is an editor
const isSharePublic = ref(false);
const publicSessionLink = ref("");
const isCopied = ref(false);
const isPeopleWithAccess = ref(false);

const searchQuery = ref("");
const sortBy = ref("created_at"); // Default sorting field
const sortOrder = ref("DESC"); // Default sorting order

const currentPage = ref(1); // Track the current page
const sessionsPerPage = 8; // Number of sessions per page
const totalSessions = ref(0); // Total number of sessions

const selectedAccess = ref("Viewer");
const isDropdownOpen = ref(false);
const accessOptions = ["Viewer", "Public", "Editor", "Owner"];

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
console.log(selectedAccess.value);

function selectAccess(option) {
  selectedAccess.value = option;
  isDropdownOpen.value = false;
  if (option === "Public") {
    isSharePublic.value = true;
    toggleSharePublic();
  } else if (option === "Editor") {
    newUserEditor.value = true;
  } else {
    isSharePublic.value = false;
    newUserEditor.value = false;
    toggleSharePublic();
  }
}
const formattedDate = (value) => {
  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Function to toggle the public/private state
const toggleSharePublic = async () => {
  try {
    await backend.sessions.updateSession(
      shareSessionId.value,
      null,
      null,
      null,
      null,
      null,
      isSharePublic.value
    );
  } catch (error) {
    errorMessage.value("Failed to update session public state", error);
  }
};

const copyPublicLink = () => {
  navigator.clipboard.writeText(publicSessionLink.value);
  isCopied.value = true;
};

watch(isCopied, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
});

// Show share modal
const showShareModal = async (session) => {
  try {
    shareSessionId.value = session.id;
    sharedUsers.value = await backend.session_shares.getSessionShares(
      session.id
    );
    isSharePublic.value = session.is_public;
    publicSessionLink.value = `${window.location.origin}/shared/sessions/${shareSessionId.value}`;
    isShareModalVisible.value = true;
  } catch (error) {
    errorMessage.value = "Failed to fetch shared users.";
  }
};

// Add a new share
const addShare = async () => {
  try {
    await backend.session_shares.addSessionShare(
      shareSessionId.value,
      newUserEmail.value,
      newUserEditor.value // Pass editor status
    );
    // Fetch the updated list of shared users
    sharedUsers.value = await backend.session_shares.getSessionShares(
      shareSessionId.value
    );
    newUserEmail.value = ""; // Clear input
    newUserEditor.value = false; // Reset editor checkbox
  } catch (error) {
    errorMessage.value = "Failed to share session.";
  }
};

// Update a user's role (editor/viewer)
const updateShare = async (share) => {
  try {
    await backend.session_shares.updateSessionShare(
      shareSessionId.value,
      share.id, // Assuming user.id is share_id
      share.is_editor
    );
  } catch (error) {
    errorMessage.value = "Failed to update user role.";
    errorMessage.value += error;
  }
};

// Remove a user from the session shares
const removeShare = async (share) => {
  try {
    await backend.session_shares.removeSessionShare(
      shareSessionId.value,
      share.id
    );

    sharedUsers.value = await backend.session_shares.getSessionShares(
      shareSessionId.value
    );
  } catch (error) {
    errorMessage.value = "Failed to remove user.";
  }
};

// Function to navigate to the departments page
const goToDepartmentsPage = () => {
  router.push("/departments");
};

// Function to navigate to the specific department page
const goToDepartmentPage = () => {
  router.push(`/departments/${departmentId.value}`);
};

const showAddModal = () => {
  newSessionName.value = "";
  newSessionPatientId.value = "";
  newSessionSampleId.value = "";
  newSessionRemarks.value = "";
  newSessionTags.value = "";
  isAddModalVisible.value = true;
};

const fetchDevices = async () => {
  try {
    // Fetch all devices
    filteredDevices.value = (
      await backend.devices.getDevices(departmentId.value, 20, 0)
    )?.devices;
  } catch (error) {
    errorMessage.value = "Failed to fetch devices.";
  }
};

const getSortParams = computed(() => {
  switch (sortBy.value) {
    case "recent":
      return { field: "created_at", order: "DESC" };
    case "ASC":
      return { field: "name", order: "ASC" };
    case "last_updated":
      return { field: "updated_at", order: "DESC" };
    case "created_at":
      return { field: "created_at", order: "ASC" };
    default:
      return { field: "created_at", order: "DESC" };
  }
});

const fetchSessions = async () => {
  try {
    const offset = (currentPage.value - 1) * sessionsPerPage;
    let response;
    const { field, order } = getSortParams.value;

    if (!isSharedWithMeRoute.value) {
      if (departmentId.value) {
        const department = await backend.departments.getDepartment(
          departmentId.value
        );
        departmentName.value = department.name;
      }

      response = await backend.sessions.getSessions(
        departmentId.value,
        sessionsPerPage, // Limit
        offset, // Offset
        true, // Show thumbnails
        searchQuery.value, // Pass search query
        field, // Pass sort by field
        order // Pass sort order
      );
    } else {
      response = await backend.session_shares.getSharedSessions(
        sessionsPerPage,
        offset,
        true, // show_thumbnails
        searchQuery.value, // search query
        field, // sort by field
        order // sort order
      );
    }

    sessions.value = response.sessions;
    totalSessions.value = response.total_count; // Capture total count for pagination
  } catch (error) {
    errorMessage.value = "Failed to fetch sessions.";
    console.log(error);
  }
};

// Handle page change event from Pagination component
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Watch for page changes and refetch sessions
watch(currentPage, fetchSessions);

watch(isShareModalVisible, () => {
  if (isSharePublic.value) {
    selectedAccess.value = "Public";
  }
});

const addSessionHandler = async () => {
  try {
    await backend.sessions.createSession(
      selectedDeviceId.value,
      newSessionName.value,
      newSessionSampleId.value,
      newSessionPatientId.value,
      newSessionRemarks.value,
      newSessionTags.value
    );
    fetchSessions();
    isAddModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to add session.";
  }
};

// Show edit modal for a session
const showEditModal = (session) => {
  editSessionId = session.id;
  editSessionName.value = session.name;
  editSessionSampleId.value = session.sample_id;
  editSessionPatientId.value = session.patient_id;
  editSessionRemarks.value = session.remarks;
  editSessionTags.value = session.tags;
  isEditModalVisible.value = true;
};

// Update the session
const updateSessionHandler = async () => {
  try {
    await backend.sessions.updateSession(
      editSessionId,
      editSessionName.value,
      editSessionSampleId.value,
      editSessionPatientId.value,
      editSessionRemarks.value,
      editSessionTags.value
    );
    fetchSessions();
    isEditModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to update session.";
    errorMessage.value += error;
  }
};

// Show remove modal for a session
const showRemoveModal = (session) => {
  removeSessionId.value = session.id;
  isRemoveModalVisible.value = true;
};

// Remove the session
const removeSessionHandler = async () => {
  try {
    await backend.sessions.deleteSession(removeSessionId.value);
    fetchSessions(); // Refresh sessions after deleting
    isRemoveModalVisible.value = false;
  } catch (error) {
    errorMessage.value = "Failed to remove session.";
  }
};

const goToSession = (session) => {
  if (isSharedWithMeRoute.value) {
    router.push({
      name: "shared_media_list",
      params: { session_id: session.id },
    });
  } else {
    router.push({
      name: "media_list",
      params: { department_id: departmentId.value, session_id: session.id },
    });
  }
};

onMounted(() => {
  if (!isSharedWithMeRoute.value) {
    fetchDevices();
  }
  fetchSessions();
});
</script>
