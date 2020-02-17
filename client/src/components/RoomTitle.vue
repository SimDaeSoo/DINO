<template>
  <div class="room_title no_drag">
    <div class="flag_wrapper">
      <img class="flag_icon no_drag" src="../assets/flag.png">
      <span class="room_id no_drag">{{id}}</span>
    </div>
    {{title}}
  </div>
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
.room_id {
  position: absolute;
  width: 40px;
  text-align: center;
  left: 10px;
  top: 15px;
  font-size: 0.7em;
}
.flag_wrapper {
  position: absolute;
  left: -15px;
  top: -10px;
}
.flag_icon {
  width: 60px;
  height: 72px;
}
.room_title {
  width: 100%;
  height: 40px;
  background: #282828;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 1.5em;
  line-height: 42px;
  color: white;
  z-index: 1;
}
</style>