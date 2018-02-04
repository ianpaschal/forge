export default {
	name: "Sidebar",
	components: {},
	template: `
		<div class='sidebar'>
			<p>Set Slice Thickness</p>
			<button @click='click(0.5)'>0.5</button>
			<button @click='click(1.0)'>1.0</button>
			<button @click='click(1.5)'>1.5</button>
			<button @click='click(2.0)'>2.0</button>
		</div>
	`,
	data: function() {
		return {};
	},
	methods: {
		click( value ) {
			// this.$store.dispatch( "setThickness", value );
			return value;
		}
	}
};
