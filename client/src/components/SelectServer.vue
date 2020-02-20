<template>
  <div class="full_page" :class="{'unVisible':unVisible}">
    <CreateServer :create="tryCreate"/>
    <RoomCard v-for="(room) in rooms" :key="room.id + room.address" :room="room" :join="join"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RoomData } from '../../../game/union/interface/RoomData';
import RoomCard from './RoomCard.vue';
import CreateServer from './CreateServer.vue';

@Component({
  components: { RoomCard, CreateServer },
})
export default class SelectServer extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private rooms!: RoomData[];
  @Prop()
  private join!: (addres: string, id: number) => void;
  @Prop()
  private create!: () => void;
  private lastDate!: number;

  private tryCreate(): void {
    if (this.unVisible) { return; }
    if (!this.lastDate || Date.now() - 2000 > this.lastDate) {
      this.lastDate = Date.now();
      this.create();
    }
  }
}
</script>

<style scoped>
.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.8s ease-in;
  text-align: center;
  overflow-y: auto;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 0.8s ease-in;
}
</style>