import * as Three from "three";
import capitalize from "../utils/capitalize";

/**
	* description of UI.
	* @memberof namespace:Engine
	* ^^^^^^^^^ need to tell JSDoc UI is a member
	* @class
	*/
class TerrainSystem {

	constructor() {
		this.name = "terrain";
		console.log( "Created a new " + this.name + " system." );
		return this;
	}

	init( engine ) {
		if( !engine ) {
			console.warn( capitalize( this.name ) + ": Attempted to initalize system without an engine!" );
			return;
		}
		console.log( capitalize( this.name ) + ": Linked system to engine." );

		this._engine = engine;
		this._scene = this._engine.getScene();

		const loader = new Three.TextureLoader();
		const scope = this;
		loader.load(

			// resource URL
			"../resources/textures/TexturesCom_Grass0130_1_seamless_S.jpg",

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
				const plane = new Three.Mesh( new Three.PlaneGeometry( 512, 512 ), material );
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

		this._scene.add( light );
	}

	update( delta ) {
		this._savedTime += delta;
		if ( this._savedTime > 1000 / this._maxFPS ) {
			// this._systems.rendering.update( delta );
			// Remove simulated time:
			this._savedTime -= delta;
		}
	}
}

export default TerrainSystem;
