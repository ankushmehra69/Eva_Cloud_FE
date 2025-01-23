import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import setupInterceptors from "./axios-interceptor";

import App from "./App.vue";
import router from "./router";

import configureAuth from "./configureAuth.js";

configureAuth();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setupInterceptors(pinia);

app.mount("#app");
