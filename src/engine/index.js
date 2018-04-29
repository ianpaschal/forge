// Forge is distributed under the MIT license.

import Path from "path";
import { remote } from "electron";
import Aurora from "aurora";

import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";
import resourceSystem from "./systems/resources";

/* Does this file look small? It is. This pattern is copied from Vuex for
	creating a central store. It's important that we create an instance and then
	import THAT instance everywhere, not simply importing the engine class. */

const pluginsDir = Path.join( remote.app.getPath( "userData" ), "Plugins" );
const engine = new Aurora.Engine();

// Start systems:
const systems = [
	lightingSystem,
	resourceSystem,
	soundSystem
];

systems.forEach( ( system ) => {
	engine.registerSystem( system );
});

engine.registerPluginLocation( pluginsDir );
export default engine;
