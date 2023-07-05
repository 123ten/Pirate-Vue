// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import "./common/css/ant.css";
import "./common/css/reset.css";
import "./common/css/style.css";
// 引入echarts
import echarts from "@/common/ts/echarts";
import antdConfig from "@/config/antd.config";

antdConfig();

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(Antd);
// 挂载到vue实例中
// Vue.prototype.$echarts = echarts;//vue2的挂载方式
app.config.globalProperties.$echarts = echarts; //vue3的挂载方式

app.mount("#app");

// 禁用右键全局
document.addEventListener('contextmenu',function(e){
    e.preventDefault();
})