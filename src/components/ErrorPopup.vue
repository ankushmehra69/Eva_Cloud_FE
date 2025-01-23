<template>
  <div
    v-if="uiStore.errorMessage"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-6 rounded-lg max-w-md w-full"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Error</h3>
      </div>
      <div class="mb-4">
        <span class="block sm:inline">{{ uiStore.errorMessage }}</span>
      </div>
      <div class="flex justify-end">
        <button
          @click="uiStore.clearError"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
</script>
