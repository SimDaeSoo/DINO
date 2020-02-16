<template>
  <div class="full_page" :class="{'unVisible':unVisible}">
    <RoomTitle :title="roomData.name" :id="roomData.id"/>
    <div class="user_slot">
      <UserCard
        v-for="(user, index) in roomData.members"
        :key="`${user.id}index${index}`"
        :user="user"
        :isOwner="user.id === roomData.owner"
        :canFire="user.id !== gameClient.socket.id && roomData.owner === gameClient.socket.id"
      />
      <EmptyUserCard v-for="(data,index) in emptyRoomData" :key="index"/>
    </div>

    <RoomFooter/>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import GameClient from '../../../game/client/class/GameClient';
import { RoomData, ROOM_STATUS, UserData } from '../../../game/union/interface/RoomData';
import UserCard from './UserCard.vue';
import EmptyUserCard from './EmptyUserCard.vue';
import RoomTitle from './RoomTitle.vue';
import RoomFooter from './RoomFooter.vue';

@Component({
  components: { UserCard, RoomTitle, RoomFooter, EmptyUserCard },
})
export default class Room extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private gameClient!: GameClient;
  private roomData: RoomData = {
    id: 0, name: '',
    members: [], maxMembers: 0,
    playTime: 0,
    owner: '',
    address: '',
    status: ROOM_STATUS.WAIT,
  };

  @Watch('unVisible')
  private setClient(): void {
    if (!this.unVisible) {
      this.create();
    } else {
      this.destory();
    }
  }

  private create(): void {
    this.gameClient.socket.on('getRoomData', this.getRoomData.bind(this));
  }

  private destory(): void {
    this.gameClient.socket.off('getRoomData');
  }

  private getRoomData(roomData: RoomData): void {
    Vue.set(this, 'roomData', roomData);
  }

  private get emptyRoomData(): number[] {
    const result: number[] = [];

    for (let i = 0; i < this.roomData.maxMembers - this.roomData.members.length; i++) {
      result.push(i);
    }

    return result;
  }
}
</script>

<style scoped>
.user_slot {
  display: inline-block;
  overflow-y: auto;
  margin-top: 40px;
  max-height: calc(100% - 196px);
}

.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.8s ease-in;
  text-align: center;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 0.8s ease-in;
}

@media screen and (min-width: 769px) {
  .user_slot {
    max-width: 1024px;
  }
  .footer {
    max-width: 1024px;
  }
}
</style>