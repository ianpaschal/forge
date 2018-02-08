// Forge is distributed under the MIT license.
/**
	* @namespace Engine
	*/
import FS from "fs";
import Path from "path";
import Util from "util";

// Core:
import Assembly from "./Assembly";
import Component from "./Component";
import Entity from "./Entity";
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

/** Core singleton representing an instance of the Forge Engine. */
class Engine {

	/**
		* Create an instance of the Forge Engine.
		*/
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

		// Entities:
		this._entities = [];

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

		// Fake load:
		const fakeAssembly = {
			id: "greek-villager-female",
			components: {
				activity: {
					current: "walk",
					next: "idle"
				},
				animation: [
					{
						id: "idle",
						model: "greek-villager-female-idle",
						duration: 1000
					},
					{
						id: "walk",
						"model": "greek-villager-female-walk",
						"duration": 2000
					},
					{
						id: "forage",
						model: "greek-villager-female-forage",
						duration: 2000
					}
				],
				"name": "Villager",
				"position": {
					x: 0,
					y: 0,
					z: 0
				},
				"walk": {
					speed: 1,
					target: {
						x: 20,
						y: 20,
						z: 0
					}
				}
			}
		};

		this._registerAssembly( fakeAssembly );

		// On finished, start:
		this.start();
	}

	start() {
		this._lastFrameTime = performance.now();
		//this._running = true;
		setInterval( this.loop.bind( this ), 1000 / 60 );
	}

	/**
		* This function will eventually be renamed 'update'. This is because each
		* system actually controls its own update loop.
		*
		* This allows systems to be more deterministic. Some systems which use fixed
		* timesteps get called on a regular basis. Although they may not execute
		* exactly on schedule, so time is accumulated and then simulated in fixed
		* steps, with a step being removed from the accumulator each time.
		*
		* Variable step systems, however, simply collect accumulated time and
		* simulate some action based on that variable delta and eventually remove
		* all accumulated time each loop.
		*
		* Systems which use fixed steps:
		* - Resources
		* - Physics
		* - Comabat
		* - Ai
		*
		* Systems which use variable steps:
		* - Animation
		* - Sound
		*
		* See http://gameprogrammingpatterns.com/game-loop.html
		*/
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

		const id = json.id;

		this._assemblies[ id ] = new Assembly( json );

		console.log( this._assemblies );
		/*
		json.components.forEach( ( component ) => {

			// Replce with references to already loaded components:

			const registeredComponent = this._components[ component.id ];
			if ( registeredComponent ) {
				this._assemblies[ id ].addComponent( registeredComponent, component );
			} else {

			}

		});
		*/
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

	createEntity( id ) {
		const entity = new Entity();
		entity.copyAssembly( this._assemblies[ id ] );
		entity.spawn();
		this._entities.push( entity );

		/*
			New entities must be registered with all systems for which they may interact.

			For example, they are added into the scene by default.

			So bad example.

			But for example, their are registered with the sound system.
			They are registered with the combat system.

			For example, the combat system does nothing but takes a note of the entity.
			It keeps this handy and will only send back an updated copy

			The alternative system would be that each loop of the system fetches all entities.

		*/
	}

}

export default Engine;
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
