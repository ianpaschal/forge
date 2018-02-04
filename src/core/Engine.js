import FS from "fs";
import Path from "path";
import Util from "util";
import Component from "./Component";
import Player from "./Player";
import World from "./World";
import walkDirSync from "../utils/walkDirSync";

// Systems:
import AnimationSystem from "../systems/animation";
import LightingSystem from "../systems/lighting";
import SoundSystem from "../systems/sound";

// Managers:
import PluginManager from "../managers/PluginManager.js";
// import validatePackage from "./utils/validatePackage.js";

export default class Engine {
	constructor() {
		console.log( "Initializing a new Engine." );

		// Create systems:
		this._systems = {};
		this._systems.animation = new AnimationSystem();
		this._systems.lighting = new LightingSystem();
		this._systems.sound = new SoundSystem();

		// Load assets:
		/*
			For now, we don't worry about fancy plugin loading. Just worry about
			creating the world/environment.
		*/
		this.pluginDir = Path.resolve( __dirname, "../plugins/" );
		this._assemblies = [];
		this._components = [];
		this._models = [];
		this._sounds = [];
		this._textures = [];

		// Timing:
		this._running = false;
		this._fixedStep = 10;
		this._savedFixedTime = 0;
		this._savedFrameTime = 0;
		this._maxFPS = 60;
	}

	load( source ) {

		// If no source is provided, generate a new world:
		if ( !source ) {
			console.warn( "World is missing, a new one will be generated!" );
			this._world = new World();
		} else {
			this._world = this.loadSavedWorld( source );
		}

		// On finished, start:
		this.start();
	}

	start() {
		this._lastFrameTime = performance.now();
		//this._running = true;
		setInterval( this.loop.bind( this ), 1000 / 60 );
	}

	loop() {
		//if ( this._running ) {

		// Update all time. Fixed time is used for fixed step calculations while
		// frame time is used for rendering (variable).
		const now = performance.now();
		const delta = now - this._lastFrameTime;
		this._savedFixedTime += delta;
		this._lastFrameTime = now;

		// Update fixed step systems:
		if ( this._savedFixedTime >= this._fixedStep ) {

			// Update entity activity logic:

			// Remove simulated time:
			this._savedFixedTime -= this._fixedStep;
		}

		this._systems.animation.update( delta );
		this._systems.lighting.update( delta );
		/*
				If savedFrameTime has increased more than the expected amount of time
				one frame should take, render a frame, and remove the elapsed time this
				loop.
			*/
		if ( this._savedFrameTime > 1000 / this._maxFPS ) {

			// Remove simulated time:
			this._savedFrameTime -= delta;
		}

		// Loop the loop:
		// this.loop();
		//}

		// in the future all of this might be changed so that each system keeps
		// track of time by itself, independently.
	}

	stop() {
		this._running = false;
	}

	//==================================================

	_registerAssembly( json ) {
		// Do nothing.
	}

	_registerComponent( json ) {
		// Do nothing.
	}

	_registerAnimationClip() {

	}
	_registerTexture() {

	}

	//===================================

	loadDefaults() {
		console.log( "Loading modules..." );

		const componentFiles = walkDirSync( Path.resolve( __dirname, "components/" ) );

		for ( const file of componentFiles ) {
			var obj;
			FS.readFile( file, "utf8", ( err, data ) => {
				if ( err ) {
					throw err;
				}
				obj = JSON.parse( data );
				console.log( Util.inspect( obj, { depth: null, colors: true }) );
			});
		}
	}

	loadSavedWorld( savePath ) {
		FS.readFile( Path.join( savePath, "world.json" ), "utf8", ( err, data ) => {
			if ( err ) {
				throw err;
			}
			const saveData = JSON.parse( data );

			loaded++;
			if ( loaded === items.length ) {
				onFinished();
			}
		});
	}
	createPlayer( name ) {
		const player = new Player( name );
		player.spawn();
	};

	_scanFor( term, arr ) {
		return ( arr.indexOf( term ) > -1 );
	}

}
/*
// -----------------------------------------------------------------------------
// USER CONFIGURATION (Editable by user):
// -----------------------------------------------------------------------------
FORGE.usrcfg = {};
FORGE.usrcfg.dir = "./user";

// -----------------------------------------------------------------------------
// ENGINE CONFIGURATION:
// -----------------------------------------------------------------------------
FORGE.cfg = {};

// Loop:
FORGE.cfg.fixedStep = 1000;

// Graphics:
FORGE.cfg.renderDistance = 2048;
FORGE.cfg.renderWidth = undefined;
FORGE.cfg.renderHeight = undefined;
FORGE.cfg.antialias = false;
FORGE.cfg.pixelRatio = 1;
FORGE.cfg.maxFPS = 60;
FORGE.cfg.shadowMapSize = 2048;
FORGE.cfg.resX = 960;
FORGE.cfg.resY = 640;

// Sound:

// Terrain:
FORGE.cfg.tileSize = 256;
FORGE.cfg.tileRes = 64;
*/
