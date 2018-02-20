// Forge is distributed under the MIT license.

import * as Three from "three";
import Assembly from "./Assembly";
import Component from "./Component";
import Entity from "./Entity";
import Player from "./Player";
import EntityCache from "../utils/EntityCache";

/**
	* Core singleton representing an instance of the Forge Engine.
	* @namespace Engine
	*/
class Engine {

	/**
		* Create an instance of the Forge Engine.
		*/
	constructor() {
		console.log( "Initializing a new Engine." );

		this._scene = new Three.Scene();

		// These are the things which are actually saved per game:
		this._entities = [];
		this._systems = [];
		this._world = {
			time: 0,
			name: ""
		};

		// Static Resources:
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
		this._lastFrameTime = null;

		this._entityCache = new EntityCache();
	}

	/**
		* Register a system with the engine (so it can be updated later).
		* Used internally by `.registerSystems()`
		*/
	registerSystem( system ) {
		system.init( this );
		this._systems.push( system );
	}

	registerSystems( systems ) {
		systems.forEach(( system ) => {
			this.registerSystem( system );
		});
	}

	generateWorld( config ) {
		console.info( "Generating a new world." );

		/* Later, config should be loaded from disk, for now it's hard coded. */
		const resources = {
			food: 100,
			wood: 100,
			metal: 100
		};
		config = config || {
			name: "Test World",
			players: [
				new Player({
					start: new Three.Vector3( 0, 0, 0 ),
					resources: resources
				}),
				new Player({
					start: new Three.Vector3( 200, -100, 0 ),
					resources: resources
				}),
				new Player({
					start: new Three.Vector3( -100, 200, 0 ),
					resources: resources
				})
			]
		};

		// Generate the terrain:
		const mesh = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), new Three.MeshLambertMaterial({
			color: 0x999999
		}));
		const loader = new Three.TextureLoader();
		const scope = this;
		loader.load(

			// resource URL
			"../resources/textures/TexturesCom_SoilSand0187_1_seamless_S.jpg",

			// onLoad callback
			function ( texture ) {
				// in this example we create the material when the texture is loaded
				texture.wrapS = Three.RepeatWrapping;
				texture.wrapT = Three.RepeatWrapping;

				// how many times to repeat in each direction; the default is (1,1),
				//   which is probably why your example wasn't working
				texture.repeat.set( 64, 64 );

				const material = new Three.MeshBasicMaterial({
					map: texture
				});
				const plane = new Three.Mesh( new Three.PlaneGeometry( 1024, 1024 ), material );
				scope._scene.add( plane );
				// Generate test entities:
				for ( let i = 0; i < 1000; i++ ) {
					const mesh = new Three.Mesh( new Three.BoxGeometry( 2, 2, 2 ), new Three.MeshBasicMaterial({color: 0xffff00}));
					mesh.position.x = 512 * Math.random() - 256;
					mesh.position.y = 512 * Math.random() - 256;
					mesh.position.z = 1;

					scope._entityCache.addWorldPoint( mesh.position );
					scope._scene.add( mesh );
				}
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
		this.loadAssets(() => {
			// If no source is provided, generate a new world:
			if ( !source ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld();
			} else {
				this.loadWorld( source );
			}
			this.start();
		});
	}

	loadAssets( callback ) {
		callback();
	}

	/**
		* Start the execution of the update loop. Called internally by `this.init()`.
		*/
	start() {
		/*
			Always reset. If engine was stopped and restarted, not resetting could
			cause a massive time jump to be added to all systems.
		*/
		this._lastFrameTime = performance.now();
		this._running = true;
		setInterval( this.update.bind( this ), 1000 / 60 );
	}

	/**
		* Update all systems (if the engine is currently running).
		*/
	update() {
		if ( this._running ) {
			const now = performance.now();
			const delta = now - this._lastFrameTime;
			this._lastFrameTime = now;
			this._systems.forEach(( system ) => {
				system.update( delta );
			});
		}
	}

	stop() {
		this._running = false;
	}

	createPlayer( name ) {
		const player = new Player( name );
		player.spawn();
	}

	createEntity( id, assembly ) {
		const entity = new Entity( id );
		entity.copyAssembly( this._assemblies[ id ]);
		entity.spawn();
		this._entities.push( entity );
	}

	_scanFor( term, arr ) {
		return ( arr.indexOf( term ) > -1 );
	}

	getSelection( max, min, camera ) {
		return this._entityCache.getScreenPoints( max, min );
	}

	getLocation( mouse, camera ) {

	}
}

export default Engine;
