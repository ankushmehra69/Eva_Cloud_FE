<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      d="M10.0003 3.99996L12.0003 5.99996M8.66699 13.3333H14.0003M3.33366 10.6666L2.66699 13.3333L5.33366 12.6666L13.0577 4.94263C13.3076 4.69259 13.448 4.35351 13.448 3.99996C13.448 3.64641 13.3076 3.30733 13.0577 3.05729L12.943 2.94263C12.693 2.69267 12.3539 2.55225 12.0003 2.55225C11.6468 2.55225 11.3077 2.69267 11.0577 2.94263L3.33366 10.6666Z"
      stroke="currentColor"
      stroke-width="1.01248"
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
