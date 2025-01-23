<template>
  <div class="flex flex-col md:pt-6 flex-1 md:overflow-auto">
    <div class="md:flex flex-1 h-full md:gap-6 items-center w-full">
      <!-- Canvas Container with a Frame and Responsive Design -->
      <div
        class="relative flex flex-col flex-1 h-[calc(100vh_-_162px)] md:h-full md:w-full -mx-4 md:-m-0 bg-white md:drop-shadow-3xl md:rounded-3xl overflow-auto custom-scrollbar"
      >
        <div
          v-if="isLoading"
          class="absolute inset-0 text-gray-500 flex-1 flex items-center justify-center"
        >
          Loading...
        </div>
        <div class="canvas-container relative md:h-full">
          <canvas
            ref="canvas"
            :width="as.width"
            :height="as.height"
            @wheel="onWheel"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @mousemove="onMouseMove"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            class="cursor-grab"
          ></canvas>
        </div>
      </div>
      <div
        class="md:!w-24 flex-shrink-0 fixed z-30 bottom-0 py-2 md:py-0 inset-x-0 bg-white md:bg-transparent md:h-full flex flex-col md:relative"
      >
        <div
          class="bg-white md:bg-transparent md:h-full flex flex-col relative"
        >
          <div
            v-if="!is_public && annotationContainer"
            class="md:absolute md:top-1/2 md:-translate-y-1/2 md:right-full bottom-full md:bottom-auto inset-x-0 md:inset-x-auto mb-2 md:mb-0 md:mr-10 border-b md:border-0 border-gray-200 bg-white md:rounded-2xl drop-shadow-3xl flex md:flex-col gap-2 md:py-4 pb-3 pt-1 px-4 max-h-full overflow-auto"
          >
            <!-- Toolbar for Annotation Tools -->
            <div
              v-if="!is_public"
              class="flex justify-between w-full md:w-auto md:flex-col md:gap-3 gap-4"
            >
              <button
                @click="activatePan"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isPanToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5"
                  >
                    <mask
                      id="mask0_4_32348"
                      style="mask-type: alpha"
                      maskUnits="userSpaceOnUse"
                      x="3"
                      y="2"
                      width="24"
                      height="24"
                    >
                      <rect
                        x="3.04492"
                        y="2.09277"
                        width="23.8095"
                        height="23.8095"
                        fill="#D9D9D9"
                      />
                    </mask>
                    <g mask="url(#mask0_4_32348)"></g>
                    <path
                      d="M13.9973 6.21929V3.99707M19.5528 8.44151L21.1084 6.88596M21.7751 13.9971H23.9973M19.5528 19.5526L21.1084 21.1082M13.9973 21.7748V23.9971M8.44173 19.5526L6.88618 21.1082M7.33062 13.9971H5.1084M8.44173 8.44151L6.88618 6.88596M10.664 13.9971C10.664 14.8811 11.0151 15.729 11.6403 16.3541C12.2654 16.9792 13.1132 17.3304 13.9973 17.3304C14.8813 17.3304 15.7292 16.9792 16.3543 16.3541C16.9794 15.729 17.3306 14.8811 17.3306 13.9971C17.3306 13.113 16.9794 12.2652 16.3543 11.64C15.7292 11.0149 14.8813 10.6637 13.9973 10.6637C13.1132 10.6637 12.2654 11.0149 11.6403 11.64C11.0151 12.2652 10.664 13.113 10.664 13.9971Z"
                      stroke="currentColor"
                      stroke-width="1.67619"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="text-xs font-medium">Freehand</div>
              </button>
              <button
                @click="activateSelect"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isSelectToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <CursorArrowRaysIcon class="size-5" />
                </div>
                <div class="text-xs font-medium">Select</div>
              </button>
              <button
                @click="deleteAnnotations"
                :disabled="!as.isSelectToolSelected"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isSelectToolSelected
                      ? 'bg-danger text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <TrashIcon class="size-5" />
                </div>
                <div class="text-xs font-medium">Delete</div>
              </button>
              <button
                @click="activateSketch"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isSketchToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <svg
                    class="size-5"
                    width="49"
                    height="48"
                    viewBox="0 0 49 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.71387 26.9437C5.4053 23.1825 13.5619 12.4957 23.1036 6.48538C30.2796 1.96652 37.0579 7.93223 31.8019 13.9391C26.6624 19.8157 19.7676 27.9037 16.8259 31.9185C13.7744 36.0808 18.9962 41.1139 24.2213 36.3242C27.715 33.1219 31.3527 29.4397 35.0487 26.7174C40.0407 23.0454 44.323 26.2888 42.1459 30.4271C40.5687 33.4202 39.427 34.7402 38.1104 37.2568C36.7973 39.7768 38.1893 42.7939 40.1813 43.0545C42.6499 43.3768 44.2133 41.6042 46.3219 38.8442"
                      stroke="currentColor"
                      stroke-width="3.01714"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="text-xs font-medium">Free</div>
              </button>
              <button
                @click="activateRectangle"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isRectangleToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5"
                  >
                    <path
                      d="M8 2H2V8M2 16V20M16 2H20M16 34H20M34 16V20M28 2H34V8M8 34H2V28M28 34H34V28"
                      stroke="currentColor"
                      stroke-width="3.01714"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="text-xs font-medium">Square</div>
              </button>
              <button
                @click="activateCircle"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isCircleToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="size-5"
                  >
                    <path
                      d="M29.1427 2.29696C25.7582 1.5195 22.2415 1.5195 18.857 2.29696M12.3084 5.03982C10.8374 5.95242 9.46941 7.0215 8.22839 8.22839C7.0215 9.46941 5.95242 10.8374 5.03982 12.3084M2.29696 18.857C1.5195 22.2415 1.5195 25.7582 2.29696 29.1427M5.03982 35.6912C5.95242 37.1623 7.0215 38.5302 8.22839 39.7712C9.46953 40.9781 10.8341 42.0478 12.3084 42.9598M18.857 45.7027C22.2415 46.4799 25.7581 46.4799 29.1427 45.7027M35.6912 42.9598C37.1655 42.0478 38.5301 40.9781 39.7712 39.7712C40.9781 38.5301 42.0478 37.1621 42.9598 35.6912M45.7027 29.1427C46.4799 25.7581 46.4799 22.2415 45.7027 18.857M42.9598 12.3084C42.0473 10.8373 40.9782 9.46936 39.7712 8.22839C38.5303 7.0214 37.1623 5.95231 35.6912 5.03982"
                      stroke="currentColor"
                      stroke-width="3.01714"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div class="text-xs font-medium">Circle</div>
              </button>
              <button
                @click="activateArrow"
                class="flex flex-col gap-0.5 items-center justify-center w-full"
              >
                <div
                  class="md:rounded-lg rounded-full size-9 flex items-center justify-center"
                  :class="
                    as.isArrowToolSelected
                      ? 'bg-secondary text-white'
                      : 'bg-white text-secondary'
                  "
                >
                  <svg
                    class="size-5"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.80014 4.80014V3.42871C4.43642 3.42871 4.08759 3.5732 3.8304 3.8304C3.5732 4.08759 3.42871 4.43642 3.42871 4.80014H4.80014ZM4.80014 15.7716H3.42871C3.42823 16.0432 3.5084 16.3088 3.65906 16.5348C3.80972 16.7608 4.02409 16.9369 4.27499 17.0409C4.52588 17.1449 4.80201 17.1721 5.06837 17.119C5.33472 17.0658 5.57931 16.9348 5.77111 16.7425L4.80014 15.7716ZM15.7716 4.80014L16.7425 5.77111C16.9348 5.57931 17.0658 5.33472 17.119 5.06837C17.1721 4.80201 17.1449 4.52588 17.0409 4.27499C16.9369 4.02409 16.7608 3.80972 16.5348 3.65906C16.3088 3.5084 16.0432 3.42823 15.7716 3.42871V4.80014ZM9.31488 11.2568L42.2292 44.1711L44.1711 42.2292L11.2568 9.31488L9.31488 11.2568ZM3.42871 4.80014V15.7716H6.17157V4.80014H3.42871ZM5.77111 16.7425L16.7425 5.77111L14.8006 3.82917L3.82917 14.8006L5.77111 16.7425ZM15.7716 3.42871H4.80014V6.17157H15.7716V3.42871Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div class="text-xs font-medium">Arrow</div>
              </button>
              <label
                for="color-picker"
                class="flex flex-col md:gap-2 gap-0.5 items-center justify-center w-full cursor-pointer"
              >
                <!-- Color Picker for Sketch Tool -->
                <div class="size-9 md:size-7 flex items-center justify-center">
                  <div
                    class="text-xs size-5 flex items-center justify-center font-medium relative rounded-full overflow-hidden"
                  >
                    <input
                      id="color-picker"
                      type="color"
                      v-model="selectedColor"
                      class="size-10 flex-shrink-0 cursor-pointer rouhded-full"
                    />
                    <!-- <div
                    class="hidden absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white cursor-pointer"
                  >
                    <svg
                      class="size-5"
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.96391 8.99772H9.63058V7.33105H11.2972V5.66439H9.63058V3.99772H7.96391V5.66439H6.29725V7.33105H7.96391V8.99772ZM21.2972 15.6644H19.6306V17.3311H17.9639V18.9977H19.6306V20.6644H21.2972V18.9977H22.9639V17.3311H21.2972V15.6644ZM23.9972 3.99772V2.33105H22.3306V3.99772H20.6639V5.66439H22.3306V7.33105H23.9972V5.66439H25.6639V3.99772H23.9972ZM19.0856 8.06772C18.8546 7.8339 18.5795 7.64826 18.2762 7.52156C17.973 7.39486 17.6476 7.32962 17.3189 7.32962C16.9902 7.32962 16.6648 7.39486 16.3616 7.52156C16.0583 7.64826 15.7832 7.8339 15.5522 8.06772L3.06891 20.5511C2.8351 20.782 2.64946 21.0571 2.52275 21.3604C2.39605 21.6637 2.33081 21.9891 2.33081 22.3177C2.33081 22.6464 2.39605 22.9718 2.52275 23.275C2.64946 23.5783 2.8351 23.8534 3.06891 24.0844C4.05225 25.0677 5.63558 25.0677 6.60225 24.0844L19.0856 11.6011C20.0522 10.6344 20.0522 9.05105 19.0856 8.06772ZM5.41891 22.9011C5.08558 23.2344 4.56891 23.2344 4.23558 22.9011C3.90225 22.5677 3.90225 22.0511 4.23558 21.7177L15.0022 10.9511L16.1856 12.1344L5.41891 22.9011ZM17.9022 10.4177L17.3689 10.9511L16.1856 9.76772L16.7189 9.23439C17.0522 8.90105 17.5689 8.90105 17.9022 9.23439C18.2189 9.56772 18.2189 10.1011 17.9022 10.4177Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div> -->
                  </div>
                </div>
                <div class="text-xs font-medium">Color</div>
              </label>
            </div>
            <!-- <div v-if="!is_public" class="flex flex-col gap-2 mb-4 hidden">
              <div
                v-for="colorOption in colorOptions"
                :key="colorOption"
                @click="selectedColor = colorOption.replace('#', '')"
                :class="{
                  'ring-2 ring-blue-500':
                    selectedColor === colorOption.replace('#', ''),
                }"
                class="w-8 h-8 rounded-full cursor-pointer"
                :style="{ backgroundColor: `#${colorOption.replace('#', '')}` }"
              ></div>
            </div> -->
          </div>
          <div class="flex flex-col gap-6 h-full">
            <div
              class="md:bg-white h-full rounded-3xl drop-shadow-3xl flex md:flex-col gap-2 px-2 items-center justify-center md:py-6"
            >
              <button
                @click="annotationContainer = !annotationContainer"
                class="flex flex-col gap-1 items-center justify-center md:py-2 md:w-full"
              >
                <div
                  class="md:rounded-lg rounded-full p-3"
                  :class="
                    annotationContainer
                      ? 'md:bg-primary text-white bg-secondary'
                      : 'md:bg-white md:text-secondary'
                  "
                >
                  <EditIcon class="size-6" />
                </div>
                <div class="text-sm font-medium hidden md:block">Annotate</div>
              </button>
              <button
                class="flex flex-col gap-1 items-center justify-center md:py-2"
                @click="activateComment"
              >
                <div
                  class="md:rounded-lg rounded-full p-3"
                  :class="
                    as.isCommentToolSelected
                      ? 'md:bg-primary text-white bg-secondary'
                      : 'md:bg-white md:text-secondary'
                  "
                >
                  <svg
                    class="size-6"
                    width="29"
                    height="29"
                    viewBox="0 0 29 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.7591 9.96173H20.2406M8.7591 14.5543H13.3517M14.4998 23.7395L9.90724 19.1469H6.4628C5.85378 19.1469 5.26971 18.905 4.83907 18.4743C4.40843 18.0437 4.1665 17.4596 4.1665 16.8506V7.66544C4.1665 7.05642 4.40843 6.47235 4.83907 6.04171C5.26971 5.61107 5.85378 5.36914 6.4628 5.36914H22.5369C23.1459 5.36914 23.73 5.61107 24.1606 6.04171C24.5912 6.47235 24.8332 7.05642 24.8332 7.66544V16.8506C24.8332 17.4596 24.5912 18.0437 24.1606 18.4743C23.73 18.905 23.1459 19.1469 22.5369 19.1469H19.0924L14.4998 23.7395Z"
                      stroke="currentColor"
                      stroke-width="1.72222"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div class="text-secondary text-sm font-medium hidden md:block">
                  Comment
                </div>
              </button>
            </div>
            <div
              @click="infoHandler"
              class="hidden bg-white rounded-3xl drop-shadow-3xl md:flex flex-col gap-2 items-center justify-center py-6"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5001 3.36035C12.2861 3.36035 10.1217 4.01689 8.28081 5.24696C6.4399 6.47702 5.00508 8.22535 4.1578 10.2709C3.31051 12.3164 3.08883 14.5672 3.52077 16.7387C3.95271 18.9102 5.01887 20.9049 6.58445 22.4705C8.15002 24.036 10.1447 25.1022 12.3162 25.5341C14.4877 25.9661 16.7385 25.7444 18.784 24.8971C20.8296 24.0498 22.5779 22.615 23.808 20.7741C25.038 18.9332 25.6946 16.7688 25.6946 14.5548C25.6914 11.5868 24.511 8.74128 22.4123 6.64259C20.3136 4.5439 17.4681 3.36349 14.5001 3.36035ZM14.5001 24.027C12.6267 24.027 10.7953 23.4715 9.23763 22.4307C7.67993 21.3898 6.46585 19.9105 5.74892 18.1797C5.03199 16.4488 4.84441 14.5443 5.2099 12.7069C5.57539 10.8694 6.47753 9.18164 7.80224 7.85692C9.12696 6.53221 10.8147 5.63007 12.6522 5.26458C14.4896 4.89909 16.3942 5.08667 18.125 5.8036C19.8558 6.52053 21.3352 7.73461 22.376 9.29231C23.4168 10.85 23.9723 12.6814 23.9723 14.5548C23.9695 17.0661 22.9706 19.4738 21.1948 21.2495C19.4191 23.0253 17.0114 24.0242 14.5001 24.027ZM16.2223 19.7215C16.2223 19.9498 16.1316 20.1689 15.9701 20.3304C15.8086 20.4919 15.5896 20.5826 15.3612 20.5826C14.9045 20.5826 14.4664 20.4011 14.1434 20.0781C13.8205 19.7552 13.639 19.3171 13.639 18.8604V14.5548C13.4106 14.5548 13.1916 14.4641 13.0301 14.3026C12.8686 14.1411 12.7779 13.9221 12.7779 13.6937C12.7779 13.4653 12.8686 13.2463 13.0301 13.0848C13.1916 12.9233 13.4106 12.8326 13.639 12.8326C14.0958 12.8326 14.5338 13.014 14.8568 13.337C15.1798 13.66 15.3612 14.098 15.3612 14.5548V18.8604C15.5896 18.8604 15.8086 18.9511 15.9701 19.1126C16.1316 19.2741 16.2223 19.4931 16.2223 19.7215ZM12.7779 9.81869C12.7779 9.56322 12.8536 9.31349 12.9956 9.10107C13.1375 8.88866 13.3392 8.7231 13.5753 8.62534C13.8113 8.52758 14.071 8.502 14.3216 8.55184C14.5721 8.60168 14.8023 8.7247 14.9829 8.90534C15.1635 9.08598 15.2866 9.31613 15.3364 9.56669C15.3862 9.81725 15.3607 10.077 15.2629 10.313C15.1651 10.549 14.9996 10.7507 14.7872 10.8927C14.5748 11.0346 14.325 11.1104 14.0696 11.1104C13.727 11.1104 13.3984 10.9743 13.1562 10.732C12.914 10.4898 12.7779 10.1613 12.7779 9.81869Z"
                  fill="#111015"
                />
              </svg>

              <div class="text-secondary text-sm font-medium">Info</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Label Input -->
    <div
      v-if="isLabelModalVisible"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-xl font-semibold mb-4">
          Enter a label for your annotation
        </h2>
        <input
          type="text"
          v-model="annotationLabel"
          placeholder="Annotation label"
          class="border border-gray-300 p-2 rounded w-full mb-4"
        />

        <div class="flex justify-end space-x-2">
          <button
            @click="confirmLabel"
            class="bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            Confirm
          </button>
          <button
            @click="cancelLabel"
            class="bg-gray-300 px-4 py-2 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Include the CommentsModal component -->
    <CommentsModal
      ref="commentsModal"
      :mediaId="currentMedia.id"
      :isVisible="isCommentModalVisible"
      :selectedCommentId="selectedCommentId"
      :commentCoordinates="newCommentCoordinates"
      @close="isCommentModalVisible = false"
      @refresh="loadComments"
    />
  </div>
