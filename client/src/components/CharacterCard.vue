<template>
  <div class="swipe_card no_drag">
    <div class="character_portrait">
      <img class="character_idle_image no_drag" src="../assets/character/1/idle.gif" />
    </div>
    <div class="character_name no_drag">엘리</div>
    <div class="character_discription no_drag">
      귀여운 엘리
      <br />별똥별로 광역 공격을 한다.
    </div>
    <button class="select_button no_drag">
      <img class="select_icon no_drag" src="../assets/check.png" />
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CharacterCard extends Vue {}
</script>

<style scoped>
.select_icon {
  height: 24px;
  width: 24px;
  position: absolute;
  top: -2px;
  left: 82px;
  border-radius: 12px;
}
.swipe_card {
  position: relative;
  border-radius: 5px;
  background: #303030;
  width: 300px;
  height: 100px;
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  display: inline-block;
  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
.character_portrait {
  width: 80px;
  height: 80px;
  background: darkgray;
  margin-left: 10px;
  margin-top: 10px;
  position: absolute;
}
.character_idle_image {
  width: 50px;
  height: 50px;
  image-rendering: pixelated;
  margin-top: 15px;
}
.character_name {
  font-size: 1.5em;
  color: white;
  font-weight: 600;
  width: 190px;
  top: 2px;
  position: absolute;
  right: 10px;
}
.character_discription {
  font-size: 0.9em;
  color: darkgray;
  width: 190px;
  position: absolute;
  right: 10px;
  top: 30px;
}

.select_button {
  position: absolute;
  width: 190px;
  right: 10px;
  bottom: 10px;
  background: white;
  border-radius: 4px;
  height: 24px;
  padding-bottom: 3px;
  font-size: 1.1em;
  font-weight: 400;
}
</style>