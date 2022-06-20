// import router from '../../Router';

const chats = {
  namespaced: true,
  state: {
    chats: [],
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload;
    },
    addToChat(state, payload) {
      state.chats.push(payload);
    },
    updateChat(state, payload) {
        state.chats.forEach(chat => {
            if(chat.user_id == payload.user_id && chat.receiver_id == payload.receiver_id && chat.read_at == null){
                chat.read_at = payload.timestamp;
            }
        })
    }
  },
  actions: {
    async getChats({ commit }) {
      await axios.get("/api/chats").then((response) => {
        commit("setChats", response.data.chat);  
      });
    },
    async sendMessage({ commit }, data, headers = {}) {
      await axios.post("/api/chats/create", data, headers).then((response) => {
        commit("addToChat", response.data.chat);
      });
    },
    async markChatsAsRead({ commit }, data) {
      await axios.get(`/api/chats/${data}`).then((response) => {
        if (response.status === 204) {
          commit("updateChat", response.data);
          commit("users/updateUserUnread",{id: data,unread: 0},{ root: true });
        }
      });
    },
    saveChat({ commit }, data) {
      commit("addToChat", data);
    },
  },
  getters: {
    getChats: (state) => (id) => {
      return state.chats.filter((chat) => {
        return chat.user_id == id || chat.receiver_id == id;
      });
    },
    getUnreadChatsCount: (state) => (id) => {
      return state.chats.filter((chat) => chat.read_at == null &&  chat.user_id == id).length;
    }
  },
};

export default chats;