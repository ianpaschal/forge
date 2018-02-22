// Forge is distributed under the MIT license.

import Vue from "vue";
import Vuex from "vuex";
import FS from "fs";
import Path from "path";
import * as Three from "three";

Vue.use( Vuex );

const store = new Vuex.Store({
	state: {
		view: "MainMenu",
		camera: undefined,
		activePlayerID: 1,
		moveLeft: false,
		moveRight: false,
		moveForward: false,
		moveBack: false
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
		}
	},
	actions: {}
});

export default store;
