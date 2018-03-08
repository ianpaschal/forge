// Forge is distributed under the MIT license.

import UUID from "uuid/v4";
import deepCopy from "../utils/deepCopy";
import deepMerge from "deepmerge";

/** Class representing a Component. */
class Component {

	/** Create a Component.
		* @param {Object} json - JSON object containing component data. This is used
		* when loading a previously created ecomponent from disk, or creating the
		* components which comprise an Assembly.
		*/
	constructor( json ) {

		// If building from JSON:
		if ( json ) {
			this._uuid = json._uuid;
			this._name = json._name;
			this._data = json._data;
		}

		// If creating a fresh instance:
		else {
			this._uuid = UUID();
			this._name = "noname";
			this._data = {};
		}
	}

	// This is used in the following way:
	/*
	assembly = new Entity();
	assembly.setType = json.type; // "my-type"
	json.components.forEach( data => {
		let comp = forge.getComponent( data.name );
		if ( !comp ) {
			comp = new Component();
			comp.setName( data.name );
		}
		comp.apply( data.data );
		assembly.addComponent( comp );
	});
	forge.addAssembly( assembly );
	*/
	apply( json ) {
		this._data = deepMerge( this._data, json );
		/*
		for ( const prop in json ) {
			console.log( prop );
			if ( json[ prop ].constructor === Object ) {
				this._data[ prop ] = this.apply( json[ prop ] );
			}
			else {
				this._data[ prop ] = json[ prop ];
			}
		}
		*/
	}

	/** Clone this component.
		* @returns {Component} - New instance of `Component` with the same data.
		*/
	clone() {
		const clone = new this.constructor();
		clone.copy( this );
		return clone;
	}

	/** Copy another component's data, replacing all existing data.
		* @param {Component} source - Component to copy from.
		*/
	copy( source ) {
		this._name = source.getName();
		this._data = deepCopy( source.getData() );
	}

	/** Get this component's data.
		* @returns {Object} - This component's data.
		*/
	getData() {
		return this._data;
	}

	/** Get this component's name.
		* @returns {string} - This component's name.
		*/
	getName() {
		return this._name;
	}

	/** Get this component's UUID.
		* @returns {string} - This component's UUID.
		*/
	getUUID() {
		return this._uuid;
	}

	setName( name ) {
		this._name = name;
	}
}

export default Component;
