<script setup lang="ts">
import { themeTableSizeOptions } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'TableProps'
});

const themeStore = useThemeStore();
</script>

<template>
  <NDivider>{{ $t('theme.tablePropsTitle') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="0" :label="$t('theme.table.size.title')">
      <NSelect
        v-model:value="themeStore.table.size"
        :options="translateOptions(themeTableSizeOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <SettingItem key="1" :label="$t('theme.table.bordered')">
      <NSwitch v-model:value="themeStore.table.bordered" />
    </SettingItem>
    <SettingItem key="2" :label="$t('theme.table.bottomBordered')">
      <NSwitch v-model:value="themeStore.table.bottomBordered" />
    </SettingItem>
    <SettingItem key="3" :label="$t('theme.table.singleColumn')">
      <NSwitch v-model:value="themeStore.table.singleColumn" :checked-value="false" :unchecked-value="true" />
    </SettingItem>
    <SettingItem key="4" :label="$t('theme.table.singleLine')">
      <NSwitch v-model:value="themeStore.table.singleLine" :checked-value="false" :unchecked-value="true" />
    </SettingItem>
    <SettingItem key="5" :label="$t('theme.table.striped')">
      <NSwitch v-model:value="themeStore.table.striped" />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped></style>
