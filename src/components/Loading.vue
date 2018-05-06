<template>
	<div id='loading'>
		<h1>Loading... {{loaded}}</h1>
	</div>
</template>

<script>
export default {
	name: "Loading",
	computed: {
		loaded() {
			return this.$store.state.loaded;
		}
	}
};
</script>

<style></style>
