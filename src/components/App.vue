<template>
	<div id='app'>
		<component :is='view' class='view'/>
	</div>
</template>

<script>
	import MainMenu from "./MainMenu.vue";
	import Play from "./Play.vue";
	import Plugins from "./Plugins.vue";
	import Preferences from "./Preferences.vue";

	export default {
		name: "App",
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
			return {};
		}
	};
</script>

<style>
	#app {
		font-size: 11px;
		color: #fff;
		background-color: #212529;
	}
	.view {
		position: absolute;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
