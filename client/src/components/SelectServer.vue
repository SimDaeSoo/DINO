<template>
  <div class="full_page" :class="{'unVisible':unVisible}">
    <CreateServer/>
    <RoomCard v-for="(room) in rooms" :key="room.id + room.address" :room="room"/>
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
}
</script>

<style scoped>
.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 1.5s ease-in;
  text-align: center;
  overflow-y: scroll;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 1.5s ease-in;
}
</style>