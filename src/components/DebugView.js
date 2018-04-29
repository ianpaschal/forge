export default {
	name: "DebugView",
	components: {},
	template: `
		<div id='debug-view'>
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
