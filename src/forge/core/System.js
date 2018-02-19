// Forge is distributed under the MIT license.

/**
	* Class representing an Assembly.
	*/
class System {

	/**
		* Create a Component.
		*/
	constructor( json ) {
		console.log( "New system created." );

		this._components = json.components;
		console.log( this );
	}

	getComponents() {
		return this._components;
	}

}

export default System;
