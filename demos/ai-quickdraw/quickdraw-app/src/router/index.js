import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/doodle",
  },
  {
    path: "/doodle",
    name: "doodle",
    component: () =>
      import(/* webpackChunkName: "doodle" */ "@/views/DoodleView.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
