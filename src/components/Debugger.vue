<!-- Forge source code is distributed under the MIT license. -->

<template>
	<div id='debug-view'>
	</div>
</template>

<script>
export default {
	name: "Debugger",
	components: {},
	computed: {
		view() {
			return this.$store.state.view;
		}
	},
	data() {
		return {};
	}
};
</script>

<style></style>
