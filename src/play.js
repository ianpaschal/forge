// Forge is distributed under the MIT license.

import Vue from "vue";
import store from "./store";
import App from "./components/App";

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
