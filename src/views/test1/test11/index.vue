<script setup lang="tsx">
import { countryApi } from '@/services/apis/country';

const { state } = useAsyncState(() => countryApi.listAll().then(it => it.data), []);
</script>

<template>
  <div>
    <div v-for="item in state" :key="item.id">
      <SvgIcon :icon="`flagpack:${item.locale.toLowerCase()}`"></SvgIcon>
    </div>
  </div>
</template>
