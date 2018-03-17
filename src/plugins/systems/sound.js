import Aurora from "../../../aurora/src";

const props = {
	name: "sound",
	fixed: false
};

const init = function() {
	this._scene = this._engine.getScene();
	// Do nothing for now.
};

const update = function( time ) {
	// Do nothing for now.
};

export default new Aurora.System( props, [], init, update );
