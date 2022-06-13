import { createRouter, createWebHistory } from "vue-router";
import Register from "../Components/RegistrationComponent.vue";
import Login from "../Components/LoginComponent.vue";
import Chats from "../Components/ChatsComponent.vue";

const routes = [
  {
    path: "/",
    name: "Register",
    component: Register,
    meta: {
      requireAuthentication: false
    }
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
    meta: {
      requireAuthentication: false
    }
  },
  {
    path: "/Chats",
    name: "Chats",
    component: Chats,
    meta: {
      requireAuthentication: true
    }
  },
  {
    path: "/:pathMatch(.*)*",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next)=>{
  const requireAuthentication = to.matched.some(
    (record) => record.meta.requireAuthentication
  );
  const isAuthenticated = window.localStorage.token;

  if(!requireAuthentication && isAuthenticated){
    next('/Chats')
  }else if(requireAuthentication && !isAuthenticated){
    next('/Login')
  }else{
    next()
  }

})

export default router;
