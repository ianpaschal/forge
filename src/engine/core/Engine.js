// Forge is distributed under the MIT license.

// External libraries:
import FS from "fs";
import Path from "path";
import * as Three from "three";
import { remote } from "electron";

// Internal modules:
import Component from "./Component";
import Entity from "./Entity";
import Player from "./Player";

// Additional utilities:
import EntityCache from "../utils/EntityCache";
import validate from "../utils/validate";

/**
	* Core singleton representing an instance of the Forge Engine.
	* @namespace Engine
	*/
class Engine {

	/** Create an instance of the Forge Engine. */
	constructor() {
		console.log( "Initializing a new Engine." );

		this.pluginDir = Path.join( remote.app.getPath( "userData" ), "Plugins" );
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

		// TODO: Remove this:
		this._entityCache = new EntityCache();

		/* TODO: This should be more elegant. But for now I'm not sure if components
		need their own class or not. The whole idea is kind of that they're just
		data. */
		const componentFiles = FS.readdirSync( Path.join( __dirname, "../components" ) );
		componentFiles.forEach( ( file ) => {
			const path = Path.join( __dirname, "../components", file );
			const data = FS.readFileSync( path, "utf8" );
			const json = JSON.parse( data );
			const name = file.replace( /\.[^/.]+$/, "" );
			this._components[ name ] = new Component( name, json );
		});
	}

	/** Register a system with the engine (so it can be updated later).
		* Used internally by `.registerSystems()`.
		*/
	registerSystem( system ) {
		if ( validate( "isSystem", system ) ) {
			system.init( this );
			this._systems.push( system );
			return;
		}
		console.error( "Please supply a valid system instance." );
		return null;
	}

	registerSystems( systems ) {
		systems.forEach( ( system ) => {
			this.registerSystem( system );
		});
	}

	generateWorld( config, onProgress, onFinished ) {

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

		config.players.forEach( ( player ) => {
			this.addPlayer( player );

			// Generate test entities:
			for ( let i = 0; i < 4; i++ ) {
				const entity = new Entity();
				player.own( entity );
				entity.copy( this.getAssembly( "nature-rock-granite" ) );
				entity.setComponentData( "player", this._players.indexOf( player ) );
				entity.setComponentData( "position", {
					x: Math.random() * 100 - 50,
					y: Math.random() * 100 - 50
				});
				entity.setComponentData( "rotation", {
					z: Math.random() * Math.PI
				});
				this.addEntity( entity );
				this.spawn( entity );
			}
		});

		// Create ground:
		const groundTexture = this._textures[ "nature-grass-75-dirt-25" ];
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
		onFinished();
	}

	init( stack, world, onProgress, onFinished ) {

		// Compute total length:
		let length = 0;
		let loaded = 0;
		for ( const section in stack ) {
			length += Object.keys( stack[ section ] ).length;
		}
		if ( world ) {
			length += Object.keys( world.entities ).length;
		}
		function update( item ) {
			loaded++;
			onProgress( ( loaded / length ) * 100, "Loaded " + item );
		}

		// Load assets. On finished, start the world loading/generation routine:
		// onProgress is called when an asset is loaded and passed the
		this.loadAssets( stack, update, () => {
			// If no source is provided, generate a new world:
			if ( !world ) {
				console.warn( "World is missing, a new one will be generated!" );
				this.generateWorld( false, update, onFinished );
			} else {
				this.loadWorld( world, update, onFinished );
			}
		});
	}

	loadAssets( stack, onProgress, onFinished ) {
		const scope = this;
		let loaded = 0;
		let length = 0;
		for ( const section in stack ) {
			length += Object.keys( stack[ section ] ).length;
		}
		const pluginDir = this.pluginDir;
		const textureLoader = new Three.TextureLoader();
		const JSONLoader = new Three.JSONLoader();

		// Load these backwards (textures, materials, geometries, aseemblies)
		const loaders = {
			loadTextures() {
				for ( const name in stack.texture ) {
					textureLoader.load(
						Path.join( pluginDir, stack.texture[ name ] ),
						( texture ) => {
							scope._textures[ name ] = texture;
							addLoaded( name );
						},
						undefined,
						( err ) => {
							console.error( "Failed to load", stack.textures[ name ] );
						}
					);
				}
			},
			loadMaterials() {
				for ( const name in stack.material ) {
					addLoaded( name );
				}
			},
			loadGeometries() {
				for ( const name in stack.geometry ) {
					JSONLoader.load(
						Path.join( pluginDir, stack.geometry[ name ] ),
						( geometry ) => {
							scope._geometries[ name ] = geometry;
							addLoaded( name );
						},
						undefined,
						( err ) => {
							console.error( err );
						}
					);
				}
			},
			loadAssemblies() {
				for ( const name in stack.assembly ) {
					const path = Path.join( pluginDir, stack.assembly[ name ] );
					const file = FS.readFileSync( path, "utf8" );
					const json = JSON.parse( file );
					const assembly = new Entity();
					assembly.setType( json.type ); // "my-type"
					json.components.forEach( ( data ) => {
						//let comp = scope.getComponent( data.name );
						/*if ( !comp ) {
							console.log( "Adding a new component..." );
							comp = new Component();
							comp.setName( data.name );
						}*/
						const comp = new Component();
						comp.setName( data.name );
						comp.apply( data.data );
						assembly.addComponent( comp );
					});
					scope.addAssembly( assembly );
					addLoaded( name );
				}
			},
			loadIcons() {
				for ( const name in stack.icon ) {
					addLoaded( name );
				}
			}
		};
		for ( const loader in loaders ) {
			loaders[ loader ]();
		}
		function addLoaded( name ) {
			loaded++;
			onProgress( name );
			if ( loaded === length ) {
				onFinished();
			}
		}
		/*
		stack.forEach(( asset ) => {
		for( const assetName in stack ) {
			const asset = stack[assetName]

			const textureLoader = new Three.TextureLoader();
			const meshLoader = new Three.JSONLoader();

			const onTextureLoaded = function( texture ) {
				scope._textures[ asset.id ] = texture;
				addLoaded();
			};

			const onMeshLoaded = function( geometry, materials ) {
				scope._geometries[ asset.id ] = geometry;
				scope._meshes[ asset.id ] = new Three.Mesh( geometry, materials );
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

		*/
	}

