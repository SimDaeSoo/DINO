<template>
  <div id="app">
    <div class="game_canvas" v-if="gameStarted"/>
    <Loader v-if="!gameStarted && isLoading" :unVisible="loaderUnVisible"/>
    <Login v-if="!gameStarted && loaderUnVisible" :unVisible="isLoading" :login="tryLogin"/>
    <notifications position="top left" group="notification"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loader from './components/Loader.vue';
import Login from './components/Login.vue';
import GameLayer from './components/GameLayer.vue';
import GameClient from '../../game/client/class/GameClient';

@Component({
  components: { Loader, Login },
})
export default class App extends Vue {
  private loaderUnVisible: boolean = false;
  private isLoading: boolean = true;
  private gameStarted: boolean = false;
  private gameClient!: GameClient;

  private mounted() {
    const socketURL: string = 'http://10.33.0.18:1234';
    this.gameClient = new GameClient();
    this.gameClient.connect(socketURL, {
      login: () => { this.gameStarted = true; },
      connect: this.notifyConnection.bind(this),
      disconnect: this.notifyDisconnection.bind(this),
    });
  }

  private tryLogin(id: string): void {
    this.gameClient.tryLogin(id);
  }

  private notifyDisconnection(): void {
    this.isLoading = true;
    this.gameStarted = false;
    this.$notify({
      group: 'notification', title: 'System Message -', type: 'error',
      text: `Server is disconeccted<br>${new Date().toUTCString()}`,
      duration: 2000,
    });
    setTimeout(() => { this.loaderUnVisible = false; }, 2000);
  }

  private notifyConnection(): void {
    this.loaderUnVisible = true;
    this.$notify({
      group: 'notification', title: 'System Message -', type: 'success',
      text: `Server connection is successed<br>${new Date().toUTCString()}`,
      duration: 2000,
    });
    setTimeout(() => { this.isLoading = false; }, 2000);
  }
}
</script>

<style scoped>
.game_canvas {
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle farthest-corner at center,
    #3c4b57 0%,
    #1c262b 100%
  );
}
</style>