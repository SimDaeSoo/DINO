<template>
  <div class="user_card no_drag">
    <img class="crown_icon no_drag" src="../assets/crown.png" v-if="isOwner" />
    <div class="blank no_drag">blank</div>
    <div class="display_name no_drag">{{user.displayName}}</div>
    <div class="character_preview no_drag">
      <img class="character_idle_image no_drag" src="../assets/character/1/idle.gif" />
    </div>
    <!-- <div class="status">{{user.status}}</div> -->
    <button v-if="canFire" class="ban_button no_drag">X</button>
    <div
      class="ready_bar no_drag"
      :style="{'background':user.status==='Ready'?'mediumspringgreen':'lightcoral'}"
    >{{user.status}}</div>
    <!-- <button v-if="canFire">방장위임</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserData } from "../../../game/union/interface/RoomData";

@Component
export default class UserCard extends Vue {
  @Prop()
  private user!: UserData;
  @Prop()
  private isOwner!: boolean;
  @Prop()
  private canFire!: boolean;
}
</script>

<style scoped>
.ready_bar {
  width: 100%;
  height: 17px;
  font-weight: 600;
  color: black;
}
.character_preview {
  width: 100%;
  height: 60px;
  margin-top: 3px;
  background: #333333;
}
.character_idle_image {
  width: 30px;
  height: 30px;
  margin-top: 14px;
  image-rendering: pixelated;
}
.ban_button {
  width: 24px;
  height: 24px;
  padding: 2px;
  line-height: 2px;
  position: absolute;
  border-style: none;
  font-size: 1.1em;
  font-weight: 900;
  right: 2px;
  top: 0;
  background: none;
  filter: brightness(0) invert(1);
}
.crown_icon {
  width: 16px;
  height: 16px;
  position: absolute;
  border-radius: 11px;
  left: 3px;
  top: 2px;
  border-style: none;
  padding: 2px;
  background: darkred;
}
.user_card {
  border-radius: 6px;
  margin: 10px;
  width: 160px;
  height: 100px;
  background: #242424;
  display: inline-table;
  position: relative;
  -webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  overflow: hidden;
  color: white;
}
.blank {
  width: 100%;
  height: 0px;
  opacity: 0;
}
.display_name {
  height: 16px;
  width: 100%;
  font-weight: 600;
  font-size: 0.8em;
  padding-top: 4px;
}

@media screen and (min-width: 769px) {
  .character_preview {
    height: 90px;
    margin-top: 11px;
  }
  .character_idle_image {
    width: 50px;
    height: 50px;
    margin-top: 18px;
  }
  .user_card {
    width: 240px;
    height: 160px;
  }
  .ban_button {
    width: 32px;
    height: 32px;
    top: 2px;
  }
  .display_name {
    font-size: 1.2em;
    padding-top: 8px;
  }
  .crown_icon {
    width: 24px;
    height: 24px;
    border-radius: 22px;
    left: 4px;
    top: 4px;
  }
  .ready_bar {
    width: 100%;
    height: 35px;
    font-size: 1.5em;
    line-height: 35px;
  }
}
</style>