	/** Start the execution of the update loop. Called internally by `this.init()`. */
	start() {
		/*
			Always reset. If engine was stopped and restarted, not resetting could
			cause a massive time jump to be added to all systems.
		*/
		this._lastFrameTime = performance.now();
		this._running = true;
		setInterval( this.update.bind( this ), 1000 / 60 );
	}

	/** Update all systems (if the engine is currently running). */
	update() {
		if ( this._running ) {
			const now = performance.now();
			const delta = now - this._lastFrameTime;
			this._lastFrameTime = now;
			this._systems.forEach( ( system ) => {
				system.update( delta );
			});
		}
	}

	stop() {
		this._running = false;
	}

	/** Add an `Entity` instance to to the engine as a re-usable assembly.
		* @param {Entity} assembly - The instance to add.
		*/
	addAssembly( assembly ) {
		this._assemblies[ assembly.getType() ] = assembly;
		return;
	}

	/** Add a `Component` instance to to the engine.
		* @param {Component} component - The instance to add.
		*/
	addComponent( component ) {
		console.log( component );
		this._components[ component.getName() ] = component;
		return;
	}

	/** Add an `Entity` instance to to the engine.
		* @param {Entity} entity - The instance to add.
		*/
	addEntity( entity ) {
		this._entities[ entity.getUUID() ] = entity;
		return;
	}

	/** Add a `Player` instance to to the engine.
		* @param {Player} player - The instance to add.
		*/
	addPlayer( player ) {
		if ( validate( "isPlayer", player ) ) {
			this._players.push( player );
			return;
		}
		console.error( "Please supply a valid player instance." );
		return null;
	}

	getAssembly( type ) {
		if ( this._assemblies[ type ] ) {
			return this._assemblies[ type ];
		} else {
			console.error( "Please supply a valid assembly type." );
		}
	}

	getComponent( name ) {
		if ( this._components[ name ] ) {
			return this._components[ name ];
		} else {
			console.warn( "Tried to get component " + name + " from engine but it did not exist." );
		}
	}

	/** Get an `Entity` instance by UUID.
		* @param {String} uuid - The entity's uuid.
		*/
	getEntity( uuid ) {
		if ( this._entities[ uuid ] ) {
			return this._entities[ uuid ];
		}
		console.error( "Please supply a valid entity UUID." );
		return null;
	}

	/** Get a `Three.Geometry` instance by type.
		* @param {String} type - The geometry's type.
		*/
	getGeometry( type ) {
		if ( this._geometries[ type ] ) {
			return this._geometries[ type ];
		} else {
			console.error( "Please supply a valid geometry type." );
		}
	}

	/** Get a `Player` instance by index (player number).
		* @param {Number} index - The player number (in order of creation).
		*/
	getPlayer( index ) {
		if ( validate( "playerIndex", index ) ) {
			return this._players[ index ];
		}
		console.error( "Please supply a valid player index." );
		return null;
	}

	getLocation( mouse, camera ) {

	}

	getSelection( max, min, camera ) {
		return this._entityCache.getScreenPoints( max, min );
	}

	/** Get the glogal scene instance.
		*/
	getScene() {
		return this._scene;
	}

	//---

	// TODO: Move this to it's own system. Maybe animation. Animated models need
	// to be registered there anyway.
	spawn( entity ) {
		// Check if this is an entity.
		const color = this.getPlayer( entity.getComponentData( "player" ).index ).color;
		const geoIndex = Math.floor( Math.random() * entity.getComponentData( "geometry" ).length );
		const geometry = this.getGeometry( entity.getComponentData( "geometry" )[ geoIndex ] );
		const material = new Three.MeshLambertMaterial({
			color: new Three.Color( 1, 1, 1 ),
			map: this._textures[ entity.getComponentData( "material" ) + "-diffuse" ],
			alphaMap: this._textures[ entity.getComponentData( "material" ) + "-alpha" ],
			alphaTest: 0.5, // if transparent is false
			transparent: false
		});
		const mesh = new Three.Mesh( geometry, material );
		mesh.position.copy( entity.getComponentData( "position" ) );
		mesh.rotation.copy( entity.getComponentData( "rotation" ) );
		mesh.entityID = entity.getUUID();
		this._scene.add( mesh );
	}
}

export default Engine;
