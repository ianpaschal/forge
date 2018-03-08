// Forge is distributed under the MIT license.

import capitalize from "../utils/capitalize";

/** Class representing a System. */
class System {

	/** Create a System.
		* @param {Object} props - Properties of this system.
		* @param {String} props.name - Name of this system (primiarly used for logging purposes).
		* @param {Bool} props.fixed - Whether the system should update as often as possible or respect a fixed step size.
		* @param {Number} props.step - Step size (in ms). Only used if `props.fixed` is `false`.
		* @param {Function} initFn - Function to run when first connecting the system to the engine.
		* @param {Function} updateFn - Function to run each time the engine updates the main loop.
		* @returns {System} - The newly created system.
		*/
	constructor( props, initFn, updateFn ) {
		this.name = props.name || "unnamed";
		this.step = props.step || 100;
		this.fixed = props.fixed || true;

		this.initFn = initFn;
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
		this._engine = engine;

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
