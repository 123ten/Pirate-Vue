// 这里就新建一个 env.d.ts 文件
declare module "*.vue" {
  import { defineComponent } from "vue";
  const Component: ReturnType<typeof defineComponent>;
  export default Component;
}
declare module "nprogress" {
  const start: any;
  const done: any;
}

declare module "sortablejs" {
  const create: any;
}
