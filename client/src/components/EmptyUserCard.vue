<template>
  <div class="user_card">Empty</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EmptyUserCard extends Vue {
}
</script>

<style scoped>
.user_card {
  margin: 10px;
  width: 160px;
  height: 100px;
  background: white;
  display: inline-table;
}

@media screen and (min-width: 769px) {
  .user_card {
    width: 240px;
    height: 160px;
  }
}
</style>