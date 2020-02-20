<template>
  <div class="full_page" :class="{'unVisible':unVisible}">this is a game canvas</div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import GameClient from "../../../game/client/class/GameClient";

@Component
export default class GameCanvas extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private gameClient!: GameClient;

  @Watch("unVisible")
  private setClient(): void {
    if (!this.unVisible) {
      this.create();
    } else {
      this.destory();
    }
  }

  private create(): void {
  }

  private destory(): void {
  }
}
</script>

<style scoped>
.full_page {
  width: 100%;
  height: 100%;
  opacity: 1;
  transition: opacity 0.8s ease-in;
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 0.8s ease-in;
}
</style>