</template>

<script setup>
import { nextTick, ref } from "vue";
import { as, resetState } from "@/views/media/composables/AnnotationStates.js";
import { applyToPoint } from "transformation-matrix";
import backend from "@/backend";
import CommentsModal from "@/components/CommentsModal.vue";
import {
  ArrowsPointingOutIcon,
  CursorArrowRaysIcon,
  TrashIcon,
  ChatBubbleBottomCenterIcon,
  PencilIcon,
  ArrowLongRightIcon,
  PlusCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/vue/24/solid";
import EditIcon from "@/components/icons/EditIcon.vue";

const props = defineProps({
  infoHandler: {
    type: Function,
    required: true,
  },
});

const canvas = ref(null);
const annotationContainer = ref(false);

const currentMedia = ref({});
const isLabelModalVisible = ref(false); // State for modal visibility
const annotationLabel = ref(""); // Holds the label input
const selectedColor = ref("#FFFF00"); // Default selected color (Yellow)
const colorOptions = ["FFFF00", "FF0000", "00FF00", "0000FF", "FF00FF"];
let currentAnnotation = null; // Temporarily stores the annotation

const isCommentModalVisible = ref(false);
const commentContent = ref("");
const selectedCommentId = ref(null);
const newCommentCoordinates = ref(null);
let commentCoordinates = null; // Store coordinates for the comment
const commentsModal = ref(null);
const is_public = ref(false);
const isLoading = ref(false);

// Add these to your existing state variables
as.isRectangleToolSelected = false;
as.isCircleToolSelected = false;
as.isArrowToolSelected = false;
as.isDrawingShape = false;
as.currentShapeStart = null;
as.currentShapeEnd = null;

async function load(media, is_public_media = false) {
  isLoading.value = true; // Start loading
  is_public.value = is_public_media;
  currentMedia.value = media;
  resetState();
  as.canvas = canvas.value.getContext("2d");
  as.img.onload = async () => {
    as.width = as.img.naturalWidth;
    as.height = as.img.naturalHeight;
    // Update the canvas element's width and height attributes
    const canvasElement = canvas.value;
    canvasElement.width = as.width;
    canvasElement.height = as.height;
    // Reassign the context
    as.canvas = canvasElement.getContext("2d");
    await nextTick();
    // Optionally, adjust the initial scale to fit the container
    const containerWidth = canvasElement.parentElement.clientWidth;
    const scaleFactor = containerWidth / as.width;
    setScale(0, 0, scaleFactor);
    isLoading.value = false;
    clear();
    draw();
  };

  if (!is_public_media) {
    await loadAnnotations();
    await loadComments();
    await commentsModal.value.fetchComments();
  } else {
    await loadPublicAnnotations();
  }
  as.img.src = currentMedia.value.url;
}

async function loadAnnotations() {
  as.annotations = await backend.annotations.getMediaAnnotations(
    currentMedia.value.id
  );
  if (!as.annotations) {
    as.annotations = [];
  }
  clear();
  draw();
}

async function loadPublicAnnotations() {
  as.annotations = await backend.public.listPublicAnnotations(
    currentMedia.value.id
  );
  if (!as.annotations) {
    as.annotations = [];
  }
  clear();
  draw();
}

async function loadComments() {
  as.comments = await backend.comments.getMediaComments(currentMedia.value.id);
  if (!as.comments) {
    as.comments = [];
  }
  clear();
  draw();
}

function openCommentModal(x, y) {
  commentCoordinates = { x, y };
  selectedCommentId.value = null;
  newCommentCoordinates.value = commentCoordinates;
  commentContent.value = ""; // Clear previous input
  isCommentModalVisible.value = true; // Show modal
}

function selectComment(x, y) {
  for (const comment of as.comments) {
    if (isPointNear(comment.coordinates, { x, y })) {
      // Show comment popup with content and replies
      newCommentCoordinates.value = comment?.coordinates;
      selectedCommentId.value = comment?.id;
      isCommentModalVisible.value = true;
      // openCommentPopup(comment);
      return true;
    }
  }
  return false;
}
function selectAnnotationOrComment(x, y) {
  if (selectComment(x, y)) return;
  // If no comment is clicked, handle annotation selection
  selectAnnotation(x, y);
}

function isPointNear(point1, point2, thresholdFactor = 100) {
  // Calculate adaptive threshold based on canvas size
  const canvasSize = Math.max(as.width, as.height);
  const threshold = canvasSize / thresholdFactor;

  return (
    Math.abs(point1.x - point2.x) < threshold &&
    Math.abs(point1.y - point2.y) < threshold
  );
}

function clear() {
  as.canvas.save();
  as.canvas.setTransform(1, 0, 0, 1, 0, 0);
  as.canvas.clearRect(0, 0, as.width, as.height);
  as.canvas.restore();
}

function draw() {
  as.canvas.save();
  as.canvas.drawImage(as.img, 0, 0, as.width, as.height);
  drawAnnotations();

  // Draw the shape being currently drawn
  if (as.isDrawingShape && as.currentShapeStart && as.currentShapeEnd) {
    let tempAnnotation = {
      points: [as.currentShapeStart, as.currentShapeEnd],
      color: selectedColor.value,
      annotation_type: "",
    };
    if (as.isRectangleToolSelected) {
      tempAnnotation.annotation_type = "Square";
    } else if (as.isCircleToolSelected) {
      tempAnnotation.annotation_type = "Circular";
    } else if (as.isArrowToolSelected) {
      tempAnnotation.annotation_type = "Arrow";
    }
    drawAnnotation(tempAnnotation);
  }

  as.canvas.restore();
}

function activatePan() {
  as.isPanToolSelected = true;
  as.isSketchToolSelected = false;
  as.isSelectToolSelected = false;
  as.isCommentToolSelected = false;
  as.isRectangleToolSelected = false;
  as.isCircleToolSelected = false;
  as.isArrowToolSelected = false;
}

function activateSketch() {
  as.isPanToolSelected = false;
  as.isSketchToolSelected = true;
  as.isSelectToolSelected = false;
  as.isCommentToolSelected = false;
  as.isRectangleToolSelected = false;
  as.isCircleToolSelected = false;
  as.isArrowToolSelected = false;
}

function activateSelect() {
  as.isPanToolSelected = false;
  as.isSketchToolSelected = false;
  as.isSelectToolSelected = true;
  as.isCommentToolSelected = false;
  as.isRectangleToolSelected = false;
  as.isCircleToolSelected = false;
  as.isArrowToolSelected = false;
}

function activateComment() {
  as.isPanToolSelected = false;
  as.isSketchToolSelected = false;
  as.isSelectToolSelected = false;
  as.isCommentToolSelected = true;
  as.isRectangleToolSelected = false;
  as.isCircleToolSelected = false;
  as.isArrowToolSelected = false;
}

function activateRectangle() {
  deactivateAllTools();
  as.isRectangleToolSelected = true;
}

function activateCircle() {
  deactivateAllTools();
  as.isCircleToolSelected = true;
}

function activateArrow() {
  deactivateAllTools();
  as.isArrowToolSelected = true;
}

function deactivateAllTools() {
  as.isPanToolSelected = false;
  as.isSketchToolSelected = false;
  as.isSelectToolSelected = false;
  as.isCommentToolSelected = false;
  as.isRectangleToolSelected = false;
  as.isCircleToolSelected = false;
  as.isArrowToolSelected = false;
}

function drawAnnotation(annotation) {
  let ctx = as.canvas;
  // Calculate a base line width relative to the canvas width
  const baseLineWidth = Math.max(as.width, as.height) / 300;
  // Set line width based on selection and scaling factor
  ctx.lineWidth = as.selectedAnnotations.includes(annotation)
    ? baseLineWidth * 3
    : baseLineWidth;
  let color = annotation.color || "FFFFFF"; // Default to white if undefined
  color = color.startsWith("#") ? color.slice(1) : color; // Strip #
  ctx.strokeStyle = `#${color}`; // Add # when setting color on canvas
  annotation.color = color;

  if (annotation.annotation_type.toLowerCase() === "free") {
    drawStroke(annotation.points, annotation.color);
  } else if (annotation.annotation_type.toLowerCase() === "square") {
    let [p1, p2] = annotation.points;
    let x = Math.min(p1.x, p2.x);
    let y = Math.min(p1.y, p2.y);
    let width = Math.abs(p2.x - p1.x);
    let height = Math.abs(p2.y - p1.y);
    ctx.strokeRect(x, y, width, height);
  } else if (annotation.annotation_type.toLowerCase() === "circular") {
    let [p1, p2] = annotation.points;
    let centerX = p2.x;
    let centerY = p2.y;
    let radius = Math.hypot(p1.x - p2.x, p1.y - p2.y); // Calculate radius from center (p2) to circumference (p1)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  } else if (annotation.annotation_type.toLowerCase() === "arrow") {
    let [p1, p2] = annotation.points;
    drawArrow(ctx, p1.x, p1.y, p2.x, p2.y);
  }

  // Draw label
  if (annotation.label) {
    drawAnnotationLabel(annotation);
  }
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
  // Calculate head length proportional to the canvas size
  const baseHeadlen = Math.max(as.width, as.height) / 70; // Adjust 70 to scale arrowhead size
  const headlen = baseHeadlen;

  let dx = toX - fromX;
  let dy = toY - fromY;
  let angle = Math.atan2(dy, dx);

  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function drawAnnotationLabel(annotation) {
  let ctx = as.canvas;
  let labelX, labelY;

  // Calculate adaptive font size and padding based on canvas dimensions
  const baseFontSize = Math.max(as.width, as.height) / 50;
  const fontSize = baseFontSize;
  const padding = baseFontSize / 5;
  const offset = fontSize * 0.5; // Adjust offset based on font size

  if (
    annotation.annotation_type.toLowerCase() === "free" ||
    !annotation.annotation_type
  ) {
    // Calculate the bounding box for the freehand annotation
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity;
    annotation.points.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
    });
    labelX = (minX + maxX) / 2; // Center horizontally
    labelY = minY - offset; // Position above the top edge
  } else if (annotation.annotation_type.toLowerCase() === "arrow") {
    // Position the label at the starting point of the arrow
    let [p1] = annotation.points;
    labelX = p1.x;
    labelY = p1.y - offset; // Position slightly above the starting point
  } else if (annotation.annotation_type.toLowerCase() === "circular") {
    // Position the label above the top edge of the circle
    let [p1, p2] = annotation.points;
    let centerX = p2.x;
    let centerY = p2.y;
    let radius = Math.hypot(p1.x - p2.x, p1.y - p2.y); // Radius from center to circumference
    labelX = centerX;
    labelY = centerY - radius - offset; // Position outside and above the circle
  } else {
    // For Square and other shapes, calculate top center
    let [p1, p2] = annotation.points;
    labelX = (p1.x + p2.x) / 2; // Center horizontally
    labelY = Math.min(p1.y, p2.y) - offset; // Position above the top edge
  }

  // Set font size for context
  ctx.font = `${fontSize}px Arial`;
  const textWidth = ctx.measureText(annotation.label).width;
  const textHeight = fontSize;
  ctx.fillStyle = `#${annotation.color}` || "#FFFFFF";

  // Draw label background
  ctx.fillRect(
    labelX - textWidth / 2 - padding,
    labelY - textHeight - padding,
    textWidth + 2 * padding,
    textHeight + 2 * padding
  );

  const isLight = isColorLight(`#${annotation.color}` || "#FFFFFF");
  ctx.fillStyle = isLight ? "#000000" : "#FFFFFF";
  ctx.fillText(annotation.label, labelX - textWidth / 2, labelY);
}

