<template>
    <us-article id="app">
        <us-module biz="header">
            <app-header />
        </us-module>
        <us-module biz="body">
            <us-section biz="body">
                <hello-world msg="Welcome to Your Vue.js App"/>
            </us-section>
        </us-module>
        <us-module biz="body">
            <us-section biz="body">
                <vue-startup />
            </us-section>
        </us-module>
        <us-module biz="footer">
            <app-footer />
        </us-module>
    </us-article>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import HelloWorld from './components/HelloWorld.vue';
import VueStartup from '@/components/VueStartup.vue';

export default {
    name: 'App',
    components: {
        AppHeader,
        AppFooter,
        HelloWorld,
        VueStartup,
    }
}
</script>

<style>
</style>
