import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import io from "socket.io-client";
import router from "./router";
const socket = io("/");

Vue.prototype.$socket = socket;

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