function drawCommentIcon(comment) {
  let ctx = as.canvas;
  const canvasWidth = as.width;
  const canvasHeight = as.height;

  // Calculate adaptive icon size and font size based on canvas dimensions
  const baseSize = Math.max(canvasWidth, canvasHeight) / 50; // Adjust the divisor to control size
  const iconSize = baseSize; // Icon radius
  const fontSize = baseSize * 0.8; // Slightly smaller font inside the icon
  const lineWidth = baseSize / 8; // Line width proportional to icon size

  const iconX = comment.coordinates.x;
  const iconY = comment.coordinates.y;

  // Draw a white circle at the comment coordinates
  ctx.beginPath();
  ctx.arc(iconX, iconY, iconSize, 0, Math.PI * 2);

  // Optional: Add shadow for depth
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = baseSize / 4;
  ctx.shadowOffsetX = baseSize / 10;
  ctx.shadowOffsetY = baseSize / 10;

  ctx.fillStyle = "#FFFFFF"; // White fill color
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = "transparent";

  ctx.strokeStyle = "#000000"; // Black outline
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Draw the first letter of the user's name inside the circle
  const userInitial = comment.user_name
    ? comment.user_name.charAt(0).toUpperCase()
    : "?"; // Fallback to "?" if user_name is not available

  ctx.fillStyle = "#000000"; // Text color
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(userInitial, iconX, iconY);
}

