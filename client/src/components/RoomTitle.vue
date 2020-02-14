<template>
  <div class="room_title">{{id}}번방 {{title}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RoomTitle extends Vue {
  @Prop()
  private title!: string;
  @Prop()
  private id!: number;
}
</script>

<style scoped>
.room_title {
  width: 100%;
  height: 40px;
  background: cadetblue;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 1.5em;
  line-height: 40px;
}

@media screen and (min-width: 769px) {
  .room_title {
    max-width: 1024px;
  }
}
</style>