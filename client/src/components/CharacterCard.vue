<template>
  <div class="swipe_card no_drag" :class="{'disabled':!selected || disabled}">
    <div class="character_portrait">
      <img
        class="character_idle_image no_drag"
        :src="'./character/'+character.code+'/'+character.preview"
      />
    </div>
    <div class="character_name no_drag">{{character.name}}</div>
    <div class="character_discription no_drag" v-html="character.description" />
    <button class="select_button no_drag" @click="changeCharacter(character.code)">
      <img v-if="selected" class="select_icon no_drag" src="../assets/check.png" />
      <span v-else class="select_text">Select</span>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CharacterData from "../../../game/union/data/character";

@Component
export default class CharacterCard extends Vue {
  @Prop()
  private character!: CharacterData;
  @Prop()
  private disabled!: boolean;
  @Prop()
  private selected!: boolean;

  @Prop()
  private changeCharacter!: (code: number) => void;
}
</script>

<style scoped>
.select_text {
  font-weight: 500;
}
.disabled {
  filter: brightness(0.7);
}
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
  font-size: 1.2em;
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
  width: 182px;
  height: 36px;
  position: absolute;
  right: 10px;
  top: 26px;
  text-align: left;
  background: #242424;
  border-radius: 4px;
  padding: 4px;
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