<template>
  <div class="footer">
    <div class="character_list ">
      <div class="character_card no_drag">Hello</div>
    </div>

    <div class="button_wrap">
      <button class="half no_drag">Exit</button>
      <button class="half no_drag">Ready</button>
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
button {
  width: calc(50% - 6px);
  height: 30px;
  border-radius: 5px;
  background: white;
  margin: 3px;
  font-size: 1.2em;
}

.character_list {
  height: 120px;
  margin: 3px;
  border-radius: 5px;
  background: white;
}

.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
}

@media screen and (min-width: 769px) {
  .footer {
    max-width: 1024px;
  }
}
</style>