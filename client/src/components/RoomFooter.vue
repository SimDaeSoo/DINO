<template>
  <div class="footer">
    <div class="character_list">
      <div class="character_card">Hello</div>
    </div>

    <div class="button_wrap">
      <button>Exit</button>
      <button>Ready</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class RoomFooter extends Vue {
}
</script>

<style scoped>
.room_title {
  width: 100%;
  height: 40px;
  background: cadetblue;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
}

.character_list {
  height: 120px;
  margin: auto;
  background: white;
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

@media screen and (min-width: 769px) {
  .footer {
    max-width: 1024px;
  }
}
</style>