function drawStroke(stroke, color) {
  as.canvas.beginPath();
  as.canvas.strokeStyle = `#${color}`;
  stroke.forEach((point, index) => {
    if (index === 0) {
      as.canvas.moveTo(point.x, point.y);
    } else {
      as.canvas.lineTo(point.x, point.y);
    }
  });
  as.canvas.stroke();
}

function drawAnnotations() {
  // Draw all existing annotations
  as.annotations.forEach((annotation) => {
    drawAnnotation(annotation);
  });

  // Draw all comments on the canvas
  as.comments.forEach((comment) => {
    drawCommentIcon(comment);
  });

  // Draw current stroke with selected color
  if (as.currentStroke.length > 1) {
    as.canvas.lineWidth = 5;
    drawStroke(as.currentStroke, selectedColor.value);
  }
}

function hexToRgb(hex) {
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (r, g, b) => r + r + g + g + b + b);

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Helper function to determine if a color is light or dark
function isColorLight(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return true; // Default to light if color is not valid

  // Calculate relative luminance
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128; // Threshold for determining light or dark
}

function setScale(x, y, scale) {
  if (scale < as.minScale) {
    as.canvas.setTransform(
      DOMMatrix.fromMatrix({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0,
      })
    );
    as.currentScale = 1;
    as.currentOffsetX = 0;
    as.currentOffsetY = 0;
    clear();
    draw();
  } else if (scale > as.maxScale) {
    return;
  } else {
    clear();
    let zoom = scale / as.currentScale;
    as.canvas.translate(as.currentOffsetX, as.currentOffsetY);
    as.currentOffsetX -= x / scale - x / as.currentScale;
    as.currentOffsetY -= y / scale - y / as.currentScale;
    as.canvas.scale(zoom, zoom);
    as.canvas.translate(-as.currentOffsetX, -as.currentOffsetY);
    as.currentScale = scale;
    if (zoom < 1) {
      autoAdjust();
    }
    draw();
  }
}

