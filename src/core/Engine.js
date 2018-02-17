// Forge is distributed under the MIT license.
/**
	* @namespace Engine
	*/
import FS from "fs";
import Path from "path";
import Util from "util";
import * as Three from "three";

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
import ContentManager from "../managers/ContentManager.js";
import PreferenceManager from "../managers/PreferenceManager";

/** Core singleton representing an instance of the Forge Engine. */
class Engine {

	/**
		* Create an instance of the Forge Engine.
		*/
	constructor() {
		console.log( "Initializing a new Engine." );

		// Create manager instances which can be used by the interface:
		this.contentManager = new ContentManager();
		this.preferenceManager = new PreferenceManager();

		this._scene = new Three.Scene();
		this._systems = [];

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
		/*
			Later this will be controlled by the PreferenceManager
		*/
		this._running = false;
		this._fixedStep = 10;
		this._savedFixedTime = 0;
		this._savedFrameTime = 0;
		this._maxFPS = 60;
		this._lastFrameTime = null;
	}

	registerSystem() {

	}
	registerSystems( systems ) {
		systems.forEach( ( system ) => {
			system.init( this );
			this._systems.push( system );
		});
	}
	loadAssets( callback ) {
		const stack = this.contentManager.getStack();
		if ( !stack ) {
			console.error( "No asset stack to load from!" );
			return;
		}
		stack.forEach( ( asset ) => {
			/*
				TODO: Replace with this.register[asset.type](asset);
			*/
			switch( asset.type ) {
				case "animation":
					this.registerAnimation( asset );
					break;
				case "assembly":
					break;
				case "component":
					break;
				case "texture":
					this.registerTexture( asset );
					break;
				case "sound":
					this.registerSound( asset );
					break;
				case "model":
					this.registerModel( asset );
					break;
			}
		});
		if ( typeof callback === "function" ) {
			return callback();
		}
		return;
	}

	loadWorld() {

	}

	generateWorld( ) {
		console.info( "Generating a new world." );
		const mesh = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), new Three.MeshLambertMaterial({
			color: 0x999999
		}) );

		// store.state.scene.add( mesh );

		const loader = new Three.TextureLoader();

		let material;

		const scope = this;

		// load a resource
		loader.load(
			// resource URL
			"../assets/texture/TexturesCom_SoilSand0187_1_seamless_S.jpg",

			// onLoad callback
			function ( texture ) {
				// in this example we create the material when the texture is loaded
				texture.wrapS = Three.RepeatWrapping;
				texture.wrapT = Three.RepeatWrapping;

				// how many times to repeat in each direction; the default is (1,1),
				//   which is probably why your example wasn't working
				texture.repeat.set( 64, 64 );

				material = new Three.MeshBasicMaterial({
					map: texture
				});
				const plane = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), material );
				scope._scene.add( plane );
			},

			// onProgress callback currently not supported
			undefined,

			// onError callback
			function ( err ) {
				console.error( "An error happened." );
			}
		);
		return this;
	}

	getScene() {
		return this._scene;
	}

	init( source ) {
		this.loadAssets( () => {
			// If no source is provided, generate a new world:
			if ( !source ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld();
			} else {
				this.loadWorld( source );
			}
			this._systems.forEach( ( system )=>{
				system.init();
			});
			this.start();
		});
	}

	start() {
		this._lastFrameTime = performance.now();
		this._running = true;
		setInterval( this.update.bind( this ), 1000 / 60 );
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
	update() {
		if ( this._running ) {
			/**
				* Update all time. Fixed time is used for fixed step calculations while
				* frame time is used for rendering (variable).
				*/
			const now = performance.now();
			const delta = now - this._lastFrameTime;
			// this._savedFixedTime += delta;
			this._lastFrameTime = now;

			this._systems.forEach( ( system ) => {
				system.update( delta );
			});
		}
		/*

		// Update fixed step systems:
		if ( this._savedFixedTime >= this._fixedStep ) {

			// Update entity activity logic:

			// Remove simulated time:
			this._savedFixedTime -= this._fixedStep;
		}

				If savedFrameTime has increased more than the expected amount of time
				one frame should take, render a frame, and remove the elapsed time this
				loop.

		if ( this._savedFrameTime > 1000 / this._maxFPS ) {

			// Remove simulated time:
			this._savedFrameTime -= delta;
		}
		*/
		// Loop the loop:
		// this.loop();
		//}

		// in the future all of this might be changed so that each system keeps
		// track of time by itself, independently.
	}

	stop() {
		this._running = false;
	}

	createEntity( assemblyID ) {

	}
	/*
	//==================================================

	_registerAssembly( json ) {
		// Do nothing.

		const id = json.id;

		this._assemblies[ id ] = new Assembly( json );

		console.log( this._assemblies );

		json.components.forEach( ( component ) => {

			// Replce with references to already loaded components:

			const registeredComponent = this._components[ component.id ];
			if ( registeredComponent ) {
				this._assemblies[ id ].addComponent( registeredComponent, component );
			} else {

			}

		});

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

	}

	createScene() {
		this._scene = new Three.Scene();
	}
	getScene() {
		if ( !this._scene ) {
			this.createScene();
		}
		return this._scene;
	}
	*/
}

export default Engine;
