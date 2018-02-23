import MainMenu from "./MainMenu.vue";
import Play from "./Play";
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
	template: `
		<div id='app'>
			<component :is='view' class='view'/>
		</div>
	`,
	computed: {
		view() {
			return this.$store.state.view;
		}
	},
	data() {
		return {};
	}
};
