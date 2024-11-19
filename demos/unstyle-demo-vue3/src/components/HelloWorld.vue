<template>
    <h1>{{ msg }}</h1>

    <div class="card">
        <button type="button" @click="count++">count is {{ count }}</button>
        <p>
            Edit
            <code>components/HelloWorld.vue</code> to test HMR
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<style scoped lang="scss">
h1 {
    font-size: 24px;
}
button {
    border-radius: 4px;
    border: 1px solid transparent;
    padding: 6px 10px;
    margin: 20px 0;
    font-family: inherit;
    background-color: #333;
    cursor: pointer;
    transition: background-color 0.1s;
    color: #fff;
}
button:hover {
    background-color: #000;
}
button:focus,
button:focus-visible {
    outline: none;
}
</style>
