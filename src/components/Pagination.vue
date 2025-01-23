<template>
  <div class="flex items-center justify-center md:justify-start mt-4 gap-4">
    <!-- Loop through the visible page numbers -->
    <button
      @click="updatePage(currentPage - 1)"
      class="h-10 w-10 flex items-center justify-center rounded-lg border md:border-0 border-grey-200 bg-white disabled:opacity-60"
      :disabled="currentPage === 1"
    >
      <ArrowIcon />
    </button>
    <div class="flex">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="updatePage(page)"
        :class="[
          'h-10 w-10 flex items-center justify-center rounded-lg transition-all text-sm',
          page === currentPage
            ? 'bg-primary text-white'
            : 'text-secondary hover:text-primary',
        ]"
      >
        {{ page }}
      </button>
    </div>
    <button
      @click="updatePage(currentPage + 1)"
      class="h-10 w-10 flex items-center justify-center rounded-lg border md:border-0 border-grey-200 bg-white disabled:opacity-60"
      :disabled="currentPage === totalPages"
    >
      <ArrowIcon className="rotate-180" />
    </button>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue";
import ArrowIcon from "./icons/ArrowIcon.vue";

// Props to accept total items, current page, and items per page from parent component
const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  maxPagesToShow: {
    type: Number,
    default: 5, // Default value, can be overridden by the parent
  },
});

const emits = defineEmits(["update:currentPage"]);

// Compute the total number of pages
const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
);

// Compute the visible pages based on current page and total pages
const visiblePages = computed(() => {
  const pages = [];
  let startPage = Math.max(
    1,
    props.currentPage - Math.floor(props.maxPagesToShow / 2)
  );
  let endPage = Math.min(
    totalPages.value,
    startPage + props.maxPagesToShow - 1
  );

  if (endPage - startPage < props.maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - props.maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Emit the currentPage change when a new page is clicked
const updatePage = (page) => {
  emits("update:currentPage", page);
};
</script>
