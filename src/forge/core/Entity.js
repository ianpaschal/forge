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
	constructor( uuid, components ) {
		this.uuid = "0";
		this.components = {};
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

	/**
		* Remove a component from this entity (by ID).
		* @param {string} str - The ID of the component.
		* @return {number} The x value.
		*/
	removeComponent( id ) {
		if ( this.components[ id ] ) {
			delete this.components[ id ];
		}
		else {
			return "Component with id " + id + "doesn't exist";
		}
	}

	/**
		* Copy an assembly into the entity.
		* @param {Assembly} - Assembly to clone into the new entity.
		*/
	copyAssembly( assembly ) {
		this.components = assembly.getComponents();
	}

	spawn( position = new Three.Vector3( 0, 0, 0 ) ) {

		console.log( "spanwing a dude" );
		// Create the model
		const loader = new Three.JSONLoader();
		const path = "../../plugins/age-of-mythology/model/greek-villager-female-walk.js";
		loader.load( path, ( geometry, materials ) => {
			const mesh = new Three.Mesh( geometry, new Three.MeshLambertMaterial({
				color: 0x999999
			}) );

			// store.state.scene.add( mesh );

			mesh.material.morphTargets = true;
			mesh.position.copy( position );
		});

		// Add it to the scene.

		// Register a mixer
	}
}

export default Entity;
