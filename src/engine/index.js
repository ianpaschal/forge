// Forge source code is distributed under the MIT license.

import Path from "path";
import { remote } from "electron";
import { Engine } from "aurora";
import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";
import resourceSystem from "./systems/resources";

const pluginsDir = Path.join( remote.app.getPath( "userData" ), "Plugins" );
const engine = new Engine();

engine.registerPluginLocation( pluginsDir );

// Start systems:
const systems = [
	lightingSystem,
	resourceSystem,
	soundSystem
];
systems.forEach( ( system ) => {
	engine.registerSystem( system );
});

engine.setOnUpdateStart( () => {
	/* No need to to add tick time because getlastTickTime has aleady had delta
		added to it by the time we perform the update. */
	const time = engine.getLastTickTime();

	// Find next state after current time
	const nextState = engine._states.find( ( state ) => {
		return state.timestamp > time;
	});
	// Trim states so only the first state's timestamp is older or equal to time
	engine._states.splice( 0, engine._states.indexOf( nextState ) - 1 );

	// Apply the oldest state, and add any time past it to the accumulator
	const lastState = engine._states[ 0 ];
	engine.applyState( lastState );
	engine._accumulator += time - lastState.timestamp;

	// Now do typical graphics and such...
	return;
});

engine.setOnUpdateEnd( () => {
	// After updating, if lastTickTime is now greater than next state time:

	// Set time to nextState
	/*
	So we keep track of the current next and last. if they're both empty and we get
	some states, add the last to last and next to next and set our time equal to last.

	start the loop.

	pre update, we'll interpolate the states to get a new state, apply it to the engine
	on this first one the time should be last+tick

	update all systems la la la

	post update, we will*/
});

export default engine;
