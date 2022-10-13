<template>
    <div class="shadow-2xl h-screen fixed bg-gray-800">
        <!-- logged in user profile -->
        <div class="profile">
            <div class="wrap">
                <img class="profile-img online" :src="user.image" alt="" />
                <p class="text-white">{{ getAuthenticatedUser.name }}</p>

                <i
                    class="fa fa-chevron-down expand-button"
                    aria-hidden="true"
                ></i>
                <div class="status-options">
                    <ul>
                        <li class="status-online active">
                            <span class="status-circle"></span>
                            <p>Online</p>
                        </li>
                        <li class="status-away">
                            <span class="status-circle"></span>
                            <p>Away</p>
                        </li>
                        <li class="status-busy">
                            <span class="status-circle"></span>
                            <p>Busy</p>
                        </li>
                        <li class="status-offline">
                            <span class="status-circle"></span>
                            <p>Offline</p>
                        </li>
                    </ul>
                </div>
                <div class="expanded">
                    <label for="name"
                        ><i class="fa fa-user fa-fw" aria-hidden="true"></i
                    ></label>
                    <input name="name" type="text" :value="getAuthenticatedUser.name" />
                    <label for="email"
                        ><i class="far fa-envelope fa-fw" aria-hidden="true"></i
                    ></label>
                    <input name="email" type="text" :value="getAuthenticatedUser.email" />
                    <label for="username"
                        ><i class="fa fa-instagram fa-fw" aria-hidden="true"></i
                    ></label>
                    <input name="twitter" type="text" :value="getAuthenticatedUser.username" />
                    <button
                        :disabled="loading"
                        class="bg-red-500 text-white px-4 py-2 rounded-full w-full"
                        @click="Logout"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
        <!-- profile ends -->

        <!-- search friends -->
        <div class="search">
            <label for=""
                ><i class="fa fa-search" aria-hidden="true"></i
            ></label>
            <input
                type="text"
                placeholder="Search contacts..."
                v-model="query"
                @keydown="filterFriends"
            />
        </div>
        <!-- search friends ends -->

        <!-- friends list -->
        <ul class="overflow-y-auto overflow-x-hidden">
            <li
                class="mb-4 px-4 relative py-3"
                v-for="(friend, index) in friends"
                :key="index"
                @click="chooseActiveUser(friend.id)"
            >
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 relative">
                        <img
                            class="h-10 w-10 rounded-full"
                            :src="friend.image"
                            alt=""
                        />
                        <i
                            class="fas fa-circle"
                            :class="[friend.online == 1 ? 'online' : '']"
                        ></i>
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-left">
                            {{ friend.name }}
                        </div>
                        <div class="text-sm text-left">
                            {{ friend.email }}
                        </div>
                    </div>
                    <div class="text-sm text-right flex-1">
                        <aside
                            class="rounded-full bg-green-100 text-green-800 inline-block text-center text-xs"
                            v-show="friend.unread"
                        >
                            {{ friend.unread }}
                        </aside>
                    </div>
                </div>
            </li>
        </ul>
        <!-- friends list ends -->
        <loading
            v-model:active="isLoading"
            :can-cancel="true"
            :is-full-page="fullPage"
        />
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
    data() {
        return {
            user: {},
            friends: [],
            query: "",
            loading: false,
            isLoading: false,
            fullPage: true,
        };
    },
    async created() {
        this.isLoading = true;
        // await this.setAuthenticatedUser();
        await this.getAllUsers()
            .then((res) => {
                console.log(res);
                this.friends = this.sortUsersList(this.getUsers);
            })
            .catch((err) => {
                if (this.getStatus == 401) {
                    this.$router.push({ name: "Login" });
                }
            })
            .finally(() => {
                this.isLoading = false;
            });
    },
    mounted() {
        document
            .querySelector(".expand-button")
            .addEventListener("click", function () {
                document.querySelector(".profile").classList.toggle("expanded");
            });

        setTimeout(() => {
            const users = document.querySelectorAll("li.mb-4.px-4.relative");
            users.forEach((user) => {
                user.addEventListener("click", function () {
                    users.forEach((li) => {
                        if (li.classList.contains("active")) {
                            // make user not active
                            li.classList.remove("active");
                        }
                    });
                    // make user active
                    user.classList.add("active");
                });
            });
        }, 5000);
        this.emitter.on("newMessage", (chat) => {
            this.friends.find((friend) => friend.id == chat.user_id).unread =
                this.getUnreadChatsCount(chat.user_id);
            this.friends = this.sortUsersList(this.getUsers);
        });
    },
    methods: {
        ...mapActions({
            getAllUsers: "users/fetchUsers",
            // setAuthenticatedUser: "users/fetchAuthenticatedUsers",
            Logout: "users/LogOut",
        }),
        chooseActiveUser(id) {
            this.emitter.emit("selectUser", id);
        },
        filterFriends() {
            this.friends = this.searchUsers(this.query);
        },
    },
    computed: {
        ...mapGetters({
            getUsers: "users/fetchUsers",
            getAuthenticatedUser: "users/getAuthenticatedUser",
            getStatus: "users/getStatus",
            searchUsers: "users/getSearchResults",
            getUnreadChatsCount: "chats/getUnreadChatsCount",
        }),
        sortUsersList() {
            return () => {
                return this.getUsers.sort((a, b) => b.unread - a.unread);
            };
        },
    },
    components: {
        Loading,
    },
};
</script>

