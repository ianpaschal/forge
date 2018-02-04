<template>
	<div id='app'>

		<div class='frame-top'>
			Resources
			Controls
		</div>

		<Viewport></Viewport>

		<div class='frame-bottom'>
			Controls go here.
		</div>

	</div>
</template>

<script>
	const { dialog } = require( "electron" ).remote;
	import Viewport from "./Viewport.vue";
	import Sidebar from "./Sidebar";
	export default {
		name: "Frame",
		components: {
			Viewport,
			Sidebar
		},
		data: function() {
			return {
				// iconPath: "../assets/svg/icon-import.svg"
			};
		},
		methods: {

			loadFile() {
			/*
				const paths = dialog.showOpenDialog({
					defaultPath: "/Users/Ian/Desktop",
					buttonLabel: "Import",
					properties: [ "openFile", "openDirectory", "multiSelections" ],
					filters: [
						{ name: "Custom File Type", extensions: [ "obj", "stl" ] }
					]
				});
				this.$store.dispatch( "loadFile", paths[ 0 ] );
			*/
			}
		}
	};
</script>

<style>
	#app {
		display: flex;
		flex-direction: column;
		font-size: 11px;
	}
	.frame-top {
		height: 48px;
	}

	.frame-bottom {
		height: 192px;
		border-top: 1px solid var(--edge-accent-dark);
	}
</style>