function getRelativeXYfromEvent(e, touch = false, touch_index = 0) {
  if (touch) {
    let canvas = e.target;
    let x =
      ((e.touches[touch_index].clientX - canvas.getBoundingClientRect().left) *
        canvas.width) /
      canvas.clientWidth;

    let y =
      ((e.touches[touch_index].clientY - canvas.getBoundingClientRect().top) *
        canvas.height) /
      canvas.clientHeight;

    return [x, y];
  } else {
    const canvas = e.target;
    let x = (e.offsetX * canvas.width) / canvas.clientWidth;
    let y = (e.offsetY * canvas.height) / canvas.clientHeight;

    return [x, y];
  }
}

function getAbsoluteXY(x, y) {
  let [xs, ys] = [
    x / as.currentScale + as.currentOffsetX,
    y / as.currentScale + as.currentOffsetY,
  ];
  return [xs, ys];
}

function onWheel(e) {
  e.preventDefault();
  let scale = e.deltaY > 0 ? as.currentScale / 1.04 : as.currentScale * 1.04;
  let [x, y] = getRelativeXYfromEvent(e);
  setScale(x, y, scale);
}

function onMouseDown(e) {
  let [x, y] = getRelativeXYfromEvent(e);
  [x, y] = getAbsoluteXY(x, y);
  if (as.isCommentToolSelected) {
    if (selectComment(x, y)) return;
    openCommentModal(x, y);
  } else if (as.isSketchToolSelected) {
    as.currentStroke = [{ x, y }];
    as.isPanning = false;
    as.isSketching = true;
  } else if (as.isPanToolSelected) {
    [as.currentMouseX, as.currentMouseY] = getRelativeXYfromEvent(e);
    as.isPanning = true;
    as.isSketching = false;
  } else if (as.isSelectToolSelected) {
    selectAnnotationOrComment(x, y);
  } else if (
    as.isRectangleToolSelected ||
    as.isCircleToolSelected ||
    as.isArrowToolSelected
  ) {
    as.currentShapeStart = { x, y };
    as.isDrawingShape = true;
  }
}

