<!-- 模块下载 -->
<script lang="ts">
import { defineComponent, ref } from "vue";
import { DownloadOutlined, CloudDownloadOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "ModuleMain",
});
</script>
<script setup lang="ts">
const activeKey = ref<string>("1");
</script>

<template>
  <div class="module-main">
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="全部">
        <div class="module-goods">
          <div
            class="goods-item suspension mb_16 mr_16"
            v-for="item in 10"
            :key="item"
          >
            <img
              src="https://cdn.buildadmin.com/storage/default/20230228/430a772d137c807ee0f17befe014ec290d2206c3.png"
              alt=""
              class="goods-img"
            />
            <div class="goods-content">
              <div class="goods-tags mb_8">
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
                <a-tag color="success" class="tags-item">pink</a-tag>
                <a-tag color="processing" class="tags-item">pink</a-tag>
              </div>
              <div class="goods-title mb_8">WebNuxt(SSR)</div>
              <div class="goods-exhibit">
                <div class="goods-download">
                  <CloudDownloadOutlined class="mr_5" />
                  0
                </div>
                <div class="goods-point">
                  <div class="old-point">100积分</div>
                  <div class="new-point">10积分</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab Title 2">
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
        <p>Content of Tab Pane 2</p>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab Title 3">
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
        <p>Content of Tab Pane 3</p>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="less" scoped>
@import "./index.less";
</style>
