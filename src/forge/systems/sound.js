import capitalize from "../utils/capitalize";

export default class {
	constructor() {
		this.name = "sound";
		console.log( "Created a new " + this.name + " system." );
		return this;
	}

	init( engine ) {
		if( !engine ) {
			console.warn( capitalize( this.name ) + ": Attempted to initalize system without an engine!" );
			return;
		}
		console.log( capitalize( this.name ) + ": Linked system to engine." );
	}
	update( delta ) {

	}
}
