<template>
  <div class="count_down no_drag" :class="{'hide': countDown}">{{count}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Counter extends Vue {
  @Prop()
  private count!: number;
  @Prop()
  private countDown!: boolean;
}
</script>

<style scoped>
.count_down {
  font-family: sans-serif;
  position: absolute;
  z-index: 5;
  left: calc(50% - 150px);
  top: calc(50% - 50px);
  font-size: 5em;
  width: 300px;
  height: 100px;
  text-align: center;
  font-weight: 600;
  line-height: 90px;
  opacity: 0;
  transform: scale(5);
}

.count_down.hide {
  opacity: 1;
  transition: opacity 0.7s linear, transform 0.7s linear;
  transform: scale(0);
}
</style>