async function onMouseUp(e) {
  if (as.isDrawingShape) {
    as.isDrawingShape = false;
    if (as.currentShapeStart && as.currentShapeEnd) {
      let annotation_type = "";
      if (as.isRectangleToolSelected) {
        annotation_type = "Square";
      } else if (as.isCircleToolSelected) {
        annotation_type = "Circular";
      } else if (as.isArrowToolSelected) {
        annotation_type = "Arrow";
      }
      currentAnnotation = {
        points: [as.currentShapeStart, as.currentShapeEnd],
        color: selectedColor.value,
        annotation_type: annotation_type,
      };
      annotationLabel.value = ""; // Reset the input
      isLabelModalVisible.value = true; // Show the modal for label input
    }
  } else if (as.isSketchToolSelected) {
    as.isSketching = false;
    if (as.currentStroke.length > 0) {
      as.currentStroke.push(as.currentStroke[0]);

      // Deep clone the points array
      currentAnnotation = {
        points: as.currentStroke.map((point) => ({ x: point.x, y: point.y })),
        color: selectedColor.value,
      };
      annotationLabel.value = ""; // Reset the input
      isLabelModalVisible.value = true; // Show the modal for label input
    }
  } else if (as.isPanToolSelected) {
    as.isPanning = false;
  }
}

