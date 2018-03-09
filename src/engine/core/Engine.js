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
import DecalGeometry from "../utils/DecalGeometry";

/** @classdesc Core singleton representing an instance of the Forge Engine. */
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
			this.registerComponent( new Component( name, json ) );
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
			this.registerPlayer( player );

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
			ground.name = "ground";
			this._scene.add( ground );

			// Generate test entities:
			for ( let i = 0; i < 4; i++ ) {
				const entity = new Entity();
				player.own( entity );
				entity.copy( this.getAssembly( "nature-rock-granite" ) );
				entity.setComponentData( "player", this._players.indexOf( player ) );
				entity.setComponentData( "position", {
					x: player.start.x + ( Math.random() * 32 - 16 ),
					y: player.start.y + ( Math.random() * 32 - 16 )
				});
				entity.setComponentData( "rotation", {
					z: Math.random() * Math.PI
				});
				this.registerEntity( entity );
				this.spawn( entity );
			}
		});

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
							console.error( "Failed to load", stack.textures[ name ], err );
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
					scope.registerAssembly( assembly );
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

	// Getters:

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

	// Registers:

	/** Add an `Entity` instance to to the engine as a re-usable assembly.
		* @param {Entity} assembly - The instance to add.
		*/
	registerAssembly( assembly ) {
		this._assemblies[ assembly.getType() ] = assembly;
		return;
	}

	/** Add a `Component` instance to to the engine.
		* @param {Component} component - The instance to add.
		*/
	registerComponent( component ) {
		console.log( component );
		this._components[ component.getName() ] = component;
		return;
	}

	/** Add an `Entity` instance to to the engine.
		* @param {Entity} entity - The instance to add.
		*/
	registerEntity( entity ) {
		this._entities[ entity.getUUID() ] = entity;
		return;
	}

	/** Add a `Player` instance to to the engine.
		* @param {Player} player - The instance to add.
		*/
	registerPlayer( player ) {
		if ( validate( "isPlayer", player ) ) {
			this._players.push( player );
			return;
		}
		console.error( "Please supply a valid player instance." );
		return null;
	}

	/** @description Register a system with the engine (so it can be updated later).
		* Used internally by `.registerSystems()`.
		*/
	registerSystem( input ) {
		if ( validate( "isSystem", input ) ) {
			input.init( this );
			this._systems.push( input );
			return;
		}
		console.error( "Please supply a valid system instance." );
		return null;
	}

	//---

	// TODO: Move this to it's own system. Maybe animation. Animated models need
	// to be registered there anyway.
	spawn( entity ) {
		const geoIndex = Math.floor( Math.random() * entity.getData( "geometry" ).length );
		const geometry = this.getGeometry( entity.getData( "geometry" )[ geoIndex ] );
		const material = new Three.MeshLambertMaterial({
			color: new Three.Color( 1, 1, 1 ),
			map: this._textures[ entity.getData( "material" ) + "-diffuse" ],
			alphaMap: this._textures[ entity.getData( "material" ) + "-alpha" ],
			alphaTest: 0.5, // if transparent is false
			transparent: false
		});
		const mesh = new Three.Mesh( geometry, material );
		mesh.position.copy( entity.getData( "position" ) );
		mesh.rotation.copy( entity.getData( "rotation" ) );
		mesh.entityID = entity.getUUID();
		this._scene.add( mesh );

		// Decal
		var ground = this._scene.getObjectByName( "ground" );
		console.log( ground );
		var decalGeo =  new DecalGeometry( ground, mesh.position, mesh.rotation, new Three.Vector3( 4, 4, 4 ) );
		var decalMat = new Three.MeshPhongMaterial({
			specular: 0x444444,
			/*
			map: decalDiffuse,
			normalMap: decalNormal,
			normalScale: new Three.Vector2( 1, 1 ),
			*/
			shininess: 30,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4,
			wireframe: false
		});
		var decalMesh = new Three.Mesh( decalGeo, decalMat );
		this._scene.add( decalMesh );

	}
}

export default Engine;
