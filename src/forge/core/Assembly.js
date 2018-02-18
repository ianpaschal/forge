// Forge is distributed under the MIT license.

/** Class representing an Assembly. */
class Assembly {

	/**
		* Create a Component.
		* @param {Object} json - The x value.
		*/
	constructor( json ) {
		console.log( "New Assembly made" );

		this._components = json.components;
		console.log( this );
	}

	getComponents() {
		return this._components;
	}

}

export default Assembly;
