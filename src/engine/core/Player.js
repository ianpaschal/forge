import * as Three from "three";
import UUID from "uuid/v4";
export default class {
	constructor( uuid, config ) {
		this.uuid = uuid || UUID();
		this.name = config.name;
		this.color = config.color;
		this._entities = [];
		console.log( "Created player " + this.uuid + " with name " + this.name + "." );
		return this;
	}

	own( entity ) {
		this._entities.push( entity.uuid );
	}

	getEntityIDs() {
		return this._entities;
	}
}
