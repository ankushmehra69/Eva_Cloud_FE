<template>
  <div :class="className" class="relative border border-red-500">
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 44C2 20.804 20.804 2 44 2C67.196 2 86 20.804 86 44C86 67.196 67.196 86 44 86H10C5.58172 86 2 82.4183 2 78V44Z"
        fill="#2F2F31"
      />
      <path
        d="M2 44C2 20.804 20.804 2 44 2C67.196 2 86 20.804 86 44C86 67.196 67.196 86 44 86H10C5.58172 86 2 82.4183 2 78V44Z"
        stroke="#006BBF"
        stroke-width="4"
      />
      <rect x="12" y="12" width="64" height="64" rx="32" fill="#2F2F31" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: "",
  },
});
</script>
