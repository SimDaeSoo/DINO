<template>
  <div class="footer">
    <div class="character_list">
      <span class="character_logo">Character</span>
      <div class="swipe">
        <CharacterCard
          v-for="(character) in characters"
          :key="character.code"
          :character="character"
          :changeCharacter="changeCharacter"
          :selected="user?(user.character.code === character.code):false"
          :disabled="(user && user.status)==='READY'"
        />
      </div>
    </div>

    <div class="button_wrap">
      <button @click="exit" class="exit_button half no_drag">Exit</button>
      <button
        @click="toggleReady"
        class="ready_button half no_drag"
        :style="{'background':(user && user.status)==='READY'?'#601010':'#104010'}"
      >{{(user && user.status)==='READY'?'Wait':'Ready'}}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CharacterCard from "./CharacterCard.vue";
import GameClient from "../../../game/client/class/GameClient";
import { UserData } from "../../../game/union/interface/RoomData";
import CharacterData from "../../../game/union/data/character";

@Component({
  components: { CharacterCard },
})
export default class RoomFooter extends Vue {
  @Prop()
  private exit!: () => void;
  @Prop()
  private gameClient!: GameClient;
  @Prop()
  private user!: UserData;
  @Prop()
  private characters!: CharacterData[];

  private toggleReady(): void {
    this.gameClient.socket.emit("toggleReady");
  }
  private changeCharacter(code: string): void {
    this.gameClient.socket.emit("changeCharacter", code);
  }
}
</script>

<style scoped>
.exit_button {
  background: #262626;
  color: white;
  font-weight: 400;
}
.ready_button {
  font-weight: 400;
  color: white;
}
.character_logo {
  position: absolute;
  z-index: 2;
  font-size: 2em;
  font-weight: 600;
  left: 10px;
  top: -20px;
  color: white;
}
button {
  width: calc(50% - 6px);
  height: 30px;
  border-radius: 5px;
  background: white;
  margin: 3px;
  font-size: 1.2em;
}

.character_list {
  height: 120px;
  margin: 3px;
  border-radius: 5px;
  background: #272727;
  overflow-x: auto;
  overflow-y: hidden;
}

.swipe {
  display: inline-flex;
  height: 100%;
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
}

@media screen and (min-width: 769px) {
  .footer {
    max-width: 769px;
  }
}
</style>