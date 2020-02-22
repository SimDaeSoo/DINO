<template>
  <div class="full_page" :class="{'unVisible':unVisible}">
    <Counter v-if="showCount" :count="count" :countDown="countDown"/>

    <RoomTitle :title="roomData.name" :id="roomData.id" />
    <div class="user_slot" :class="{'deleted_footer': (myUserData && myUserData.status === 'READY')}">
      <UserCard
        v-for="(user, index) in roomData.members"
        :key="`${user.id}index${index}`"
        :user="user"
        :isOwner="user.id === roomData.owner"
        :canFire="user.id !== gameClient.socket.id && roomData.owner === gameClient.socket.id"
        :ban="ban"
      />
      <EmptyUserCard v-for="(data,index) in emptyRoomData" :key="index" />
    </div>

    <RoomFooter :exit="exit" :gameClient="gameClient" :user="myUserData" :characters="characters" />
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import GameClient from "../../../game/client/class/GameClient";
import { RoomData, ROOM_STATUS } from "../../../game/union/interface/RoomData";
import { RoomUserData } from "../../../game/union/interface/RoomUserData";
import { RoomCharacterData } from "../../../game/union/interface/RoomCharacterData";
import Counter from "./Counter.vue";
import UserCard from "./UserCard.vue";
import EmptyUserCard from "./EmptyUserCard.vue";
import RoomTitle from "./RoomTitle.vue";
import RoomFooter from "./RoomFooter.vue";
import Characters from "../../../game/union/data/character";

@Component({
  components: { UserCard, RoomTitle, RoomFooter, EmptyUserCard, Counter },
})
export default class Room extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private gameClient!: GameClient;
  @Prop()
  private exit!: () => void;
  @Prop()
  private gameStart!: () => void;
  private count: number = 0;
  private showCount: boolean = false;
  private countDown: boolean = false;
  private roomData: RoomData = {
    id: 0,
    name: "",
    members: [],
    maxMembers: 0,
    playTime: 0,
    owner: "",
    address: "",
    status: ROOM_STATUS.WAIT,
    seed: '',
  };

  @Watch("unVisible")
  private setClient(): void {
    if (!this.unVisible) {
      this.create();
    } else {
      this.destory();
    }
  }

  private get myUserData(): RoomUserData {
    let user!: RoomUserData;

    this.roomData.members.forEach((member: RoomUserData): void => {
      if (member.id === this.gameClient.socket.id) {
        user = member;
      }
    });

    return user;
  }

  private counting(index: number): void {
    this.count = index;
    this.showCount = true;
    setTimeout((): void => { this.countDown = true; }, 100);
    setTimeout((): void => {
      this.countDown = this.showCount = false;
    }, 800);
  }

  private create(): void {
    this.gameClient.socket.on("getRoomData", this.getRoomData.bind(this));
    this.gameClient.socket.on("startCounting", this.counting.bind(this));
    this.gameClient.socket.on("startGame", this.start.bind(this));
  }

  private destory(): void {
    this.gameClient.socket.off("getRoomData");
    this.gameClient.socket.off("startCounting");
    this.gameClient.socket.off("startGame");
  }

  private getRoomData(roomData: RoomData): void {
    Vue.set(this, "roomData", roomData);
  }

  private get emptyRoomData(): number[] {
    const result: number[] = [];

    for (
      let i = 0;
      i < this.roomData.maxMembers - this.roomData.members.length;
      i++
    ) {
      result.push(i);
    }

    return result;
  }

  private ban(banID: string): void {
    this.gameClient.socket.emit("ban", banID);
  }

  private get characters(): RoomCharacterData[] {
    const result: RoomCharacterData[] = [];

    for (const key of Object.keys(Characters)) {
      result.push(Characters[key]);
    }

    return result;
  }

  private start(): void {
    this.destory();
    this.gameStart();
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
.user_slot.deleted_footer {
  max-height: calc(100% - 76px);
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
</style>