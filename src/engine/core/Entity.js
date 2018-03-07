// Forge is distributed under the MIT license.

import UUID from "uuid/v4";
import * as Three from "three";
// import store from "../ui/store";

/** Class representing an Entity. */
class Entity {

	/**
		* Create an Entity with a given UUID and components.
		* @param {string} uuid - The UUID.
		* @param {Object} components - The components.
		*/
	constructor( uuid = UUID(), type = "unknown", components = {}, inherit = true  ) {
		this._uuid = uuid;
		this._type = type;

		if ( components ) {
			if ( inherit ) {
				this._components = components || {};
			} else {

			}
		}
	}

	/**
		* Add a Component instance to the entity.
		* @param {Component} component
		*/
	addComponent( component ) {
		// Check if component is a valid type of component
		if ( !this.components[ component.id ] ) {
			this.components[ component.id ] = component;
		}
		else {
			return "Component already exists!";
		}
	}

	/**
		* Get the components within this entity.
		* @return {number} The x value.
		*/
	getComponents() {
		return this.components;
	}

	/**
		* Get a component within this entity (by ID).
		* @param {string} id - The ID of the component.
		* @return {number} The x value.
		*/
	getComponent( id ) {
		if ( this.components[ id ] ) {
			return this.components[ id ];
		}
		else {
			return "Component with id " + id + "doesn't exist";
		}
	}

	/** Remove a component from this entity (by ID).
		* @param {string} name - The ID of the component.
		*/
	removeComponent( name ) {
		const index = this._components.indexOf( this.getComponent( name ) );
		if ( index > 0 ) {
			delete this.components[ index ];
		}
		else {
			return "Component with id " + name + "doesn't exist";
		}
	}

	/**
		* Merge an assembly into the entity, preserving existing components.
		* @param {Assembly} - Assembly to clone into the new entity.
		*/
	merge( assembly ) {

	}

	/** Clone this entity.
		*/
	clone() {
		return new this.constructor().copy( this );
	}

	/** Copy an assembly into the entity, replacing all components.
		* @param {Assembly} source - Assembly to clone into the new entity.
		*/
	copy( source ) {
		this._type = source.getType();
		this._components = [];
		source.getComponents().forEach( ( component ) => {
			this._components.push( component.clone() );
		});
	}
}

export default Entity;
