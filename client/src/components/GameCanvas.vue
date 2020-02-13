<template>
  <div class="full_page" :class="{'unVisible':unVisible}"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class GameCanvas extends Vue {
}
</script>

<style scoped>
.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 1.5s ease-in;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 1.5s ease-in;
}
</style>