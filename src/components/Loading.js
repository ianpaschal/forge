export default {
	name: "Loading",
	components: {},
	template: `
		<div id='loading'>
			<h1>Loading...</h1>
		</div>
	`,
	data() {
		return {
			paused: false,
			loops: 0
		};
	},
	computed: {
		playerName() {
			return this.$store.state.player.name;
		}
	},
	mounted() {
	},
	methods: {

	}
};
