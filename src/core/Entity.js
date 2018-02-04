import UUID from "uuid/v4";
export default class {
	constructor( uuid, components ) {
		this.uuid = "0";
		this.components = {};
	}
	addComponent( component ) {

		// Check if component is a valid type of component

		if ( !this.components[ component.id ] ) {
			this.components[ component.id ] = component;
		}
		else {
			return "Component already exists!"
		}
	}
	getComponents() {
		return this.components;
	}
	getComponent( id ) {
		if ( this.components[ id ] ) {
			return this.components[ id ];
		}
		else {
			return "Component with id " + id +"doesn't exist"
		}
	}
	removeComponent( id ) {
		if ( this.components[ id ] ) {
			delete this.components[ id ];
		}
		else {
			return "Component with id " + id +"doesn't exist"
		}
	}
}

/*
	ESlint rules:

	- remove space on empty lines
	- add space after parenths of functions
	- add space on concat strings
	- add semicolons

*/
