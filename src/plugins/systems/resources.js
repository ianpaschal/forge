import * as Three from "three";
import Aurora from "../../../aurora/src";

const props = {
	name: "resource",
	fixed: false
};

const init = function() {
	// Do nothing for now.
};

const update = function( time ) {
	for ( const uuid in this._engine._entities ) {
		const entity = this._engine._entities[ uuid ];
		// entity.getComponent( "resource" ).stone--;
	}
};

export default new Aurora.System( props, [], init, update );
