// Forge is distributed under the MIT license.

/* Does this file look small? It is. This pattern is copied from Vuex for
	creating a central store. It's important that we create an instance and then
	import THAT instance everywhere, not simply importing the engine class. */
import Engine from "./core/Engine";
export default new Engine();
