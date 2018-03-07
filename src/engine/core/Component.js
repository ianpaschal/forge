// Forge is distributed under the MIT license.

import UUID from "uuid/v4";

/** Class representing a Component. */
class Component {

	/**
		* Create a Component.
		* @param {String} name - The name of the component.
		* @param {Object} data - The JSON object containing all the component's data.
		*/
	constructor( uuid, name, data, inherit = true ) {
		this._uuid = uuid || UUID();
		this._name = name;

		if ( data ) {
			if ( inherit ) {
				this._data = data || {};
			} else {

			}
		}
	}

	getData() {
		return this._data;
	}

	getName() {
		return this._name;
	}

	getUUID() {
		return this._uuid;
	}

	/** Clone this entity.
		*/
	clone() {
		return new this.constructor().copy( this );
	}

	/** Copy data component into the entity, replacing all components.
		* @param {Component} source - Assembly to clone into the new entity.
		*/
	copy( source ) {
		this._name = source.getName();
		this._data = JSON.parse( JSON.stringify( source.getData() ) );
	}
}

export default Component;
