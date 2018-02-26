// Forge is distributed under the MIT license.

import * as Three from "three";
import Assembly from "./Assembly";
import Component from "./Component";
import Entity from "./Entity";
import Player from "./Player";
import EntityCache from "../utils/EntityCache";
import validate from "../utils/validate";
import Path from "path";
import FS from "fs";
const { app } = require( "electron" ).remote;

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
		this._entities = {};
		this._systems = [];
		this._world = {
			time: 0,
			name: ""
		};
		this._players = [];

		// Static Resources:
		this._assemblies = {};
		this._components = {};
		this._meshes = {};
		this._geometries = {};
		this._sounds = {};
		this._textures = {};

		// Timing:
		this._running = false;
		this._fixedStep = 10;
		this._savedFixedTime = 0;
		this._savedFrameTime = 0;
		this._maxFPS = 60;
		this._lastFrameTime = null;

		this._entityCache = new EntityCache();

		this.loaded = 0;
	}

	/**
		* Register a system with the engine (so it can be updated later).
		* Used internally by `.registerSystems()`
		*/
	registerSystem( system ) {
		if ( validate( "isSystem", system )) {
			system.init( this );
			this._systems.push( system );
			return;
		}
		console.error( "Please supply a valid system instance." );
		return null;
	}

	registerSystems( systems ) {
		systems.forEach(( system ) => {
			this.registerSystem( system );
		});
	}

	generateWorld( config ) {
		console.info( "Generating a new world. Assets %:", this.loaded );

		/* Later, config should be loaded from disk, for now it's hard coded. */
		const resources = {
			food: 100,
			wood: 100,
			metal: 100
		};
		config = config || {
			name: "Test World",
			players: [
				new Player( null, {
					color: new Three.Color( 0xA0B35D ),
					name: "Gaia",
					start: new Three.Vector3( 0, 0, 0 ),
					resources: {}
				}),
				new Player( null, {
					color: new Three.Color( 0x0000ff ),
					name: "Ian",
					start: new Three.Vector3( 0, 0, 0 ),
					resources: resources
				}),
				new Player( null, {
					color: new Three.Color( 0xff0000 ),
					name: "Thomas",
					start: new Three.Vector3( 200, -100, 0 ),
					resources: resources
				}),
				new Player( null, {
					color: new Three.Color( 0x00ff00 ),
					name: "Winston",
					start: new Three.Vector3( -100, 200, 0 ),
					resources: resources
				})
			]
		};

		config.players.forEach(( player ) => {
			this.addPlayer( player );

			// Generate test entities:
			for ( let i = 0; i < 4; i++ ) {
				const entity = new Entity();
				player.own( entity );
				entity.copy( this.getAssembly( "nature-tree-oak" ));
				entity.components.player = this._players.indexOf( player );
				entity.components.position = {};
				entity.components.position.x = Math.random()*100 - 50;
				entity.components.position.y = Math.random()*100 - 50;
				entity.components.position.z = 0;
				this.addEntity( entity );
				this.spawn( entity );
			}
		});

		// Create ground:
		const groundTexture = this._textures[ "grass" ];
		groundTexture.wrapS = Three.RepeatWrapping;
		groundTexture.wrapT = Three.RepeatWrapping;
		groundTexture.repeat.set( 32, 32 );
		const ground = new Three.Mesh(
			new Three.PlaneGeometry( 512, 512 ),
			new Three.MeshLambertMaterial({
				color: 0xffffff,
				map: groundTexture
			})
		);
		this._scene.add( ground );
	}

	init( source, onProg, onFinshed ) {
		this.loadAssets( null, () => {
			// If no source is provided, generate a new world:
			if ( !source ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld();
			} else {
				this.loadWorld( source );
			}
			onFinshed();
		});
	}

	loadAssets( stack, callback ) {

		let loaded = 0;
		const scope = this;
		const pluginsDir = Path.join( app.getPath( "userData" ), "Plugins" );

		// Temporary hardcoded stack in lieu of plugin browser stack:
		stack = [
			{ type: "texture", id: "grass", path: "forge-aom-mod/texture/grass-75-dirt-25.bmp" },
			{ type: "texture", id: "nature-tree-oak-diffuse", path: "forge-aom-mod/texture/nature-tree-oak-diffuse.png" },
			{ type: "texture", id: "nature-tree-oak-alpha", path: "forge-aom-mod/texture/nature-tree-oak-alpha.png" },
			{ type: "material", id: "nature-tree-oak", path: "forge-aom-mod/material/nature-tree-oak.json" },
			{ type: "mesh", id: "nature-tree-oak", path: "forge-aom-mod/model/nature-tree-oak-a.json" },
			{ type: "assembly", id: "nature-tree-oak", path: "forge-aom-mod/assembly/nature-tree-oak.json" }
		];
		stack.forEach(( asset ) => {

			const textureLoader = new Three.TextureLoader();
			const meshLoader = new Three.JSONLoader();

			const onTextureLoaded = function( texture ) {
				scope._textures[asset.id] = texture;
				addLoaded();
			};

			const onMeshLoaded = function( geometry, materials ) {
				scope._geometries[asset.id] = geometry;
				scope._meshes[asset.id] = new Three.Mesh( geometry, materials );
				addLoaded();
			};

			const onError = function ( err ) {
				console.error( "An error happened." );
			};

			const loadPath = Path.join( pluginsDir, asset.path );
			switch ( asset.type ) {
				case "texture":
					textureLoader.load( loadPath, onTextureLoaded, undefined, onError );
					break;
				case "material":
					addLoaded();
					break;
				case "mesh":
					meshLoader.load( loadPath, onMeshLoaded, undefined, onError );
					break;
				case "assembly":
					const json = JSON.parse( FS.readFileSync( loadPath ));
					scope._assemblies[ asset.id ] = new Entity( null, json.components );
					addLoaded();
					break;
			}
		});
		function addLoaded() {
			loaded++;
			if ( loaded === stack.length ) {
				scope.loaded = 100;
				callback();
			}
		}
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

	// Object stuff:
	addAssembly( assembly ) {
		this._assemblies[ assembly.type ] = assembly;
		return;
	}

	getAssembly( type ) {
		return this._assemblies[ type ];
	}

	addEntity( entity ) {
		this._entities[ entity.uuid ] = entity;
		return;
	}

	getEntity( uuid ) {
		if ( this._entities[ uuid ]) {
			return this._entities[ uuid ];
		}
		console.error( "Please supply a valid entity UUID." );
		return null;
	}

	getGeometry( type ) {
		if ( this._geometries[type]) {
			return this._geometries[type];
		} else {
			console.error( "Please supply a valid geometry type." );
		}
	}

	/** Add a `Player` instance to to the engine.
		* @param {Player} player - The instance to add.
		*/
	addPlayer( player ) {
		if ( validate( "isPlayer", player )) {
			this._players.push( player );
			return;
		}
		console.error( "Please supply a valid player instance." );
		return null;
	}

	getPlayer( index ) {
		if ( validate( "playerIndex", index )) {
			return this._players[ index ];
		}
		console.error( "Please supply a valid player index." );
		return null;
	}

	getScene() {
		return this._scene;
	}

	spawn( entity ) {
		// Check if this is an entity.
		const color = this.getPlayer( entity.components.player ).color;
		const geometry = this.getGeometry( entity.components.model.geometry );
		const material = new Three.MeshLambertMaterial({
			color: new Three.Color( 1, 1, 1 ),
			map: this._textures[entity.components.model.material+"-diffuse"],
			alphaMap: this._textures[entity.components.model.material+"-alpha"],
			alphaTest: 0.5, // if transparent is false
			transparent: false
		});
		const mesh = new Three.Mesh( geometry, material );
		mesh.position.copy( entity.components.position );
		mesh.rotation.x += Math.PI/2; // Uncheck flip in 3dsMax
		this._scene.add( mesh );
	}

	// ....

	getSelection( max, min, camera ) {
		return this._entityCache.getScreenPoints( max, min );
	}

	getLocation( mouse, camera ) {

	}
}

export default Engine;
