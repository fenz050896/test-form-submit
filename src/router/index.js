import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/form",
  },
  {
    path: "/form",
    name: "SubmissionForm",
    component: () =>
      import(/* webpackChunkName: "SubmissionForm" */ "@/views/Form.vue"),
    props: (route) => ({ userId: route.query.userId }),
  },
  {
    path: "*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "@/views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
