<template>
  <div
    class="flex justify-center align-items-center h-screen flex-col bg-blue-50"
  >
    <h1 class="text-center text-4xl text-blue-400 font-normal">Login</h1>
    <div class="shadow-lg bg-white px-6 pt-14 pb-4 mx-auto mt-6 w-1/3 rounded">
      <form action=""  name="loginForm" @submit.prevent="authenticate">
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            class="
              shadow-sm
              border border-gray-200
              ml-3
              rounded
              pl-8
              p-1
              col-span-3
              focus:outline-none
              focus:border-indigo-200
              focus:border-transparent
              text-sm
            "
            placeholder="e.g. example@gmail.com"
          />
          <i class="fas fa-envelope"></i>
          <small v-show="errors != null && errors.email" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{ errors &&
            errors.email ? errors.email[0] : ''}}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            class="
              border border-gray-200
              ml-3
              rounded
              p-1
              pl-8
              col-span-3
              focus:outline-none
              focus:border-indigo-200
              focus:border-transparent
              text-sm
              shadow-sm
            "
            placeholder="password"
          />
          <i class="fas fa-lock"></i>
          <small v-show="errors != null && errors.password" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{ errors &&
            errors.password ? errors.password[0] : ''}}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="col-start-2 text-sm font-bold ml-3 col-span-3">
            <input type="checkbox" v-model="remember_me" class="checked:bg-blue-500"> Remember me
          </label>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <p class="col-start-2 text-sm ml-3 col-span-3">
            Don't have an account ?
            <router-link :to="{name: 'Register'}" class="ml-8 underline text-blue-400"
              >Sign Up</router-link
            >
          </p>
        </div>
        <div class="flex justify-center">
          <button
            class="
              bg-indigo-600
              hover:bg-indigo-700
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-600
              focus:ring-opacity-50
              py-2
              px-8
              mt-3
              rounded-lg
              text-white text-sm
            "
          >
            <span v-show="!loading">Login</span>
            <img src="/assets/images/loading.gif" v-show="loading" class="loading h-6 inline-block" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters,mapActions } from  'vuex';

export default {
  name: "Login",
  data(){
    return {
      errors: null,
      remember_me: false,
      loading: false
    }
  },
  computed:{
    ...mapGetters({
      validationErrors: 'users/getValidationError',
      getStatus:'users/getStatus'
    })
  },
  methods:{
    ...mapActions({
      login:'users/AuthenticateUser',
      
    }),
    async authenticate(){
      this.loading = true;
      let form = document.loginForm;
      let data = new FormData(form);
      if(this.remember_me){
        data.append('remember_me',this.remember_me);
      }
      await this.login(data);
      this.loading = false;
      if(this.getStatus == 401){
        this.$swal({
              title: "error",
              text: "Invalid Credentials",
              icon: "error",
              button: "ok",
            });
      }else if(this.getStatus == 422){
        this.errors = this.validationErrors;
      }
    }
  }
};
</script>

<style scoped>
p,
button {
  font-family: "Work Sans", sans-serif;
}

h1,
small,
label {
  font-family: "Red Hat Mono", monospace;
}

i.fas {
  position: relative;
  display: inline-block;
  top: -23px;
  left: 1.25em;
  grid-column-start: 2;
}

@media screen and (max-width: 1204px) {
  div.grid.grid-cols-4 {
    grid-template-columns: repeat(auto-fit, minmax(100%,1fr));
  }
  div.grid.grid-cols-4 input {
    margin-left: 0;
  }
  i.fas {
    grid-column-start: 1;
    left: 0.5em;
  }
  p.ml-24.text-sm {
    margin-left: 0;
    flex-wrap: wrap;
  }
}
</style>
