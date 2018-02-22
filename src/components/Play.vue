<template>
	<div id='play'>
		<Viewport></Viewport>
		<div class='frame-top'></div>
		<div class='frame-bottom'>
			<MiniMap></MiniMap>
		</div>
		<Overlay v-if='paused' @unpause='togglePause'/>
	</div>
</template>

<script>
	import Viewport from "./Viewport";
	import Overlay from "./Overlay.vue";
	import MiniMap from "./MiniMap"
	export default {
		name: "Play",
		components: {
			Viewport,
			Overlay,
			MiniMap
		},
		data() {
			return {
				paused: false,
				loops: 0
			};
		},
		mounted() {
			window.addEventListener('keyup', this.onKeyUp);
		},
		methods: {
			onKeyUp(e){
				if (e.which === 27) {
					this.togglePause();
				}
			},
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
