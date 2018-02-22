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
		}
	},
	actions: {}
});

export default store;
