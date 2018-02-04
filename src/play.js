/*
	Description

	Forge is distributed under the MIT license.
*/
import Vue from "vue";
import Vuex from "vuex";
import Engine from "./core/Engine";

// UI state store:
import store from "./ui/store";

// Components:
import Frame from "./ui/components/Frame.vue";

let app;
window.onload = function() {
	app = new Engine();
	new Vue({
		el: "#vue-wrapper",
		store: store,
		data: function() {
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

				app.load();
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
