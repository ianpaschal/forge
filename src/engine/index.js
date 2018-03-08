import Engine from "./core/Engine";

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
