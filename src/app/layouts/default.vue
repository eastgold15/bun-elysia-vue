<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { handleApiRes } from '../utils/handleApiRes';
import { client } from '../utils/useTreaty';

const user = ref();

onMounted(async () => {
  console.log('Default layout mounted');

  const res = await handleApiRes(client.api.user.get())

  user.value = res;
});



</script>

<template>

  {{ user }}
</template>