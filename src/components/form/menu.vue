<template>
  <div class="relative" :class="className">
    <div
      @contextmenu.prevent="isDoubleClick && (showMenu = !showMenu)"
      @click="!isDoubleClick && (showMenu = !showMenu)"
    >
      <slot></slot>
    </div>
    <div
      class="fixed inset-0 z-[15] bg-transparent"
      @click="showMenu = !showMenu"
      v-if="showMenu"
    ></div>
    <div
      v-if="showMenu"
      :class="menuClassName"
      class="absolute top-0 right-0 z-[40] text-left bg-white rounded-lg shadow-lg py-2"
    >
      <ul class="">
        <li
          class="px-4 py-1 text-sm hover:bg-gray-100 cursor-pointer"
          v-for="option in options"
          @click="option.action"
          :key="option.label"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const showMenu = ref(false);
console.log("showMenu", showMenu.value);
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
  menuClassName: {
    type: String,
    default: "w-32",
  },
  isDoubleClick: {
    type: Boolean,
    default: true,
  },
});
</script>
