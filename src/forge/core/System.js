// Forge is distributed under the MIT license.

import * as Three from "three";
import capitalize from "../utils/capitalize";

/**
	* Class representing a System.
	*/
class System {

	/**
		* Create a System.
		* @param
		*/
	constructor( props, initFn, updateFn ) {
		this.name = props.name || "unnamed";
		this.step = props.step || 100;
		this.fixed = props.fixed || true;

		this.inifFn = initFn;
		this.updateFn = updateFn;

		this._savedTime = 0;

		console.log( "Created a new " + this.name + " system." );
		return this;
	}

	init( engine ) {
		if( !engine ) {
			console.warn( capitalize( this.name ) + ": Attempted to initalize system without an engine!" );
			return;
		}
		console.log( capitalize( this.name ) + ": Linked system to engine." );
		// Run the actual init behavior:
		this.initFn();
	}

	update( delta ) {
		if ( this.fixed ) {
			// Add time to the accumulator & simulate if greater than the step size:
			this._savedTime += delta;
			if ( this._savedTime >= this.step ) {
				this.updateFn( this.step );
				this._savedTime -= this.step;
			}
		} else {
			this.updateFn( delta );
		}
	}
}

export default System;
