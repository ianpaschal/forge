// Forge is distributed under the MIT license.

import Vue from "vue";
import store from "./store";
import App from "./components/App.vue";

window.onload = () => {
	new Vue({
		el: "#vue-wrapper",
		store: store,
		data: {
			windowWidth: 0,
			windowHeight: 0
		},
		render: ( h ) => h( App ),
		beforeMount() {
			window.addEventListener( "resize", this.getWindowWidth );
			window.addEventListener( "resize", this.getWindowHeight );
		},
		mounted: function() {
			this.$nextTick( function() {
				const keyboardEvents = [ "keydown", "keyup" ];
				for ( const event of keyboardEvents ) {
					window.addEventListener( event, this.handleKeyboard, false );
				}
			});
			// this.$store.dispatch( "buildLoadStack" );
		},
		beforeDestroy() {
			window.removeEventListener( "resize", this.getWindowWidth );
			window.removeEventListener( "resize", this.getWindowHeight );
		},
		methods: {
			getWindowWidth() {
				this.windowWidth = document.documentElement.clientWidth;
			},
			getWindowHeight() {
				this.windowHeight = document.documentElement.clientHeight;
			},
			handleKeyboard( e ) {
				console.log( e.which );
				return;
			}
		}
	});
};

// init( stack, world, onProgress, onFinished ) {
// 	// Compute total length:
// 	let length = 0;
// 	let loaded = 0;
// 	for ( const section in stack ) {
// 		length += Object.keys( stack[ section ] ).length;
// 	}
// 	if ( world ) {
// 		length += Object.keys( world.entities ).length;
// 	}
// 	function updateProgress( itemName ) {
// 		loaded++;
// 		onProgress( ( loaded / length ) * 100, "Loaded " + itemName );
// 	}
// 	function onLoadComplete() {
//
// 		// Systems must be intialized after loading so they can use assets:
// 		// this.registerSystem( graphicsSystem );
// 		this.registerSystem( terrainSystem );
// 		this.registerSystem( productionSystem );
// 		this.registerSystem( movementSystem );
// 		// this.registerSystem( visibilitySystem );
//
// 		// this._world = new World();
// 		// this._world.setTime( 0 );
//
// 		// If no source is provided, generate a new world:
// 		if ( !world ) {
// 			console.warn( "World is missing, a new one will be generated!" );
// 			this.testPopulateWorld( 4, updateProgress, onFinished );
// 		}
// 		else {
// 			this.loadWorld( world, updateProgress, onFinished );
// 		}
// 	}
//
// 	// Load assets. On finished, start the world loading/generation routine:
// 	// onProgress is called when an asset is loaded and passed the
// 	if ( stack.length > 0 ) {
// 		console.log( "Going to load stuff" );
// 		this.loadAssets( stack, updateProgress, onLoadComplete.bind( this ) );
// 	}
// 	else {
// 		onLoadComplete.bind( this )();
// 	}
// }
