import * as Three from "three";
import System from "../core/System";

const props = {
	name: "lighting",
	fixed: false
};

const init = function() {
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
};

const update = function( time ) {
	// Do nothing for now.
};

export default new System( props, init, update );
