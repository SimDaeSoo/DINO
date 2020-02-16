<template>
  <div class="login_page">
    <div class="login-form" :class="{'unVisible': unVisible}">
      <h1 class="no_drag">DINO</h1>
      <div class="form-field no_drag">
        <input
          type="text"
          class="form-field no_drag"
          pattern="^[a-zA-Z0-9_-]{1,16}$"
          placeholder=" "
          v-model="id"
          required
        />
        <label for="username no_drag">Insert Name</label>
      </div>
      <button class="btn no_drag" @click="tryLogin">Start</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  @Prop()
  private unVisible!: boolean;
  @Prop()
  private login!: (id: string) => void;
  private id: string = "";
  private lastDate!: number;

  private tryLogin(): void {
    if (this.unVisible || !this.id) {
      return;
    }
    if (!this.lastDate || Date.now() - 1500 > this.lastDate) {
      this.lastDate = Date.now();
      this.login(this.id);
    }
  }
}
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Lato);

.login_page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form.unVisible {
  transition: opacity 0.8s ease-in;
  opacity: 0;
}
.login-form {
  opacity: 1;
  transition: opacity 0.8s ease-in;
  font-family: Lato, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3em;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  box-shadow: 0 0.4px 0.6px rgba(0, 0, 0, 0.141),
    0 1px 1.3px rgba(0, 0, 0, 0.202), 0 1.9px 2.5px rgba(0, 0, 0, 0.25),
    0 3.4px 4.5px rgba(0, 0, 0, 0.298), 0 6.3px 8.4px rgba(0, 0, 0, 0.359),
    0 15px 20px rgba(0, 0, 0, 0.5);
}
.login-form h1 {
  margin: 0 0 1em 0;
  padding: 12px 0;
  font-size: 2.5em;
}
.login-form .form-field {
  position: relative;
  display: flex;
  align-items: center;
  padding: 4px 0 0 0;
  margin-bottom: 2em;
  font-size: 20px;
  border-bottom: 1px solid white;
  transition: 0.4s;
}
.login-form .form-field > * {
  padding-bottom: 0.5em;
}
.login-form .form-field::after {
  position: absolute;
  content: "";
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3498db;
  transform-origin: left;
  transform: scaleX(0);
  transition: 0.4s ease;
}
.login-form .form-field:focus-within::after {
  transform: scaleX(1);
}
.login-form .form-field input {
  z-index: 1;
  top: 4px;
  padding-top: 0;
  margin: 0;
  color: white;
  background: transparent;
  border: none;
  outline: none;
}
.login-form .form-field input:focus ~ label,
.login-form .form-field input:not(:placeholder-shown) ~ label {
  transform: translateY(-24px) scale(0.75);
}
.login-form .form-field input:valid ~ label {
  color: #3498db;
}
.login-form .form-field input:invalid ~ label {
  color: #aaaaaa;
}
.login-form .form-field label {
  position: absolute;
  left: 0px;
  transform-origin: left;
  transition: 0.4s;
}
.login-form .btn {
  position: relative;
  width: 100%;
  padding: 6px 0;
  margin: 0.5em 0 1em 0;
  font-size: 1.2em;
  color: white;
  background: transparent;
  border: 2px solid #3398db;
  outline: none;
  cursor: pointer;
  overflow: hidden;
  transition: 0.5s;
  border-radius: inherit;
}
.login-form .btn::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(51, 152, 219, 0.5),
    transparent
  );
  transform: translateX(-100%);
  transition: 0.5s;
}
.login-form .btn:hover {
  box-shadow: 0 0 20px 10px rgba(51, 152, 219, 0.5);
}
.login-form .btn:hover::before {
  transform: translateX(100%);
}
</style>