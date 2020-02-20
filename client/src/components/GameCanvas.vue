<template>
  <div class="full_page" :class="{'unVisible':unVisible}" ref="canvas"></div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import GameClient from "../../../game/client/class/GameClient";
import GameRenderer from "../../../game/client/class/GameRenderer";

@Component
export default class GameCanvas extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private gameClient!: GameClient;
  private gameRenderer!: GameRenderer;

  @Watch("unVisible")
  private setClient(): void {
    if (!this.unVisible) {
      this.create();
    } else {
      this.destory();
    }
  }

  private create(): void {
    this.gameRenderer = new GameRenderer();
    this.gameRenderer.initialize({ el: this.$refs.canvas as HTMLElement });
  }

  private destory(): void {
    if (this.gameRenderer) {
      this.gameRenderer.destroy();
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
}
.full_page.unVisible {
  opacity: 0;
  transition: opacity 0.8s ease-in;
}
</style>