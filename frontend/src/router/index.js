/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import Main from "../views/Main.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "Register" */ "../views/Register.vue"),
  },
  {
    path: "/roomlist",
    name: "RoomList",
    component: () =>
      import(/* webpackChunkName: "Rooms" */ "../views/Rooms.vue"),
  },
  {
    path: "/chatroom/:id",
    name: "ChatRoom",
    component: () =>
      import(/* webpackChunkName: "ChatRoom" */ "../views/ChatRoom.vue"),
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
