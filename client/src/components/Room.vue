<template>
  <div class="full_page" :class="{'unVisible':unVisible}">
    <div>Show Title</div>
    <div>Select Character</div>
    <div>Show Users</div>
    <div>Ready</div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from 'vue-property-decorator';
import GameClient from '../../../game/client/class/GameClient';

@Component
export default class Room extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private gameClient!: GameClient;

  @Watch('unVisible')
  private setClient(): void {
    if (!this.unVisible) {
      this.create();
    } else {
      this.destory();
    }
  }

  private create(): void {
    console.log('create');
  }

  private destory(): void {
    console.log('destory');
  }
}
</script>

<style scoped>
.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 1.5s ease-in;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 1.5s ease-in;
}
</style>