import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    isLoading: false,
    errorMessage: "",
    requestCount: 0, // New counter for tracking ongoing requests
  }),
  actions: {
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    setError(message) {
      this.errorMessage = message;
    },
    clearError() {
      this.errorMessage = "";
    },
    incrementRequestCount() {
      this.requestCount += 1;
      this.isLoading = true; // Show loading when any request is in progress
    },
    decrementRequestCount() {
      if (this.requestCount > 0) {
        this.requestCount -= 1;
      }
      if (this.requestCount === 0) {
        this.isLoading = false; // Hide loading when all requests are done
      }
    },
  },
});
