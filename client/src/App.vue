<template>
  <div id="app">
    <Loader v-if="visibleState('LOADING')" :unVisible="opacityState('LOADING')" />
    <Login v-if="visibleState('LOGIN')" :unVisible="opacityState('LOGIN')" :login="setDisplayName" />
    <SelectServer
      v-if="visibleState('SELECT_SERVER')"
      :unVisible="opacityState('SELECT_SERVER')"
      :rooms="rooms"
      :join="join"
      :create="create"
    />
    <Room
      v-if="visibleState('SELECTED_SERVER')"
      :unVisible="opacityState('SELECTED_SERVER')"
      :gameClient="gameClient"
      :exit="exitRoom"
      :gameStart="gameStart"
    />
    <GameCanvas v-if="visibleState('START_GAME')" :unVisible="opacityState('START_GAME')" :gameClient="gameClient"/>
    <div class="resize_container" v-if="showResizeContainer"></div>
    <notifications position="top left" group="notification" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loader from './components/Loader.vue';
import Login from './components/Login.vue';
import SelectServer from './components/SelectServer.vue';
import Room from './components/Room.vue';
import GameCanvas from './components/GameCanvas.vue';
import GameClient from '../../game/client/class/GameClient';
import { MAIN_STATE } from '../../game/client/interface/MainState';
import Dictionary from '../../game/union/interface/Dictionary';
import SocketServerData from '../../game/union/interface/SocketServerData';
import { RoomData } from '../../game/union/interface/RoomData';

@Component({
  components: { Loader, Login, SelectServer, Room, GameCanvas },
})
export default class App extends Vue {
  private state: Dictionary<MAIN_STATE> = { current: MAIN_STATE.WAIT, next: MAIN_STATE.WAIT };
  private gameClient!: GameClient;
  private servers: SocketServerData[] = [];
  private displayName: string = '';
  private showResizeContainer: boolean = false;
  private resizeDetect(): void {
    this.$notify({
      group: 'notification', title: 'Resize',
      duration: 2000,
    });
    setTimeout(() => { this.showResizeContainer = true; }, 300);
    setTimeout(() => { this.showResizeContainer = false; }, 600);
  }

  private mounted() {
    this.gameClient = new GameClient();
    this.connectMaster();
    this.changeState(MAIN_STATE.LOADING);
    window.addEventListener('resize', this.resizeDetect);
  }

  private beforeDestroyed() {
    window.removeEventListener('resize', this.resizeDetect);
  }

  private connectMaster() {
    const masterIP: string = '13.209.124.232';
    // const masterIP: string = 'localhost';
    const address: string = `http://${masterIP}:3000`;
    this.gameClient.connect(address, {
      connect: this.connect.bind(this),
      disconnect: this.disconnect.bind(this),
      setServers: this.setServers.bind(this),
      join: this.join.bind(this),
    });
    this.gameClient.setMasterListener();
  }

  private disconnect(): void {
    this.gameClient.disconnect();
    this.connectMaster();
    this.changeState(MAIN_STATE.LOADING);
    this.$notify({
      group: 'notification', title: 'System Message -', type: 'error',
      text: `Server is disconeccted<br>${new Date().toUTCString()}`,
      duration: 2000,
    });
  }

  private connect(): void {
    if (this.displayName) {
      this.changeState(MAIN_STATE.SELECT_SERVER);
    } else {
      this.changeState(MAIN_STATE.LOGIN);
    }
    this.$notify({
      group: 'notification', title: 'System Message -', type: 'success',
      text: `Server connection is successed<br>${new Date().toUTCString()}`,
      duration: 2000,
    });
  }

  private create(): void {
    this.gameClient.createRoom(`${this.displayName}님의 게임`);
  }

  private join(address: string, id: number): void {
    if (this.state.next === MAIN_STATE.SELECTED_SERVER) {
      return;
    }
    this.gameClient.disconnect();
    this.gameClient.connect(address, {
      connect: (): void => {
        this.changeState(MAIN_STATE.SELECTED_SERVER);
        this.gameClient.join(id);
      },
      disconnect: this.disconnect.bind(this),
    });
  }

  private exitRoom(): void {
    this.gameClient.disconnect();
    this.connectMaster();
  }

  private setServers(servers: SocketServerData[]): void {
    this.servers.splice(0, this.servers.length);
    servers.forEach((server): void => {
      this.servers.push(server);
    });
  }

  private visibleState(state: MAIN_STATE): boolean {
    return this.state.current === state || this.state.next === state;
  }

  private opacityState(state: MAIN_STATE): boolean {
    return (this.state.current !== state || this.state.next !== state);
  }

  private changeState(state: MAIN_STATE): void {
    this.state.next = state;
    setTimeout(() => { this.state.current = state; }, 1000);
  }

  private setDisplayName(name: string): void {
    this.displayName = name;
    this.gameClient.setDisplayName(name);
    this.changeState(MAIN_STATE.SELECT_SERVER);
  }

  private get rooms(): RoomData[] {
    return this.servers.reduce((acc: RoomData[], current: SocketServerData): RoomData[] => {
      return acc.concat(current.rooms);
    }, []);
  }

  private gameStart(): void {
      this.changeState(MAIN_STATE.START_GAME);
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle farthest-corner at center,
    #3c4b57 0%,
    #1c262b 100%
  );
}

.resize_container {
  width: 100%;
  height: 100%;
}
</style>