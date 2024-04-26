<template>
	<div id="app" class="app">
		<!-- should be transformed into :onChange="() => {}" -->
		<swiper @change="() => {}" class="container">hello world</swiper>
	</div>
</template>

<script>
export default {
	name: 'App',
	mounted() {
		// should be transformed into `document.parentNode`
		console.log(document.parentElement)
	}
}
</script>

<style lang="scss">
.app {
	color: green; // color's value should be transformed to red
}

.container {
	color: blue; // color's value should be transformed to red
}
</style>
