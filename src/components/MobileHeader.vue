<template>
  <div class="mb-5 flex items-center justify-between gap-4" :class="className">
    <div class="w-7 md:hidden flex-shrink-0">
      <BackIcon @click="() => router.go(-2)" />
    </div>
    <div class="text-center md:text-left">
      <h2 class="md:text-3xl text-xl md:font-bold font-medium text-secondary">
        {{ title }}
      </h2>
      <p class="text-black/50 md:text-base text-sm font-light break-all">
        {{ description }}
        <span
          v-for="(breadcrumb, index) in displayedBreadcrumbs"
          :key="index"
          class="group"
          :class="{ 'cursor-pointer hover:text-primary': breadcrumb.action }"
          @click="breadcrumb.action ? breadcrumb.action() : null"
        >
          {{ breadcrumb.label }}
          <span
            class="group-hover:text-black/50 hidden md:inline"
            v-if="index < breadcrumbs.length - 1 && breadcrumb.label"
          >
            >
          </span>
        </span>
      </p>
    </div>
    <div class="w-7 md:w-auto flex-shrink-0 flex items-center gap-2">
      <button
        v-if="btnText"
        @click="clickHandler"
        class="btn btn-secondary flex-shrink-0 text-2xl size-7 !p-0 flex items-center justify-center md:hidden"
      >
        {{ btnIcon ? btnIcon : "+" }}
      </button>
      <button
        v-if="btnText"
        @click="clickHandler"
        class="btn btn-secondary flex-shrink-0 !rounded-xl !px-6 !py-3 text-base !font-light hidden md:block"
      >
        {{ btnText }}
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import BackIcon from "@/components/icons/BackIcon.vue";
import { useRouter } from "vue-router";
import { onMounted, computed, ref } from "vue";

const router = useRouter();

const props = defineProps({
  className: {
    type: String,
    required: false,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  breadcrumbs: {
    type: Array,
    required: true,
  },
  btnText: {
    type: String,
    required: true,
  },
  clickHandler: {
    type: Function,
    required: true,
  },
  btnIcon: {
    type: String,
    required: false,
    default: "+",
  },
});

const isMobile = ref(window.innerWidth < 768);

const displayedBreadcrumbs = computed(() => {
  if (isMobile.value && props.breadcrumbs.length > 1) {
    return props.breadcrumbs.slice(-1);
  }
  return props.breadcrumbs;
});

// Add window resize listener
onMounted(() => {
  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});
</script>
