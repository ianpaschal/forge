// Forge is distributed under the MIT license.

import Vue from "vue";
import Vuex from "vuex";
import FS from "fs";
import Path from "path";
import * as Three from "three";
import engine from "../engine";

Vue.use( Vuex );

// Not sure if this is really still needed
Vue.util.defineReactive( engine, "loaded", 0 );

const store = new Vuex.Store({
	state: {
		loaded: engine.loaded,
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
		activePlayerID: 1,
		selection: []
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
			if ( state.activePlayerID == engine._players.length - 1 ) {
				state.activePlayerID = 0;
			} else {
				state.activePlayerID++;
			}
		},
		selection( state, entity ) {
			state.selection.push( entity );
		}
	},
	actions: {
		switchPlayer( context ) {
			context.commit( "incPlayerID" );
			const id = context.state.activePlayerID;
			context.commit( "player", engine.getPlayer( id ));
		}
	}
});

export default store;
