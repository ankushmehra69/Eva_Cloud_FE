<template>
  <svg
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      d="M10.0714 18.6429L1.5 10.0714L10.0714 1.5M2.69048 10.0714H20.0714"
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
