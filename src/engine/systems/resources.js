import * as Three from "three";
import Aurora from "aurora";

export default new Aurora.System({
	name: "resource",
	fixed: false,
	componentTypes: [],
	init() {
		// Do nothing for now.
	},
	add( entity ) {
		// Do nothing for now.
	},
	update( time ) {
		for ( const uuid in this._engine._entities ) {
			const entity = this._engine._entities[ uuid ];
			// entity.getComponent( "resource" ).stone--;
		}
	}
});
