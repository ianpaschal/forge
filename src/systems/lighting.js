import * as Three from "three";
// import forge from "../forge";

/**
	* description of UI.
	* @memberof namespace:Engine
	* ^^^^^^^^^ need to tell JSDoc UI is a member
	* @class
	*/
class LightingSystem {
	constructor() {
		console.log( "Created a new lighting system." );
	}

	init( engine ) {
		if( !engine ) {
			console.warn( "Attempted to initalize system without an engine!" );
			return;
		}

		console.log( "Linked lighting system to engine." );

		this._engine = engine;
		this._scene = this._engine.getScene();

		let light;

		light = new Three.DirectionalLight( 0xefefff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		this._scene.add( light );

		light = new Three.DirectionalLight( 0xefccaa, 1 );
		light.position.set( -1, -1, -1 ).normalize();
		this._scene.add( light );

		light = new Three.AmbientLight( 0x666666 );
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

export default LightingSystem;
