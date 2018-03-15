// Forge is distributed under the MIT license.

import Path from "path";
import { remote } from "electron";
import Engine from "../../../aurora/src/core/Engine";

/* Does this file look small? It is. This pattern is copied from Vuex for
	creating a central store. It's important that we create an instance and then
	import THAT instance everywhere, not simply importing the engine class. */

const pluginsDir = Path.join( remote.app.getPath( "userData" ), "Plugins" );
const engine = new Engine();
engine.addPluginsLocation( pluginsDir );
export default engine;
