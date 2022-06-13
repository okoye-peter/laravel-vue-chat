<template>
  <div class="grid grid-cols-7">
    <div class="col-span-2">
      <ListUsers></ListUsers>
    </div>
    <div class="col-span-3">
      <Messages></Messages>
    </div>
    <div class="col-span-2">
      <Details></Details>
    </div>
  </div>
</template>

<script>
import Pusher from "pusher-js";

import ListUsers from "./UsersComponent.vue";
import Messages from "./MessagesComponent.vue";
import Details from "./UserDetailsComponent.vue";
import { mapActions,mapGetters } from "vuex";

export default {
  components: {
    ListUsers,
    Messages,
    Details,
  },
  data() {
    return {
      chatChannel: "",
      registrationChannel: "",
      loginChannel: "",
      friendId: 0,
    };
  },
  async created() {
    await this.getChats();
    let pusher = new Pusher("4e16f19d699085173311", {
      cluster: "eu",
      encrypted: true,
    });
    // pusher channels
    this.chatChannel = pusher.subscribe("chat-room");
    this.registrationChannel = pusher.subscribe("register");
    this.loginChannel = pusher.subscribe("login");

    this.chatChannel.bind("App\\Events\\MessageEvent", (data) => {
      let user = this.getAuthenticatedUser;
      // new message handling
      if(parseInt(data.chat.receiver_id) === parseInt(user.id)){
        this.saveNewMessage(data.chat);
        if(parseInt(this.friendId) === parseInt(data.chat.receiver_id)){
          this.markAsRead(this.friendId);
        }else{
          this.emitter.emit('newMessage',data.chat);
        }
      }
    });
    // handling new user registration
    this.registrationChannel.bind("App\\Events\\RegistrationEvent", (data) => {
      this.addUser(data.user);
    });
    // handling another user login broadcast
    this.loginChannel.bind("App\\Events\\LoginEvent", (data) => {
      if(this.getAuthenticatedUser.id != data.user.id){
        this.addUser(data.user);
      }
    });
  },
  methods: {
    ...mapActions({
      addUser: "users/AddNewUser",
      updateUser: "users/UpdateUserDetails",
      getChats: "chats/getChats",
      saveNewMessage: "chats/saveChat",
      markAsRead: "chats/markChatsAsRead"
    }),
  },
  computed:{
    ...mapGetters({
      getAuthenticatedUser: "users/getAuthenticatedUser",
    }),
  },
  mounted(){
    this.emitter.on('selectUser',id=>{
      this.friendId = id;
    });
  }
};
</script>

<style></style>
