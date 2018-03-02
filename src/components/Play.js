import Viewport from "./Viewport";
import Overlay from "./Overlay.vue";
import MiniMap from "./MiniMap";
export default {
	name: "Play",
	components: {
		Viewport,
		Overlay,
		MiniMap
	},
	template: `
		<div id='play'>
			<Viewport></Viewport>



			<div class='frame-top'>
				<button @click='switchPlayer'>Cycle</button>
				{{playerName}}

			</div>
			<div class='frame-bottom'>
				<MiniMap></MiniMap>

				<p v-if='selection.length > 0'>{{selection[0]}}</p>
			</div>
			<Overlay v-if='paused' @unpause='togglePause'/>
		</div>
	`,
	data() {
		return {
			paused: false
		};
	},
	computed: {
		playerName() {
			return this.$store.state.player.name;
		},
		selection() {
			return this.$store.state.selection;
		}
	},
	mounted() {
		this.$store.dispatch( "switchPlayer", 1 );
		window.addEventListener( "keyup", this.onKeyUp );
		window.addEventListener( "keydown", this.onKeyDown );
	},
	methods: {
		onKeyDown( e ) {
			switch( e.which ) {
				case 65: // A
					this.$store.commit( "moveLeft", true );
					break;
				case 68: // D
					this.$store.commit( "moveRight", true );
					break;
				case 83: // S
					this.$store.commit( "moveBack", true );
					break;
				case 87: // W
					this.$store.commit( "moveForward", true );
					break;
			}
		},
		onKeyUp( e ) {
			switch( e.which ) {
				case 27: // ESC
					this.togglePause();
					break;
				case 65: // A
					this.$store.commit( "moveLeft", false );
					break;
				case 68: // D
					this.$store.commit( "moveRight", false );
					break;
				case 83: // S
					this.$store.commit( "moveBack", false );
					break;
				case 87: // W
					this.$store.commit( "moveForward", false );
					break;
			}
		},
		togglePause() {
			this.paused = !this.paused;
		},
		switchPlayer() {
			this.$store.dispatch( "switchPlayer" );
		}
	}
};