async function confirmLabel() {
  if (!currentAnnotation) return;

  currentAnnotation.label = annotationLabel.value || "Unnamed";
  currentAnnotation.color = selectedColor.value;
  as.annotations.push(currentAnnotation);

  await backend.annotations.createMediaAnnotation(
    currentMedia.value.id,
    currentAnnotation.annotation_type || "Free",
    currentAnnotation.points,
    currentAnnotation.label,
    currentAnnotation.color
  );

  as.currentStroke = [];
  as.currentShapeStart = null;
  as.currentShapeEnd = null;
  await loadAnnotations();
  clear();
  draw();

  // Hide the modal
  isLabelModalVisible.value = false;
  currentAnnotation = null;
}

function cancelLabel() {
  isLabelModalVisible.value = false;
  currentAnnotation = null;
  as.currentStroke = [];
  clear();
  draw();
}

function onMouseMove(e) {
  if (as.isDrawingShape) {
    let [x, y] = getRelativeXYfromEvent(e);
    [x, y] = getAbsoluteXY(x, y);
    as.currentShapeEnd = { x, y };
    clear();
    draw();
  } else if (as.isSketching) {
    let [x, y] = getRelativeXYfromEvent(e);
    [x, y] = getAbsoluteXY(x, y);
    as.currentStroke.push({ x, y });
    clear();
    draw();
  } else if (as.isPanning) {
    let [x, y] = getRelativeXYfromEvent(e);
    handlePan(x, y);
  }
}

function inverseTransform(ts) {
  let M = ts.a * ts.d - ts.b * ts.c;
  let a = ts.d / M;
  let b = ts.b / M;
  let c = -ts.c / M;
  let d = ts.a / M;
  let e = (ts.c * ts.f - ts.d * ts.e) / M;
  let f = (ts.b * ts.e - ts.a * ts.f) / M;
  let it = DOMMatrix.fromMatrix({
    a: a,
    b: b,
    c: c,
    d: d,
    e: e,
    f: f,
  });
  return it;
}

function autoAdjust() {
  var toBeAdjusted = false;
  var verified = false;
  var ts = as.canvas.getTransform();
  for (let i = 0; i < 100; i++) {
    if (!verified) {
      let it = inverseTransform(ts);
      let p0 = applyToPoint(it, [0, 0]);
      let p1 = applyToPoint(it, [as.width, as.height]);
      verified = true;
      if (p0[0] < -1 / as.minScale) {
        ts.e -= 1;
        verified = false;
      }
      if (p0[1] < -1 / as.minScale) {
        ts.f -= 1;
        verified = false;
      }
      if (p1[0] - as.width > 1 / as.minScale) {
        ts.e += 1;
        verified = false;
      }
      if (p1[1] - as.height > 1 / as.minScale) {
        ts.f += 1;
        verified = false;
      }
      if (!verified) {
        toBeAdjusted = true;
      }
    } else {
      break;
    }
  }
  if (toBeAdjusted) {
    as.canvas.setTransform(ts);
    as.currentOffsetX = -ts.e / ts.a;
    as.currentOffsetY = -ts.f / ts.d;
  }
}

function handlePan(x, y) {
  let relx = x / as.canvas.canvas.width;
  let rely = y / as.canvas.canvas.height;
  if (relx < 0.04 || relx > 0.96 || rely < 0.04 || rely > 0.96) {
    as.isPanning = false;
    return;
  }

  let diffx = (x - as.currentMouseX) / as.currentScale;
  let diffy = (y - as.currentMouseY) / as.currentScale;
  as.canvas.translate(diffx, diffy);
  [as.currentMouseX, as.currentMouseY] = [x, y];
  let ts = as.canvas.getTransform();
  as.currentOffsetX = -ts.e / ts.a;
  as.currentOffsetY = -ts.f / ts.d;
  autoAdjust();
  clear();
  draw();
}

function getDistance(touches) {
  const [touch1, touch2] = touches;
  return Math.sqrt(
    Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
  );
}

function selectAnnotation(x, y) {
  let notfound = true;
  for (const annotation of as.annotations) {
    if (isPointInAnnotation({ x, y }, annotation)) {
      const index = as.selectedAnnotations.indexOf(annotation);
      if (index === -1) {
        as.selectedAnnotations.push(annotation);
      } else {
        as.selectedAnnotations.splice(index, 1);
      }
      notfound = false;
      break;
    }
  }
  if (notfound) {
    as.selectedAnnotations = [];
  }
  clear();
  draw();
}

function isPointInAnnotation(point, annotation) {
  if (
    annotation.annotation_type.toLowerCase() === "free" ||
    !annotation.annotation_type
  ) {
    return isPointInStroke(point, annotation.points);
  } else if (annotation.annotation_type.toLowerCase() === "square") {
    return isPointInRectangle(point, annotation.points);
  } else if (annotation.annotation_type.toLowerCase() === "circular") {
    return isPointInCircle(point, annotation.points);
  } else if (annotation.annotation_type.toLowerCase() === "arrow") {
    return isPointNearLine(point, annotation.points, 5); // 5 pixels threshold
  } else {
    return false;
  }
}

function isPointInRectangle(point, points) {
  let [p1, p2] = points;
  let minX = Math.min(p1.x, p2.x);
  let maxX = Math.max(p1.x, p2.x);
  let minY = Math.min(p1.y, p2.y);
  let maxY = Math.max(p1.y, p2.y);
  return (
    point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
  );
}

