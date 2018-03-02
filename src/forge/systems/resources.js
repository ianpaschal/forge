import * as Three from "three";
import System from "../core/System";

const props = {
	name: "resource",
	fixed: false
};

const init = function( engine ) {
	// Do nothing for now.
	console.log( this._engine );
};

const update = function( time ) {
	for ( const uuid in this._engine._entities ) {
		const entity = this._engine._entities[uuid];
		entity.components.resource.wood--;
	}
};

export default new System( props, init, update );
