<!-- Forge source code is distributed under the MIT license. -->

<template>
	<div id='app'>
		<component :is='view' class='view'/>
	</div>
</template>

<script>
import MainMenu from "./MainMenu.vue";
import NetworkConnect from "./NetworkConnect.vue";
import Play from "./Play";
import Plugins from "./Plugins.vue";
import Preferences from "./Preferences.vue";
import Loading from "./Loading";
export default {
	name: "App",
	components: {
		MainMenu,
		NetworkConnect,
		Play,
		Plugins,
		Preferences,
		Loading
	},
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

<style scoped></style>
