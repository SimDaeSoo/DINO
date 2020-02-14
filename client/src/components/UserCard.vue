<template>
  <div class="user_card">
    <div class="character_preview"></div>
    <div>{{isOwner}}</div>
    <div class="display_name">{{user.displayName}}</div>
    <div class="status">{{user.status}}</div>
    <div class="slot_button_wrap" v-if="canFire">
      <button>강퇴</button>
      <button>방장위임</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { UserData } from '../../../game/union/interface/RoomData';

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
.user_card {
  margin: 10px;
  width: 160px;
  height: 100px;
  background: white;
  display: inline-table;
}

@media screen and (min-width: 769px) {
  .user_card {
    width: 240px;
    height: 160px;
  }
}
</style>