function isPointInCircle(point, points) {
  let [p1, p2] = points;
  let centerX = p2.x;
  let centerY = p2.y;
  let radius = Math.hypot(p1.x - p2.x, p1.y - p2.y);
  let dx = point.x - centerX;
  let dy = point.y - centerY;
  return dx * dx + dy * dy <= radius * radius;
}

function isPointNearLine(point, points, threshold) {
  let [p1, p2] = points;
  let distance = distanceFromPointToLine(point, p1, p2);
  return distance <= threshold;
}

function distanceFromPointToLine(point, lineStart, lineEnd) {
  let A = point.x - lineStart.x;
  let B = point.y - lineStart.y;
  let C = lineEnd.x - lineStart.x;
  let D = lineEnd.y - lineStart.y;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;
  if (len_sq != 0) param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  let dx = point.x - xx;
  let dy = point.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

async function deleteAnnotations() {
  if (as.selectedAnnotations.length > 0) {
    // Remove annotations from both backend and local state
    for (const annotation of as.selectedAnnotations) {
      await backend.annotations.deleteAnnotation(annotation.id);
      const index = as.annotations.findIndex((a) => a.id === annotation.id);
      if (index !== -1) {
        as.annotations.splice(index, 1); // Remove from the local annotations array
      }
    }
  }
  as.currentStroke = [];
  as.selectedAnnotations = [];
  clear();
  draw(); // Redraw with the updated annotations
}

function isPointInStroke(point, stroke) {
  // A simple polygon hit-test algorithm (ray-casting method)
  let inside = false;
  for (let i = 0, j = stroke.length - 1; i < stroke.length; j = i++) {
    const xi = stroke[i].x,
      yi = stroke[i].y;
    const xj = stroke[j].x,
      yj = stroke[j].y;
    const intersect =
      yi > point.y != yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function onTouchStart(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    let [x, y] = getRelativeXYfromEvent(e, true);
    [x, y] = getAbsoluteXY(x, y);

    if (as.isCommentToolSelected) {
      if (selectComment(x, y)) return;
      openCommentModal(x, y);
    } else if (as.isSketchToolSelected) {
      as.currentStroke = [{ x, y }];
      as.isPanning = false;
      as.isSketching = true;
    } else if (as.isPanToolSelected) {
      [as.currentMouseX, as.currentMouseY] = getRelativeXYfromEvent(e, true);
      as.isPanning = true;
      as.isSketching = false;
    } else if (as.isSelectToolSelected) {
      selectAnnotationOrComment(x, y);
    } else if (
      as.isRectangleToolSelected ||
      as.isCircleToolSelected ||
      as.isArrowToolSelected
    ) {
      as.currentShapeStart = { x, y };
      as.isDrawingShape = true;
    }
  } else if (e.touches.length === 2) {
    as.initTouchDist = getDistance(e.touches);
    as.initTouchScale = as.currentScale;
  }
}

function onTouchMove(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    let [x, y] = getRelativeXYfromEvent(e, true);

    if (as.isDrawingShape) {
      [x, y] = getAbsoluteXY(x, y);
      as.currentShapeEnd = { x, y };
      clear();
      draw();
    } else if (as.isSketching) {
      [x, y] = getAbsoluteXY(x, y);
      as.currentStroke.push({ x, y });
      clear();
      draw();
    } else if (as.isPanning) {
      handlePan(x, y);
    }
  } else if (e.touches.length === 2) {
    const newDistance = getDistance(e.touches);
    if (as.initTouchDist !== null && as.initTouchDist !== 0) {
      // Compute the scale factor based on the ratio of distances
      let scaleFactor = newDistance / as.initTouchDist;
      let scale = as.initTouchScale * scaleFactor;

      // Get the midpoint between the two touch points
      let [x0, y0] = getRelativeXYfromEvent(e, true, 0);
      let [x1, y1] = getRelativeXYfromEvent(e, true, 1);
      let [x, y] = [(x0 + x1) / 2, (y0 + y1) / 2];

      // Apply the new scale
      setScale(x, y, scale);
      as.currentScale = scale; // Update the current scale
    }
  }
}

async function onTouchEnd(e) {
  if (as.isDrawingShape) {
    as.isDrawingShape = false;
    if (as.currentShapeStart && as.currentShapeEnd) {
      let annotation_type = "";
      if (as.isRectangleToolSelected) {
        annotation_type = "Square";
      } else if (as.isCircleToolSelected) {
        annotation_type = "Circular";
      } else if (as.isArrowToolSelected) {
        annotation_type = "Arrow";
      }
      currentAnnotation = {
        points: [as.currentShapeStart, as.currentShapeEnd],
        color: selectedColor.value,
        annotation_type: annotation_type,
      };
      annotationLabel.value = ""; // Reset the input
      isLabelModalVisible.value = true; // Show the modal for label input
    }
  } else if (as.isSketchToolSelected) {
    as.isSketching = false;
    if (as.currentStroke.length > 0) {
      as.currentStroke.push(as.currentStroke[0]);

      currentAnnotation = {
        points: as.currentStroke.map((point) => ({ x: point.x, y: point.y })),
        color: selectedColor.value,
      };
      annotationLabel.value = ""; // Reset the input
      isLabelModalVisible.value = true; // Show the modal for label input
    }
  } else if (as.isPanToolSelected) {
    as.isPanning = false;
  }
  as.initTouchDist = null;
}

defineExpose({ load });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  @apply rounded-full overflow-hidden w-3 h-3;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  @apply bg-grey-800 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-primary rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-primary;
}

.canvas-container {
  @apply w-full h-auto max-w-full md:pr-4;
}

canvas {
  @apply md:rounded-2xl block md:w-full min-w-full md:h-auto h-full cursor-grab;
}

canvas:active {
  cursor: grabbing; /* Hand grabbing on active */
}

button.active {
  background-color: #4f46e5;
  color: white;
}
</style>
