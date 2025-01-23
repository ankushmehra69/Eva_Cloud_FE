<template>
  <div
    class="fixed inset-0 z-30 md:pl-44 p-4 flex items-center justify-center bg-grey-700/50 backdrop-blur-[2px]"
  >
    <div class="bg-white md:p-6 p-4 rounded-2xl w-full max-w-lg">
      <h2
        class="text-center md:text-2xl text-xl text-secondary font-sans md:font-normal font-medium mb-6 px-4"
      >
        {{
          title ? title : `Are you sure you want to remove ${type} "${name}"?`
        }}
      </h2>
      <div class="flex justify-center gap-2">
        <button
          type="button"
          @click="$emit('close')"
          class="btn btn-sm btn-outline !rounded-xl"
        >
          Cancel
        </button>
        <button
          @click="$emit('remove')"
          class="btn btn-sm btn-danger !rounded-xl"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close", "remove"]);
</script>
