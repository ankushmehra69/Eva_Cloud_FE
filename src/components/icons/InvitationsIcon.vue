<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      d="M11.9282 18.6965H5.21989C4.71156 18.6965 4.22405 18.4945 3.8646 18.1351C3.50516 17.7756 3.30322 17.2881 3.30322 16.7798V7.19645M3.30322 7.19645C3.30322 6.68812 3.50516 6.20061 3.8646 5.84116C4.22405 5.48172 4.71156 5.27979 5.21989 5.27979H18.6366C19.1449 5.27979 19.6324 5.48172 19.9918 5.84116C20.3513 6.20061 20.5532 6.68812 20.5532 7.19645M3.30322 7.19645L11.9282 12.9465L20.5532 7.19645M20.5532 7.19645V12.4673M15.7616 18.6965H21.5116M18.6366 15.8215V21.5715"
      stroke="currentColor"
      stroke-width="1.5"
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
