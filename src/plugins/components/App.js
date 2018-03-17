import MainMenu from "./MainMenu.vue";
import Play from "./Play";
import Plugins from "./Plugins.vue";
import Preferences from "./Preferences.vue";
import Loading from "./Loading";
export default {
	name: "App",
	components: {
		MainMenu,
		Play,
		Plugins,
		Preferences,
		Loading
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
