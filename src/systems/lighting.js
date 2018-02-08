import * as Three from "three";
import store from "../ui/store";

export default class {
	constructor() {
		console.log( "Created a new lighting system." );
		this._mixers = [];
		this._savedTime = 0;
		this._maxFPS = 60;

		let light;
		light = new Three.DirectionalLight( 0xefefff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		store.state.scene.add( light );
		light = new Three.DirectionalLight( 0xefccaa, 1 );
		light.position.set( -1, -1, -1 ).normalize();
		store.state.scene.add( light );
		store.state.scene.add( new Three.AmbientLight( 0x666666 ) );

	}
	update( delta ) {
		this._savedTime += delta;
		if ( this._savedTime > 1000 / this._maxFPS ) {
			// this._systems.rendering.update( delta );
			// Remove simulated time:
			this._savedTime -= delta;
		}

		this._mixers.forEach( ( mixer ) => {
			mixer.update( delta / 1000 );
		});
	}
}
