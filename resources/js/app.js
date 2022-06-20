import './bootstrap';

import { createApp } from 'vue';
import VueSweetalert2 from "vue-sweetalert2";
import VueAxios from "vue-axios";
import axios from "axios";
import router from './Router';
import store from "./Store";
import mitt from 'mitt';
const emitter = mitt();
import 'sweetalert2/dist/sweetalert2.min.css';
let app = createApp(require('./App.vue').default);
app.use(router);
app.use(VueSweetalert2);
app.use(VueAxios, axios);
app.use(store);
app.config.globalProperties.emitter = emitter;
app.mount("#app")
