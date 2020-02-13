<template>
  <div class="card">
    <img class="plus_icon" src="../assets/plus.png">
    <span class="create">Create New Game</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RoomData } from '../../../game/union/interface/RoomData';

@Component
export default class CreateServer extends Vue {
}
</script>

<style scoped>
.create {
  font-size: 1.5em;
  position: absolute;
  width: 100%;
  left: 16px;
  top: 27px;
  font-weight: 600;
}
.plus_icon {
  width: 50px;
  height: 50px;
  top: 15px;
  left: 15px;
  position: absolute;
}
.card {
  color: white;
  text-align: center;
  background: lightslategray;
  border-radius: 4px;
  display: block;
  height: 80px;
  margin: auto;
  position: relative;
  margin-top: 14px;
  width: 300px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>