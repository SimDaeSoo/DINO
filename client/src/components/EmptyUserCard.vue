<template>
  <div class="user_card">
    <div class="blank">blank</div>
    <div class="empty_card no_drag">-</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class EmptyUserCard extends Vue {}
</script>

<style scoped>
.user_card {
  border-radius: 6px;
  margin: 10px;
  width: 160px;
  height: 100px;
  background: #333333;
  display: inline-table;
  position: relative;
  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.blank {
  width: 100%;
  height: 0px;
  opacity: 0;
}
.empty_card {
  color: white;
  font-size: 2em;
  margin-top: 30px;
}

@media screen and (min-width: 769px) {
  .user_card {
    width: 240px;
    height: 160px;
  }
  .empty_card {
    font-size: 3em;
    margin-top: 50px;
  }
}
</style>