<style scoped>
.profile {
    width: 80%;
    margin: 25px auto;
}

.profile.expanded .wrap {
    height: 16rem;
    line-height: initial;
}

.profile.expanded .wrap p {
    margin-top: 20px;
}

.profile.expanded .wrap i.expand-button {
    transform: scaleY(-1);
    filter: FlipH;
}

.profile .wrap {
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    transition: 0.3s height ease;
}

.profile .wrap img {
    width: 50px;
    border-radius: 50%;
    padding: 3px;
    height: 50px;
    float: left;
    cursor: pointer;
    transition: 0.3s border ease;
}

.profile .wrap img.online {
    border: 2px solid #2ecc71;
}

.profile .wrap img.away {
    border: 2px solid #f1c40f;
}

.profile .wrap img.busy {
    border: 2px solid #e74c3c;
}

.profile .wrap img.offline {
    border: 2px solid #95a5a6;
}

.profile .wrap p {
    float: left;
    margin-left: 15px;
}

.profile .wrap i.expand-button {
    float: right;
    margin-top: 23px;
    font-size: 0.8em;
    cursor: pointer;
    color: #435f7a;
}

.profile .wrap .status-options {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    width: 150px;
    margin: 70px 0 0 0;
    border-radius: 6px;
    z-index: 99;
    line-height: initial;
    background: #435f7a;
    transition: 0.3s all ease;
}

.profile .wrap .status-options.active {
    opacity: 1;
    visibility: visible;
    margin: 75px 0 0 0;
}

.profile .wrap .status-options:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 8px solid #435f7a;
    margin: -8px 0 0 24px;
}

.profile .wrap .status-options ul {
    overflow: hidden;
    border-radius: 6px;
}

.profile .wrap .status-options ul li {
    padding: 15px 0 30px 18px;
    display: block;
    cursor: pointer;
}

.profile .wrap .status-options ul li:hover {
    background: #496886;
}

.profile .wrap .status-options ul li span.status-circle {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 5px 0 0 0;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li
    span.status-circle:before {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    margin: -3px 0 0 -3px;
    background: transparent;
    border-radius: 50%;
    z-index: 0;
}

.profile .wrap .status-options ul li p {
    padding-left: 12px;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-online
    span.status-circle {
    background: #2ecc71;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-online.active
    span.status-circle:before {
    border: 1px solid #2ecc71;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-away
    span.status-circle {
    background: #f1c40f;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-away.active
    span.status-circle:before {
    border: 1px solid #f1c40f;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-busy
    span.status-circle {
    background: #e74c3c;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-busy.active
    span.status-circle:before {
    border: 1px solid #e74c3c;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-offline
    span.status-circle {
    background: #95a5a6;
}

.frame
    .sidepanel
    .profile
    .wrap
    .status-options
    ul
    li.status-offline.active
    span.status-circle:before {
    border: 1px solid #95a5a6;
}

.profile .wrap .expanded {
    padding: 100px 0 0 0;
    display: block;
    line-height: initial;
}

.profile .wrap .expanded label {
    float: left;
    clear: both;
    margin: 0 8px 5px 0;
    padding: 5px 0;
}

.profile .wrap .expanded input {
    border: none;
    margin-bottom: 6px;
    background: #32465a;
    border-radius: 3px;
    color: #f5f5f5;
    padding: 7px;
    width: calc(100% - 43px);
}

.profile .wrap .expanded input:focus {
    outline: none;
    background: #435f7a;
}

.search {
    border-top: 1px solid #32465a;
    border-bottom: 1px solid #32465a;
    font-weight: 300;
}

.search label {
    position: absolute;
    margin: 10px 0 0 20px;
}

.search input {
    font-family: "proxima-nova", "Source Sans Pro", sans-serif;
    padding: 10px 0 10px 46px;
    width: calc(100% - 25px);
    border: none;
    background: #32465a;
    color: #f5f5f5;
}

.search input:focus {
    outline: none;
    background: #435f7a;
}

.search input::placeholder {
    color: #9d9d9d;
}

.fixed {
    width: 28.6%;
}

ul {
    height: calc(100% - 9.5rem);
}

ul li {
    cursor: pointer;
    color: #c9c9c9;
}

ul li img {
    transition: filter 0.2s ease-in;
}

ul li:not(.active) img {
    filter: grayscale(100%);
}

ul li::after {
    content: "";
    transition: width 0.2s ease-in;
    width: 0%;
    height: 3px;
    transform: translateX(-50%);
    bottom: 0;
    background: #0ea5e9;
    left: 50%;
    position: absolute;
    margin-top: 0.4em;
}

ul li.active {
    color: #fff;
}

ul li.active::after {
    width: 100%;
}

ul li.active img {
    filter: grayscale(0%);
}

ul li .flex i.fa-circle {
    position: absolute;
    font-size: 7px;
    top: 4.5em;
    left: 4.5em;
    color: #c7c7c7;
}

ul li .flex i.fa-circle.online {
    color: #4cdd4c;
}

ul::-webkit-scrollbar {
    width: 8px;
    background: #182a3b;
}

ul::-webkit-scrollbar-thumb {
    background-color: #3a4b5f;
}

aside {
    height: 1.35em;
    width: 1.35em;
}
</style>
