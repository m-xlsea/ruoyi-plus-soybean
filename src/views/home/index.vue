<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <NSpace vertical :size="16">
    <NAlert title="如遇问题请先看这里" type="warning">
      <div class="text-18px">
        <div>
          开发前请先查看 ReadMe.md 文件中的
          <NA
            href="https://gitee.com/xlsea/ruoyi-plus-soybean#%E5%BC%80%E5%8F%91%E5%89%8D%E5%BF%85%E7%9C%8B"
            target="_blank"
            rel="noopener noreferrer"
          >
            开发前必看
          </NA>
        </div>
        <div>如遇菜单无法点击，请检查是否已替换菜单 SQL</div>
        <div>如遇代码无法生成，请检查是否已替换代码生成模板</div>
      </div>
    </NAlert>
    <HeaderBanner />
    <CardData />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
