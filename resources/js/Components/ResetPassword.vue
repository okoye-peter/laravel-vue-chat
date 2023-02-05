<template >
    <div class="flex justify-center align-items-center h-screen flex-col bg-blue-50">
    <h1 class="text-center text-4xl text-blue-400 font-normal">Reset Password</h1>
    <div class="shadow-lg bg-white px-6 pt-14 pb-4 mx-auto mt-6 w-1/3 rounded">
      <form action="" name="resetPasswordForm" @submit.prevent="sendPasswordResetLink">
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="email">Email:</label>
          <input type="email" name="email" v-model="email" id="email" class="
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
            " placeholder="e.g. example@gmail.com" readonly />
          <i class="fas fa-envelope"></i>
          <small v-show="errors != null && errors.email"
            class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{ errors &&
                errors.email ? errors.email.join(', ') : ''
            }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="email">Password:</label>
          <input type="password" name="password" id="password" class="
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
            " placeholder="enter new password" />
          <i class="fa-solid fa-lock"></i>
          <small v-show="errors != null && errors.email"
            class="col-start-2 col-end-5 text-left pl-4 text-xs text-red-500">{{ errors &&
                errors.password ? errors.password.join(', ') : ''
            }}</small>
        </div>
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <label class="text-left" for="email">Re-type Password:</label>
          <input type="password" name="password_confirmation" id="password_confirmation" class="
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
            " placeholder="re-type password"/>
          <i class="fa-solid fa-lock"></i>
        </div>
        <input type="hidden" name="token" v-model="token" />
        <div class="mb-4 grid grid-cols-4 justify-around relative">
          <p class="col-start-4 text-sm ml-3 col-span-3">
            <router-link :to="{ name: 'Login' }" class="ml-8 underline text-blue-400">Sign In</router-link>
          </p>
        </div>
        <div class="flex justify-center" >
          <button :disabled="loading" class="
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
            ">
            <span v-show="!loading">Reset Password</span>
            <img src="/assets/images/loading.gif" v-show="loading" class="loading h-6 inline-block" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return {
            loading: false,
            errors: null,
            email: "",
            token: '',
        }
    },
    methods:{
      sendPasswordResetLink(){
        this.loading = true;
        let form = document.resetPasswordForm;
        let formData = new FormData(form);
        axios.post(process.env.MIX_API_URL +'reset-password', formData)
          .then(response => {
            this.$swal({
                title: "success",
                text: "Password Reset Successfully",
                icon: "success",
                button: "ok",
            }).then(() => {
              this.$router.push({ name: "Login" });
            });

          }).catch(error => {
            if(error.response.status == 422){
              // .log('error', error.data)
              this.errors = error.response.data.error
            }
            console.log('error',error.response)
          }).finally(() => {
            this.loading = false
          })
      }
    },
    mounted(){
        this.email = this.$route.query.email;
        this.token = this.$route.params.token;
    }
}
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

i.fas,
i.fa-solid {
  position: relative;
  display: inline-block;
  top: -23px;
  left: 1.25em;
  grid-column-start: 2;
}

@media screen and (max-width: 1204px) {
  div.grid.grid-cols-4 {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }

  div.grid.grid-cols-4 input {
    margin-left: 0;
  }

  i.fas,
  i.fa-solid {
    grid-column-start: 1;
    left: 0.5em;
  }

  p.ml-24.text-sm {
    margin-left: 0;
    flex-wrap: wrap;
  }
}
</style>
