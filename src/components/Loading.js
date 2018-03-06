import FS from "fs";
import Path from "path";
import engine from "../engine";
var { app } = require( "electron" ).remote;

export default {
	name: "Loading",
	components: {},
	template: `
		<div id='loading'>
			<h1>Loading... {{loaded}}</h1>
		</div>
	`,
	computed: {
		loaded() {
			return this.$store.state.loaded;
		}
	},
	mounted() {
	},
	methods: {

	}
};
