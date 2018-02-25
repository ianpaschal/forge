// Forge is distributed under the MIT license.

import Vue from "vue";
import Vuex from "vuex";
import FS from "fs";
import Path from "path";
import * as Three from "three";
import forge from "../forge";

Vue.use( Vuex );
Vue.util.defineReactive( forge, "loaded", 0 );
const store = new Vuex.Store({
	state: {
		loaded: forge.loaded,
		view: "MainMenu",
		camera: undefined,
		activePlayerID: 1,
		moveLeft: false,
		moveRight: false,
		moveForward: false,
		moveBack: false,
		player: {
			name: "None"
		},
		activePlayerID: 1
	},
	getters: {},
	mutations: {
		view( state, view ) {
			const sfx = new Audio( "../resources/sounds/menu-select.wav" );
			sfx.volume = 0.1;
			sfx.play();
			state.view = view;
		},
		camera( state, camera ) {
			state.camera = camera;
		},
		cameraRig( state, cameraRig ) {
			state.cameraRig = cameraRig;
		},
		moveLeft( state, bool ) {
			state.moveLeft = bool;
		},
		moveRight( state, bool ) {
			state.moveRight = bool;
		},
		moveBack( state, bool ) {
			state.moveBack = bool;
		},
		moveForward( state, bool ) {
			state.moveForward = bool;
		},
		player( state, inst ) {
			state.player = inst;
		},
		activePlayerID( state, id ) {
			state.activePlayerID = id;
		},
		incPlayerID( state ) {
			if ( state.activePlayerID == 2 ) {
				state.activePlayerID = 0;
			} else {
				state.activePlayerID++;
			}

		}
	},
	actions: {
		switchPlayer( context ) {
			context.commit( "incPlayerID" );
			const id = context.state.activePlayerID;
			context.commit( "player", forge.getPlayer( id ));
		}
	}
});

export default store;
