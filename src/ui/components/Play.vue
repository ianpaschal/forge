<template>
	<div id='play'>
		<Viewport></Viewport>
		<div class='frame-top'></div>
		<div class='frame-bottom'></div>
		<Overlay v-if='paused' @switchView='switchView' />
	</div>
</template>

<script>
	import Viewport from "./Viewport.vue";
	import Overlay from "./Overlay.vue";
	// import forge from "../../forge";
	export default {
		name: "Play",
		components: {
			Viewport,
			Overlay
		},
		data() {
			return {
				paused: false,
				loops: 0
			};
		},
		mounted() {
			window.addEventListener('keyup', this.togglePause);
		},
		methods: {
			togglePause() {
				console.log("PAUSING");
				this.paused = !this.paused;
			}
		},
		switchView(arg) {
			console.log(arg)
			this.$emit("switchView", arg )
		}
	};
</script>

<style>
	.frame-top {
		height: 32px;
		width: 100%;
		position: absolute;
		top: 0;
		background-color: black;
		color: #FFF;
	}
	.frame-bottom {
		height: 192px;
		width: 100%;
		position: absolute;
		bottom: 0;
		background-color: black;
		color: #FFF;
	}
</style>
