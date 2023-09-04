<!-- 图标配置 -->
<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  toRef,
  unref,
  withDefaults,
  watch,
  nextTick,
} from "vue";
import { SyncOutlined } from "@ant-design/icons-vue";
import * as antIcons from "@ant-design/icons-vue";
import { notification } from "ant-design-vue";

const emits = defineEmits(["update:visible"]);

//#region 变量
const outlinedList = ref<string[]>([]);
const filledList = ref<string[]>([]);
const twoToneList = ref<string[]>([]);
const icons = ref<string[]>([]);
const iconTabs = ref<string[]>(["line", "fill", "twoTone"]);

const currentTab = ref<string>("");
const currentIcon = ref<string>("LineOutlined"); // 默认图标

const visible = ref<boolean>(false);
//#endregion

onMounted(() => {
  initIcon();

  //   console.log("antIcons", Object.keys(antIcons));
});
// 初始化icon
const initIcon = () => {
  console.time("initIcon");
  const _antIcons = Object.keys(antIcons);
  const _outlinedList: string[] = [];
  const _filledList: string[] = [];
  const _twoToneList: string[] = [];

  for (let i = 0; i < _antIcons.length; i++) {
    const key = _antIcons[i];
    if (key.slice(-8) === "Outlined") {
      _outlinedList.push(key);
    } else if (key.slice(-6) === "Filled") {
      _filledList.push(key);
    } else if (key.slice(-7) === "TwoTone") {
      _twoToneList.push(key);
    }
  }
  outlinedList.value = _outlinedList;
  filledList.value = _filledList;
  twoToneList.value = _twoToneList;

  icons.value = _outlinedList;
  [currentTab.value] = unref(iconTabs); // 默认展示第一条
  console.timeEnd("initIcon");
};
// 刷新所有图标
const onLoad = () => {
  currentIcon.value = "LineOutlined";
};
// 切换图标 tab
const checkIconTab = (type: string) => {
  const maps = new Map();
  maps.set("line", unref(outlinedList));
  maps.set("fill", unref(filledList));
  maps.set("twoTone", unref(twoToneList));
  if (maps.has(type)) {
    currentTab.value = type;
    icons.value = maps.get(type);
  } else {
    notification.error({
      message: "没有此图标分类",
    });
  }
};
// 选择图标 icon
const checkIcon = (key: string) => {
  console.log("key", key);
  nextTick(() => {
    currentIcon.value = key;
  });
  console.log("currentIcon.value", currentIcon.value);

  visible.value = false;
};

const iconComputed = computed(
  () => antIcons[unref(currentIcon) as keyof typeof antIcons]
);
</script>

<template>
  <a-popover
    placement="bottom"
    trigger="click"
    class="icon"
    v-model:visible="visible"
  >
    <template #title>
      <div class="icons-title">
        请选择图标
        <div class="icons-tab">
          <span
            v-for="item in iconTabs"
            :key="item"
            class="tab-item"
            :class="{ active: item === currentTab }"
            @click="checkIconTab(item)"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </template>
    <template #content>
      <div class="icons-content">
        <div
          class="icons-item"
          v-for="(icon, index) in icons"
          :key="index"
          @click="checkIcon(icon)"
        >
          <component
            :is="antIcons[icon as keyof typeof antIcons]"
            style="font-size: 20px"
          />
        </div>
      </div>
    </template>
    <a-input placeholder="搜索图标">
      <template #addonBefore>
        <component :is="iconComputed" />
      </template>
      <template #addonAfter>
        <SyncOutlined @click="onLoad" />
      </template>
    </a-input>
  </a-popover>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
