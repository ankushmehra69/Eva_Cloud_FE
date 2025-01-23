<template>
  <svg
    width="7"
    height="12"
    viewBox="0 0 7 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2.11278 6.0009L6.74287 1.46527C7.08556 1.12914 7.08556 0.587019 6.74287 0.250891C6.57958 0.0903187 6.35685 9.53674e-07 6.12454 9.53674e-07C5.89223 9.53674e-07 5.6695 0.0903187 5.50621 0.250891L0.257784 5.39281C-0.086 5.72857 -0.086 6.27143 0.257784 6.60719L5.50599 11.7491C5.6695 11.9097 5.89223 12 6.12454 12C6.35685 12 6.57958 11.9097 6.74309 11.7491C7.08556 11.4129 7.08556 10.8708 6.74265 10.5347L2.11278 6.0009Z"
      fill="currentColor"
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
