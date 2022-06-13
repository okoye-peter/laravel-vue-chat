<template>
    <div class="content h-screen" v-show="friendId != 0">
        <div class="messages">
            <ul v-chat-scroll="{always: false, smooth: true}">
                <li v-for="(chat,index) in getActiveUserChats(friendId)" :key="index" :class="[chat.user_id == friendId ? 'sent' : 'replies', chat.type == 1 ? 'image' :'']" >
                    <img :src="[chat.user_id == friendId ? friend.image : getAuthenticatedUser.image]" alt />
                    <p v-if="chat.type == 1">
                      <img :src="chat.message" class="chat_image"/>
                    </p>
                    <p v-else>{{ chat.message }}</p>
                </li>
            </ul>
        </div>
        <div class="message-input bg-white shadow-lg">
            <div class="wrap">                
                <input type="text" placeholder="Write your message..." v-model="message" @keydown.enter.prevent />
                <i class="fa fa-paperclip attachment" aria-hidden="true" @click="chooseImage"></i>
                <input type="file" ref="image" @change="loadImagePreview" />
                <button class="submit"   @click.prevent="sendToUser">
                    <i class="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </div>
            <div class="preview_wrapper">
                <div class="preview_container">
                    <img src="" class="preview mb-8" ref="preview">
                    <div class="flex justify-around">
                        <button class="bg-red-500 hover:bg-red-600 px-5 py-2" @click="hideImagePreview"><i class="fas fa-times"></i></button>
                        <button class="bg-green-500 hover:bg-green-600 px-5 py-2" @click="sendImage"><i class="fas fa-check"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    data(){
        return {
            message:'',
            friendId:0,
            friend: {},
            user: {}
        }
    },
    mounted(){
        setTimeout(()=>{
            this.user =  this.getAuthenticatedUser;
        },3000);

        this.emitter.on('selectUser',id=>{
            this.friendId = id;
            this.friend = this.getActiveUser(id);
            this.markAsRead(id);
        });
    },
    computed:{
        ...mapGetters({
            getActiveUserChats:'chats/getChats',
            getAuthenticatedUser:'users/getAuthenticatedUser',
            getActiveUser:'users/fetchAUserDetails',
        })
    },
    methods:{
        ...mapActions({
            sendMessage: "chats/sendMessage",
            markAsRead: "chats/markChatsAsRead"
        }),
        sendToUser(){
            if(this.message){
                let data = {
                    receiver_id:this.friendId, 
                    message: this.message
                };
                this.sendMessage(data);
                this.message = "";
            }
        },
        chooseImage(){
            this.$refs.image.click()
        },
        async loadImagePreview(){
            let reader = new FileReader();
            reader.onload = (e)=>{
                this.$refs.preview.src = e.target.result;
            }
            await reader.readAsDataURL(this.$refs.image.files[0]);
            document.querySelector('.preview_wrapper').classList.add('active')
        },
        hideImagePreview(){
            document.querySelector('.preview_wrapper').classList.remove('active')
        },
        sendImage(){
            let data = new FormData();

            data.append("image", this.$refs.image.files[0]);
            data.append("receiver_id", this.friendId);
            // dummy data
            data.append("message", "image");
            this.sendMessage(data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            this.hideImagePreview();
        }
    },
    
};
</script>

<style>
.content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.content .messages {
    height: auto;
    min-height: calc(100% - 93px);
    max-height: calc(100% - 93px);
    overflow-y: scroll;
    overflow-x: hidden;
}
.content .messages::-webkit-scrollbar {
    width: 8px;
    background: rgba(0, 0, 0, 0);
}
.content .messages::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
}
.content .messages ul li {
    margin: 15px 15px 5px 15px;
    width: calc(100% - 25px);
    font-size: 0.8em;
    display: flex;
    align-items: center;
}
.content .messages ul li:nth-last-child(1) {
    margin-bottom: 20px;
}
.content .messages ul li.sent img {
    margin: 6px 8px 0 0;
}
.content .messages ul li.sent p {
    background: #435f7a;
    color: #f5f5f5;
}
.content .messages ul li.replies {
    justify-content: flex-start;
    flex-direction: row-reverse;
}
.content .messages ul li.replies p {
    background: #f5f5f5;
    margin-right: 0.5em;
}
.content .messages ul li.replies.image,
.content .messages ul li.sent.image {
    align-items: flex-start;
}
.content .messages ul li img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
}
.content .messages ul li p {
    display: inline-block;
    padding: 10px 15px;
    border-radius: 20px;
    max-width: 205px;
    line-height: 130%;
    font-size: 12px;
    text-align: left;
}
.content .messages ul li.replies.image p,
.content .messages ul li.sent.image p {
    padding: 0.5em;
    border-radius: 0.4em;
}

.content .messages ul li.replies.image p img,
.content .messages ul li.sent.image p img {
    width: 15em;
    height: 15em;
    border-radius: 0;
}

.content .message-input {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 99;
}
.content .message-input .wrap {
    position: relative;
}
.content .message-input .wrap input {
    font-family: "proxima-nova", "Source Sans Pro", sans-serif;
    float: left;
    border: none;
    width: calc(100% - 90px);
    padding: 11px 32px 10px 8px;
    font-size: 0.8em;
    color: #32465a;
}
.content .message-input .wrap input:focus {
    outline: none;
}
.content .message-input .wrap .attachment {
    position: absolute;
    right: 60px;
    z-index: 4;
    margin-top: 10px;
    font-size: 1.1em;
    color: #435f7a;
    opacity: 0.5;
    cursor: pointer;
}
.content .message-input .wrap .attachment:hover {
    opacity: 1;
}
.content .message-input .wrap input[type=file]{
    display:none;
}
.content .message-input .wrap button {
    float: right;
    border: none;
    width: 50px;
    padding: 12px 0;
    cursor: pointer;
    background: #32465a;
    color: #f5f5f5;
}
.content .message-input .wrap button:hover {
    background: #435f7a;
}
.content .message-input .wrap button:focus {
    outline: none;
}
.content .preview_wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.35s ease-in-out;
    transform-origin: 50% 50%;
    overflow: hidden;
    transform: scale(0);
}
.content .preview_wrapper.active{
    transform: scale(1);
}
.content .preview_wrapper .preview_container img{
    width: 30em;
    height: 30em;
    background: white;
    padding: 0.3em;
}
.content .preview_wrapper .preview_container button{
    width: 6em;
    color: white;
    border-radius: 0.5em;
}
</style>
