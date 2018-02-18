import * as Three from "three";
import capitalize from "../utils/capitalize";

/**
	* description of UI.
	* @memberof namespace:Engine
	* ^^^^^^^^^ need to tell JSDoc UI is a member
	* @class
	*/
class LightingSystem {

	constructor() {
		this.name = "lighting";
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
