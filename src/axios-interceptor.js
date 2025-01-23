import axios from "axios";
import { useUIStore } from "@/stores/ui";

export default function setupInterceptors(pinia) {
  const uiStore = useUIStore(pinia);

  axios.defaults.timeout = 60000;

  axios.interceptors.request.use(
    (config) => {
      uiStore.incrementRequestCount(); // Increment request count
      return config;
    },
    (error) => {
      uiStore.decrementRequestCount(); // Decrement on error
      uiStore.setError("An error occurred while sending the request.");
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      uiStore.decrementRequestCount(); // Decrement when the response is received
      return response;
    },
    (error) => {
      uiStore.decrementRequestCount(); // Decrement on response error
      if (error.response) {
        uiStore.setError(
          `Error:\n${error.response?.data?.message}\n${error.response.statusText}`
        );
      } else if (error.request) {
        uiStore.setError("No response received from the server.");
      } else {
        uiStore.setError("Request error.");
      }
      return Promise.reject(error);
    }
  );
}
