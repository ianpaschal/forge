// Forge is distributed under the MIT license.

import Engine from "./core/Engine";

/* In the future, it may be desireable to replace this with directory scanning
	to automatically load all availible systems. Maybe... */
import animationSystem from "./systems/animation";
import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";
import resourceSystem from "./systems/resources";

const engine = new Engine();
const systems = [
	animationSystem,
	lightingSystem,
	resourceSystem,
	soundSystem
];
systems.forEach( ( system ) => {
	engine.registerSystem( system );
});

export default engine;
