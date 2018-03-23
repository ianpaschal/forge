export default {
	name: "Podium",
	components: {},
	template: `
		<div class='podium'>
			<h1>{{entityType}}</h1>
			<h2>Player</h2>
			<div class='entity-icon'>

			</div>

			<div class='bar-display'>
				<div class='health-value left'>8888</div>
				<div class='health-bar'></div>
				<div class='health-value right'>8888</div>
			</div>


		</div>
	`,
	computed: {
		entity() {
			return this.$store.state.selection[ 0 ];
		},
		entityType() {
			if ( this.entity ) {
				return this.entity.getName();
			}
			return "None";
		}
	}
};
