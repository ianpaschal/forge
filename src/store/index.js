// Forge is distributed under the MIT license.

import Vue from "vue";
import Vuex from "vuex";
import FS from "fs";
import Path from "path";
import engine from "../engine";
import { ipcRenderer } from "electron";

const { app } = require( "electron" ).remote;

Vue.use( Vuex );

// Not sure if this is really still needed
Vue.util.defineReactive( engine, "loaded", 0 );

const store = new Vuex.Store({
	state: {

		// Game state
		last: {},
		next: {},

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
		selection: [],
		loaded: 0,
		pluginStack: [ "heathlands" ]
	},
	getters: {},
	mutations: {

		// Game state
		last( state, data ) {
			state.last = data;
		},
		next( state, data ) {
			state.next = data;
		},

		view( state, view ) {
			const sfx = new Audio( "../../resources/sounds/menu-select.wav" );
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
			}
			else {
				state.activePlayerID++;
			}
		},
		selection( state, entity ) {
			state.selection = [];
			state.selection.push( entity );
		},
		pluginStack( state, stack ) {
			state.pluginStack = stack;
		},
		loaded( state, percent ) {
			state.loaded = percent;
		}
	},
	actions: {
		updateGameState( context, states ) {
			context.commit( "last", states[ 0 ] );
			context.commit( "next", states[ 1 ] );
		},
		clearSelection( context ) {
			context.state.selection = [];
		},
		switchPlayer( context ) {
			context.commit( "incPlayerID" );
			const id = context.state.activePlayerID;
			context.commit( "player", engine.getPlayer( id ) );
		},
		buildLoadStack( context ) {

			// Do the logic here.
			const loadStack = [ "forge-aom-mod" ];
			const pluginDir = Path.join( app.getPath( "userData" ), "plugins" );
			let loaded = 0;
			// Use an object so that plugins higher in the stack can overwrite lower
			// ones using the same key.
			// TODO: Get pluginStack from engine which is pre-populated with Engine
			// defaults.
			const pluginStack = {
				assembly: {},
				geometry: {},
				icon: {},
				material: {},
				texture: {}
			};
			let path;
			let contents;
			loadStack.forEach( ( plugin ) => {
				path = Path.join( pluginDir, plugin, "package.json" );
				FS.readFile( path, "utf8", ( err, data ) => {
					if ( err ) {
						return err;
					}
					contents = JSON.parse( data ).contents;
					contents.forEach( ( item ) => {
						pluginStack[ item.type ][ item.name ] = Path.join( plugin, item.path );
					});
					loaded++;
					if ( loaded === loadStack.length ) {
						context.commit( "pluginStack", pluginStack );
					}
				});
			});
			context.commit( "view", "MainMenu" );
		}
	}
});

ipcRenderer.on( "state", ( event, states ) => {
	console.log( "STORE GOT A NEW STATE:", states );
	store.dispatch( "updateGameState", states );
});

export default store;
