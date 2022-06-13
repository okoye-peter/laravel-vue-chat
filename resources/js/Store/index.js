import { createStore } from "vuex";
import users from "./modules/users.js";
import chats from "./modules/chats.js";


const store = createStore({
    modules:{
        users: users,
        chats: chats,
    }
})

export default store;