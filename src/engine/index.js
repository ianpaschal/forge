// Forge is distributed under the MIT license.

import Path from "path";
import { ipcRenderer, remote } from "electron";
import Aurora from "aurora";
import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";
import resourceSystem from "./systems/resources";

const pluginsDir = Path.join( remote.app.getPath( "userData" ), "Plugins" );
const engine = new Aurora.Engine();

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

const states = {};

ipcRenderer.on( "states", ( data ) => {
	states.next = data.next;
	states.last = data.last;
});

engine.setOnUpdateStart( () => {
	/* No need to to add tick time because getlastTickTime has aleady had delta
		added to it by the time we perform the update. */
	const time = engine.getLastTickTime();

	// Create a new state object out of two other states and a timestamp
	const state = Aurora.utils.interpolate( states.last, states.next, time );

	// Apply state data to the engine (client is now up-to-date with master)
	engine.applyState( state );

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
