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
  border-radius: 6px;
  margin: 10px;
  width: 160px;
  height: 100px;
  background: white;
  display: inline-table;
  position: relative;
  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

@media screen and (min-width: 769px) {
  .user_card {
    width: 240px;
    height: 160px;
  }
}
</style>