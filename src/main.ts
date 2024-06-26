// main.ts
import {createApp} from "vue";
import Antd from 'ant-design-vue';
import App from "./App.vue";
import router from "@/router";
import {createPinia} from "pinia";
import 'ant-design-vue/dist/reset.css';
// import "@/assets/styles/css/ant.css";
import "@/assets/styles/css/style.css";
import '@/assets/styles/less/variables.less';
import '@/assets/styles/less/antd.less';
import "@/assets/styles/css/tailwindcss.css";
// 引入echarts
import echarts from "@/common/ts/echarts";
import antdConfig from "@/config/antd.config";
import i18n from "@/locales";

antdConfig();

const pinia = createPinia();
const app = createApp(App);
// const app = createSSRApp(App);

app.use(pinia); // 注意顺序
app.use(router);
app.use(i18n);
app.use(Antd)
// 挂载到vue实例中
app.config.globalProperties.$echarts = echarts; //vue3的挂载方式

app.mount("#app");
