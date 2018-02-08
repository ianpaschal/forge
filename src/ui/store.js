// Forge is distributed under the MIT license.

import Vue from "vue";
import Vuex from "vuex";
import FS from "fs";
import Path from "path";

const Three = require( "three" );

Vue.use( Vuex );

export default new Vuex.Store({
	state: {
		scene: new Three.Scene()
	},
	getters: {},
	mutations: {},
	actions: {}
});
