<template>
	<div id='play'>
		<Viewport></Viewport>
		<div class='frame-top'></div>
		<div class='frame-bottom'></div>
		<Overlay v-if='paused' @unpause='togglePause'/>
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
				this.paused = !this.paused;
			}
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
