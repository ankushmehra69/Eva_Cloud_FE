<template>
  <svg
    width="41"
    height="22"
    viewBox="0 0 41 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      d="M30.1905 2L39 11L30.1905 20M37.7765 11L2 11"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
});
</script>
