// import { axios } from "axios";
import router from '../../Router';

export default {
  namespaced: true,
  state: {
    users: [],
    authenticatedUser: JSON.parse(window.localStorage.getItem("laravelVueChatAppUser")) || {},
    validationErrors: null,
    status: null,
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload;
    },
    setAuthenticatedUser(state, payload) {
      state.authenticatedUser = payload;
    },
    setValidationError(state, payload) {
      state.validationErrors = payload;
    },
    setStatus(state, payload) {
      state.status = payload;
    },
    addUser(state, payload) {
      state.users.push(payload);
    },
    updateUser(state, payload) {
      state.users.find((user) => user.id === payload.id).online =
        payload.online;
      state.users.find((user) => user.id === payload.id).last_logged_in =
        payload.last_logged_in;
        state.users.sort((a, b) => {
          return a.online;
        });
    },
    updateUserUnread(state, payload) {
      state.users.find((user) => user.id === payload.id).unread = payload.unread;
    }
  },
  actions: {
    async fetchUsers({ commit,rootGetters }) {
      return new Promise((resolve, reject) =>{
        axios
          .get(process.env.MIX_API_URL + "api/users")
          .then((res) => {
            commit("setUsers", res.data.users);
            let users = rootGetters["users/fetchUsers"];
            users.forEach((user) => {
              let data = {
                id: user.id,
                unread: rootGetters["chats/getUnreadChatsCount"](user.id),
              };
              commit("updateUserUnread", data);
            });
            resolve({
              status: true
            })
          })
          .catch((err) => {
            reject(err.response)
            if (err.response && err.response.status == 401) {
              commit("setStatus", err.response.status);
              window.localStorage.removeItem("token");
            }
          });
      })
        
    },
    async fetchAuthenticatedUsers({ commit }) {
      await axios
        .get(process.env.MIX_API_URL + "api/users/profile")
        .then((res) => {
          commit("setAuthenticatedUser", res.data);
        })
        .catch((err) => {
          if (err.response.status == 401) {
            window.localStorage.removeItem("token");
            commit("setStatus", err.response.status);
          }
        });
    },

    async AuthenticateUser({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(process.env.MIX_API_URL + "api/login", data)
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("laravelVueChatAppUser", JSON.stringify(response.data.user));
            commit("setAuthenticatedUser", response.data.user);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
            return resolve({
              status: true,
            })
          })
          .catch((error) => {
            console.log('err',error);
            if (error.response.status == 401) {
              commit("setStatus", 401);
              reject({
                status: false,
                msg: "something went wrong"
              });
            } else {
              if (error.response.status == 422) {
                commit("setValidationError", error.response.data);
                commit("setStatus", error.response.status);
              }
            }
          });
      })
    },

    async LogOut({ commit }) {
      await axios
        .post(process.env.MIX_API_URL + "api/logout")
        .then((response) => {
          if (response.status == 200) {
            commit("setStatus", 200);
            window.localStorage.removeItem("token");
            router.push({ name: "Login" });
          }
        })
        .catch(() => {});
    },
    AddNewUser({ commit }, data) {
      commit("addUser", data);
    },
    UpdateUserDetails({ commit }, data) {
      commit("updateUser", data);
    },
  },
  getters: {
    getAuthenticatedUser(state) {
      return state.authenticatedUser;
    },
    fetchAUserDetails: (state) => (id) => {
      return state.users.find((user) => user.id === id);
    },
    fetchUsers(state) {
      return state.users;
    },
    getValidationError(state) {
      return state.validationErrors;
    },
    getStatus(state) {
      return state.status;
    },
    getSearchResults:  (state) => (searchTerm) => {
      return state.users.filter((user) => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      })
    }
  },
};
