<template>
  <div class="flex justify-center align-items-center h-screen flex-col bg-blue-50">
    <h1 class="text-center text-4xl text-blue-400 font-normal">Register</h1>
    <div class="shadow-lg bg-white px-6 pt-14 pb-4 mx-auto mt-6 w-1/3 rounded">
      <form action="" name="registrationForm" @submit.prevent="Register">
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="name">Name:</label>
          <input type="text" name="name" id="name" class="
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
            " placeholder="e.g. santa cruiz" />
          <i class="fas fa-user"></i>
          <small v-show="validationErrors != null" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{
              validationErrors && validationErrors.name
                ? validationErrors.name[0]
                : ""
          }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="email">Email:</label>
          <input type="email" name="email" id="email" class="
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
            " placeholder="e.g. example@gmail.com" />
          <i class="fas fa-envelope"></i>
          <small v-show="validationErrors != null" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{
              validationErrors && validationErrors.email
                ? validationErrors.email[0]
                : ""
          }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="username">Username:</label>
          <input type="text" name="username" id="username" class="
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
            " placeholder="e.g. santa_cruz" />
          <i class="fas fa-sign-in-alt"></i>
          <small v-show="validationErrors != null" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{
              validationErrors && validationErrors.username
                ? validationErrors.username[0]
                : ""
          }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="image">Picture:</label>
          <input type="file" name="image" id="image" class="
              shadow-sm border border-gray-200 ml-3 rounded p-1 col-span-3 focus:outline-none focus:border-indigo-200 focus:border-transparent text-sm text-gray-500 file:mr-4 file:px-2 file:rounded-full file:border-0 file:text-sm file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100
            " />
          <small v-show="validationErrors != null" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{
              validationErrors && validationErrors.image
                ? validationErrors.image[0]
                : ""
          }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="password">Password:</label>
          <input type="password" name="password" id="password" class="
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
            " placeholder="password" />
          <i class="fas fa-lock"></i>
          <small v-show="validationErrors != null" class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{
              validationErrors && validationErrors.password
                ? validationErrors.password[0]
                : ""
          }}</small>
        </div>
        <p class="ml-24 text-sm">
          Already have an account ?
          <router-link :to="{name: 'Login'}" class="ml-8 underline text-blue-400">Sign In</router-link>
        </p>
        <div class="flex md:justify-center">
          <button class="
              bg-blue-600
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600
              focus:ring-opacity-50
              py-2
              px-8
              mt-3
              rounded-lg
              text-white text-sm
              w-36
            ">
            <span v-show="!loading">Register</span>
            <img src="/assets/images/loading.gif" v-show="loading" class="loading h-6 inline-block" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      validationErrors: null,
      loading: false,
    };
  },
  methods: {
    Register() {
      this.loading = true;
      this.validationErrors = null;
      const form = document.registrationForm;
      const data = new FormData(form);
      this.axios
        .post("/api/register", data)
        .then(res => {
          this.$swal({
            title: "Congratulations!",
            text: res.data.message,
            icon: "success",
            button: "Thanks!",
          }).then(() => {
            this.$router.push({ name: "Login" });
          });
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.validationErrors = error.response.data.error;
          }else{
            this.$swal({
              title: "Error!",
              text: 'sorry something went wrong',
              icon: "error",
              button: "Thanks!",
            });
          }
        }).finally(() => {
          this.loading = false;
        });
    },
  },
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
