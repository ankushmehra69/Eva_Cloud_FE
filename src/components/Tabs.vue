<template>
  <div class="flex mb-4 -mx-4 md:-mx-0">
    <div
      class="flex items-center gap-px md:bg-grey-800 md:rounded-xl md:p-1 w-full md:w-auto"
    >
      <button
        v-for="tab in tabs"
        :key="tab.label"
        class="text-sm font-normal md:rounded-lg px-4 py-2 md:w-28 w-full border-b-2 md:border-0 border-transparent"
        :class="
          tab.active
            ? 'bg-tab-gradient md:bg-gradient-transparent md:bg-white md:text-secondary text-primary md:shadow-6xl !border-primary'
            : '!text-grey-100'
        "
        @click="tab.action"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
});
</script>
