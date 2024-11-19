<template>
    <us-article>
        <us-module biz="header">
            <AppHeader />
        </us-module>
        <us-module biz="body">
            <us-section biz="body">
                <HelloWorld msg="Vite + Vue" />
            </us-section>
        </us-module>
        <us-module biz="body">
            <us-section biz="body">
                <VueStartup />
            </us-section>
        </us-module>
        <us-module biz="footer">
            <AppFooter />
        </us-module>
    </us-article>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import HelloWorld from './components/HelloWorld.vue'
import VueStartup from './components/VueStartup.vue'
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
