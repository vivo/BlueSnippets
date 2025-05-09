<template>
  <div id="app">
    <div class="header">AI你画我猜</div>
    <div class="padding-header">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
@import "~@/assets/main.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.padding-header {
  padding-top: 60px;
}

.header {
  width: 100vw;
  height: 60px;
  padding: 0 30px;
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  transition: 0.12s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  font-weight: 600;
  background: #ffffff;
}
</style>
