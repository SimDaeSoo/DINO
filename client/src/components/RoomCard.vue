<template>
  <div class="card">
    <dl>
      <dt class="id">
        <img class="flag_icon" src="../assets/flag.png">
        <span class="id_string">{{room.id}}</span>
      </dt>
      <dt class="title">{{room.name}}</dt>
      <dd>
        <span class="left">
          <img class="user_icon" src="../assets/user.png">
          <span class="user_status">{{room.currentUser}} / {{room.maximumUser}}</span>
        </span>
        <span></span>
        <span class="right">
          <div class="clock">
            <img class="clock_icon" src="../assets/clock.png">
            <span class="clock_status">{{timestamp}}</span>
          </div>
        </span>
      </dd>
    </dl>
    <button class="join" @click="tryJoin">Join</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RoomData } from '../../../game/union/interface/RoomData';

@Component
export default class RoomCard extends Vue {
  @Prop()
  private room!: RoomData;
  @Prop()
  private create?: boolean;
  @Prop()
  private join!: (addres: string, room: string) => void;

  private get timestamp(): string {
    const playTime: number = Number(this.room.playTime);
    let seconds: string = (Math.floor(playTime / 1000) % 60).toString();
    let minutes: string = (Math.floor((playTime / 1000) / 60) % 60).toString();
    let hours: string = (Math.floor(((playTime / 1000) / 60) / 60) % 24).toString();

    if (Number(minutes) < 10) {
      minutes = '0' + minutes;
    }

    if (Number(seconds) < 10) {
      seconds = '0' + seconds;
    }

    if (Number(hours) < 10) {
      hours = '0' + hours;
    }

    return `${hours}:${minutes}:${seconds}`;
  }

  private tryJoin(): void {
    this.join(this.room.address, this.room.name);
  }
}
</script>

<style scoped>
.id {
  position: absolute;
  top: -8px;
  left: -121px;
}
.id_string {
  text-align: center;
  width: 30px;
  top: 20px;
  left: 120px;
  position: absolute;
  font-size: 1em;
}
.flag_icon {
  width: 50px;
  height: 50px;
}
.clock {
  display: flex;
}
.user_icon {
  width: 35px;
  height: 35px;
  position: absolute;
  top: -9px;
  left: 0px;
  filter: brightness(0) invert(1);
}
.clock_icon {
  width: 18px;
  height: 18px;
  padding-right: 6px;
  filter: brightness(0) invert(1);
}
.clock_status {
  margin-top: 1px;
  padding-right: 6px;
}
.user_status {
  position: absolute;
  left: 30px;
  top: 1px;
}
dl {
  margin: 5px;
  text-align: center;
}
dd {
  padding-top: 8px;
  padding-bottom: 1px;
  margin: 0;
  height: 20px;
}
dt {
  width: 90%;
  padding-top: 3px;
  margin: auto;
}
.left {
  position: absolute;
  left: 10px;
  width: 300px;
}
.right {
  position: absolute;
  right: 10px;
}
.title {
  font-size: 1.6em;
}
.card {
  color: white;
  text-align: center;
  background: linear-gradient(45deg, black, transparent);
  border-radius: 4px;
  display: inline-block;
  height: 110px;
  margin: 1rem;
  position: relative;
  width: 300px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

button.join {
  width: 90%;
  font-size: 1.2em;
  border-radius: 4px;
  background: #ffffff;
}
</style>