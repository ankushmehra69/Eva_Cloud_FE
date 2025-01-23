<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <transition name="fade" mode="out-in">
      <div v-if="showSplash" key="splash" class="relative">
        <div class="flex flex-wrap justify-center items-center">
          <span
            v-for="(letter, index) in letters"
            :key="index"
            :class="letter.class"
            class="text-4xl font-bold text-primary"
            :style="{ animationDelay: `calc(0.1s * ${letter.delay})` }"
          >
            {{ letter.char }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showSplash = ref(true);

const letters = [
  { char: "C", class: "animate-fly-in-from-left", delay: 0 },
  { char: "A", class: "animate-fly-in-from-top", delay: 1 },
  { char: "M", class: "animate-fly-in-from-right", delay: 2 },
  { char: "B", class: "animate-fly-in-from-bottom", delay: 3 },
  { char: "R", class: "animate-fly-in-from-left", delay: 4 },
  { char: "I", class: "animate-fly-in-from-top", delay: 5 },
  { char: "A", class: "animate-fly-in-from-right", delay: 6 },
  { char: "N", class: "animate-fly-in-from-bottom", delay: 7 },
  { char: "\u00A0", class: "", delay: 8 }, // Non-breaking space
  { char: "B", class: "animate-fly-in-from-left", delay: 9 },
  { char: "I", class: "animate-fly-in-from-top", delay: 10 },
  { char: "O", class: "animate-fly-in-from-right", delay: 11 },
  { char: "W", class: "animate-fly-in-from-bottom", delay: 12 },
  { char: "O", class: "animate-fly-in-from-left", delay: 13 },
  { char: "R", class: "animate-fly-in-from-top", delay: 14 },
  { char: "K", class: "animate-fly-in-from-right", delay: 15 },
  { char: "S", class: "animate-fly-in-from-bottom", delay: 16 },
];

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false;
    router.push({ name: "home" });
  }, 3000); // duration of the animation
});
</script>

<style>
@keyframes fly-in-from-left {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fly-in-from-top {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fly-in-from-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fly-in-from-bottom {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fly-in-from-left {
  animation: fly-in-from-left 0.8s forwards;
}

.animate-fly-in-from-top {
  animation: fly-in-from-top 0.8s forwards;
}

.animate-fly-in-from-right {
  animation: fly-in-from-right 0.8s forwards;
}

.animate-fly-in-from-bottom {
  animation: fly-in-from-bottom 0.8s forwards;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
