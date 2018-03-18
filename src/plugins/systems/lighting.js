import * as Three from "three";
import Aurora from "aurora";

function derp() {
	console.log( "DO EXTERNAL THING" );
}

export default new Aurora.System({
	name: "lighting",
	fixed: false,
	componentTypes: [],
	init() {
		this._scene = this._engine.getScene();
		let light;

		light = new Three.DirectionalLight( 0xefefff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		this._scene.add( light );

		light = new Three.DirectionalLight( 0xffefee, 1 );
		light.position.set( -1, -1, -1 ).normalize();
		this._scene.add( light );

		light = new Three.AmbientLight( 0x666666 );
		this._scene.add( light );
		derp();
	},
	add( entity ) {
		// Do nothing for now.
	},
	update( time ) {
		// Do nothing for now.
	}
});
