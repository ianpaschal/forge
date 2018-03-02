// Forge is distributed under the MIT license.
import Vue from "vue";
import Vuex from "vuex";

// The two main data sources, the game engine and UI store:
import engine from "./engine";
import store from "./store";

// Components:
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
		},
		beforeDestroy() {
			window.removeEventListener( "resize", this.getWindowWidth );
			window.removeEventListener( "resize", this.getWindowHeight );
		},
		methods: {
			getWindowWidth( e ) {
				this.windowWidth = document.documentElement.clientWidth;
			},
			getWindowHeight( e ) {
				this.windowHeight = document.documentElement.clientHeight;
			},
			handleKeyboard( e ) {
				return;
			}
		}
	});
};
