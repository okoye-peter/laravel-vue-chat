<template>
  <div class="shadow-2xl h-screen bg-gray-800 p-4">
    <div class="flex flex-col justify-center content-center h-full" v-show="Object.keys(user).length != 0">
      <img
        :src="user.image"
        class="rounded-full self-center mb-4 active_user_img"
      />
      <p class="text-lg font-semibold text-center mb-4 text-white">
        {{ this.user.name }}
      </p>
      <p class="text-md text-center mb-4 text-white">{{ this.user.email }}</p>
      <p class="text-center mb-4">
        <span class="text-white mr-4">Status:</span>
        <span
          class="
            px-2
            inline-flex
            text-xs
            leading-5
            font-semibold
            rounded-full
          "
          :class="[
            user.online == 1
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-200 text-yellow-900',
          ]"
        >
          {{ user.online == 1 ? 'Online' : 'Offline' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UserDetailsComponent",
  data(){
    return {
      user: {},
    };
  },
  mounted() {
      this.emitter.on("selectUser", id => {
        this.user = this.getActiveUser(id);
      });

  },
  computed: {
    ...mapGetters({
      getActiveUser: "users/fetchAUserDetails"
    })
  },
};
</script>

<style>
p,li{
    font-family: 'Red Hat Mono', sans-serif;
}
.active_user_img {
  height: 13em;
  width: 13em;
}
</style>
