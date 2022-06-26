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
    // Echo.join(`chat-room.${this.getAuthenticatedUser.id}`)
    // .here(users => {
    //     console.log('here',users);
    //   })
    //   .joining(user => {
    //       // if(this.users.length <=1){
    //       //     this.users.push(user);
    //       // }
    //       console.log('joining',user);
    //   })
    //   .leaving(user => {
    //       // this.users = this.users.filter(u=>{
    //       //     u.id !=user.id &&  u.isadmin == 1
    //       // });
    //       // this.chats.push(message);
    //     console.log('leaving',user); 
    //   })
    //   .listen('NewMessageEvent', (data)=>{
    //       let user = this.getAuthenticatedUser;
    //       // new message handling
    //       if(parseInt(data.chat.receiver_id) === parseInt(user.id)){
    //         this.saveNewMessage(data.chat);
    //         if(parseInt(this.friendId) === parseInt(data.chat.receiver_id)){
    //           this.markAsRead(this.friendId);
    //         }else{
    //           this.emitter.emit('newMessage',data.chat);
    //         }
    //   }
    //       // this.handleIncomingMessages(event.message);
    //       console.log('NewMessageEvent',event);
    //   })
    //   .listenForWhisper('typing', response =>{ 
    //       // this.typing = true;
    //       // if (this.typingTimer) {
    //       //     clearTimeout(this.typingTimer);
    //       // }
    //       // this.typingTimer = setTimeout(()=>{
    //       //     this.typing = false
    //       // }, 3000)
    //       console.log('typing',response);
    //   });
    // let pusher = new Pusher("4e16f19d699085173311", {
    //   cluster: "eu",
    //   encrypted: true,
    // });
    // // pusher channels
    // this.chatChannel = pusher.subscribe("chat-room");
    // this.registrationChannel = pusher.subscribe("register");
    // this.loginChannel = pusher.subscribe("login");

    // this.chatChannel.bind("App\\Events\\MessageEvent", (data) => {
      // let user = this.getAuthenticatedUser;
      // // new message handling
      // if(parseInt(data.chat.receiver_id) === parseInt(user.id)){
      //   this.saveNewMessage(data.chat);
      //   if(parseInt(this.friendId) === parseInt(data.chat.receiver_id)){
      //     this.markAsRead(this.friendId);
      //   }else{
      //     this.emitter.emit('newMessage',data.chat);
      //   }
      // }
    // });
    // // handling new user registration
    // this.registrationChannel.bind("App\\Events\\RegistrationEvent", (data) => {
    //   this.addUser(data.user);
    // });
    // // handling another user login broadcast
    // this.loginChannel.bind("App\\Events\\LoginEvent", (data) => {
      // if(this.getAuthenticatedUser.id != data.user.id){
      //   this.addUser(data.user);
      // }
    // });
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
    setTimeout(()=> {
      
    },3500);
    Echo.channel('login').listen('LoginEvent', (data) => {
      if(this.getAuthenticatedUser.id != data.user.id){
        this.updateUser(data.user);
      }
    });
    Echo.channel('register').listen('NewRegistrationEvent', (data) => {
      this.addUser(data.user);
    });
  },
  watch:{
    getAuthenticatedUser(newVal){
      if(Object.keys(newVal).length > 0){
        Echo.join(`chat.room.${this.getAuthenticatedUser.id}`)
        .listen('NewMessageEvent', (data)=>{
            let user = this.getAuthenticatedUser;
            // new message handling
            if(parseInt(data.chat.receiver_id) === parseInt(user.id)){
              this.saveNewMessage(data.chat);
              if(parseInt(this.friendId) === parseInt(data.chat.user_id)){
                this.markAsRead(this.friendId);
              }else{
                this.emitter.emit('newMessage',data.chat);
              }
            }
            // this.handleIncomingMessages(event.message);
        })
        .listenForWhisper('typing', response =>{ 
            // this.typing = true;
            // if (this.typingTimer) {
            //     clearTimeout(this.typingTimer);
            // }
            // this.typingTimer = setTimeout(()=>{
            //     this.typing = false
            // }, 3000)
            console.log('typing',response);
        });
      }
    }
  }
};
</script>

<style></style>
