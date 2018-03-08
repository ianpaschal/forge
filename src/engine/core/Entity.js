// Forge is distributed under the MIT license.

import UUID from "uuid/v4";
import * as Three from "three";

/** Class representing an Entity. */
class Entity {

	/** Create an Entity.
		* @param {Object} json - JSON object containing entity data. This is used
		* when loading a previously created entity from disk, or creating an Entity
		* which will be used as an Assembly to clone into new Entity instances.
		*/
	constructor( json ) {

		// If building from JSON:
		if ( json ) {
			this._uuid = json._uuid;
			this._type = json._type;
			this._components = [];
			json._components.forEach( ( data ) => {
				this.addComponent( new Component( data ) );
			});
		}

		// If creating a fresh instance:
		else {
			this._uuid = UUID();
			this._type = "untyped";
			this._components = [];
		}
	}

	/** Add a `Component` to the entity.
		* @param {Component} component - The component to add.
		*/
	addComponent( component ) {
		this._components.forEach( ( item ) => {
			if ( item.getName() === component.getName() ) {
				return "Component already exists!";
			}
		});
		this._components.push( component );
	}

	/** Clone this entity.
		*/
	clone() {
		return new this.constructor().copy( this );
	}

	/** Copy an assembly into the entity, replacing all components.
		* @param {Entity} source - Assembly to clone into the new entity.
		*/
	copy( source ) {
		this._type = source.getType();
		this._components = [];
		source.getComponents().forEach( ( component ) => {
			this._components.push( component.clone() );
		});
	}

	/** Get a component within this entity (by ID).
		* @param {string} name - The ID of the component.
		* @return {Component} - The x value.
		*/
	getComponent( name ) {
		for ( let i = 0; i < this._components.length; i++ ) {
			if ( this._components[ i ].getName() === name ) {
				return this._components[ i ];
			}
		}
		return "Component with name " + name + "doesn't exist";
	}

	getComponentData( name ) {
		for ( let i = 0; i < this._components.length; i++ ) {
			if ( this._components[ i ].getName() === name ) {
				return this._components[ i ]._data;
			}
		}
		return "Component with name " + name + "doesn't exist";
	}

	/** Get all of this entity's components.
		* @return {Array} - This entity's components.
		*/
	getComponents() {
		return this._components;
	}

	/** Get this entity's type.
		* @returns {string} - This entity's type.
		*/
	getType() {
		return this._type;
	}

	/** Get this entity's UUID.
		* @returns {string} - This entity's UUID.
		*/
	getUUID() {
		return this._uuid;
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

	setComponentData( name, data ) {
		for ( let i = 0; i < this._components.length; i++ ) {
			if ( this._components[ i ].getName() === name ) {
				return this._components[ i ].apply( data );
			}
		}
		return "Component with name " + name + "doesn't exist";
	}

	setType( type ) {
		this._type = type;
	}
}

export default Entity;
