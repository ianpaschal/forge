<template>
	<div id='app'>
		{{ view }}
		<component :is='currentView' @switchView='switchView' class='view'>
			<!-- component changes when vm.currentView changes! -->
		</component>

	</div>
</template>

<script>
	const { dialog } = require( "electron" ).remote;
	import { remote } from "electron";

	import MainMenu from "./MainMenu.vue";
	import Play from "./Play.vue";
	import Plugins from "./Plugins.vue";
	import Preferences from "./Preferences.vue";

	export default {
		name: "Frame",
		components: {
			MainMenu,
			Play,
			Plugins,
			Preferences
		},
		computed: {
			view() {
				return this.$store.state.view;
			}
		},
		data: function() {
			return {
				currentView: "MainMenu"
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
			},
			switchView(view) {
				console.log("Switching to",view+".")
				this.currentView = view;
			}
		}
	};
</script>

<style>
	body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
	}
	#app {
		font-size: 11px;
		color: #fff;
		background-color: #212529;
	}
	.view {
		/* : flex;
		flex-direction: column; */
		height: 100%;
		width: 100%;
	}
</style>
