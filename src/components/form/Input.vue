<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="id"
      class="text-secondary"
      :class="
        size === 'sm'
          ? 'text-sm md:text-base font-medium'
          : 'md:text-lg text-base font-normal'
      "
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        v-model="internalValue"
        :id="id"
        :type="type === 'password' && isPasswordVisible ? 'text' : type"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        class="w-full px-3 border md:text-base text-sm placeholder:text-grey-100 text-secondary font-light rounded-lg focus:outline-none focus:shadow-sm"
        :class="[
          error
            ? 'border-red-500 shadow-sm shadow-red-500/40'
            : 'border-grey-200 focus:border-primary focus:shadow-primary/40',
          disabled ? 'cursor-not-allowed' : '',
          size === 'sm' ? 'py-2' : 'py-3',
        ]"
      />
      <div
        v-if="type === 'password'"
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
        @click="togglePasswordVisibility"
      >
        <svg
          v-if="isPasswordVisible"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5C7.5 5 3.8 8.3 2 12C3.8 15.7 7.5 19 12 19C16.5 19 20.2 15.7 22 12C20.2 8.3 16.5 5 12 5Z"
            stroke="#111015"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="#111015"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          v-else
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 9C18.6 11.667 15.6 13 12 13C8.4 13 5.4 11.667 3 9M3 15L5.5 11.2M21 14.976L18.508 11.2M9 17L9.5 13M15 17L14.5 13"
            stroke="#111015"
            stroke-width="2.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <slot />
    </div>
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "md",
  },
  modelValue: String, // enables v-model
});

const emit = defineEmits(["update:modelValue"]);

const isPasswordVisible = ref(false);
const internalValue = ref(props.modelValue);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Sync internal value with v-model
watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

// Emit changes to parent
watch(internalValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>
