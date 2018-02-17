/*
	Forge is distributed under the MIT license.
*/
import Vue from "vue";
import Vuex from "vuex";

// The two main data sources, the game engine and UI store:
import forge from "./forge";
import store from "./ui/store";

// Components:
import Frame from "./ui/components/Frame.vue";

window.onload = () => {
	new Vue({
		el: "#vue-wrapper",
		store: store,
		data() {
			return {
				windowWidth: 0,
				windowHeight: 0
			};
		},
		render: ( h ) => h( Frame ),
		beforeMount() {
			window.addEventListener( "resize", this.getWindowWidth );
			window.addEventListener( "resize", this.getWindowHeight );
		},
		mounted: function() {
			this.$nextTick( function() {
				const keyboardEvents = [ "keydown", "keyup" ];
				for ( const event of keyboardEvents ) {
					// window.addEventListener( event, handleKeyboard, false );
				}
				// forge.load();
				forge.createEntity( "greek-villager-female" );
			});
		},
		beforeDestroy() {
			window.removeEventListener( "resize", this.getWindowWidth );
			window.removeEventListener( "resize", this.getWindowHeight );
		},
		methods: {
			getWindowWidth: function( e ) {
				this.windowWidth = document.documentElement.clientWidth;
			},
			getWindowHeight: function( e ) {
				this.windowHeight = document.documentElement.clientHeight;
			}
		}
	});
};
