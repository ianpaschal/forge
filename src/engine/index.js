import Engine from "./core/Engine";
import System from "./core/System";

import animationSystem from "./systems/animation";
import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";
import resourceSystem from "./systems/resources";

const engine = new Engine();
engine.registerSystems([
	animationSystem,
	lightingSystem,
	resourceSystem,
	soundSystem
]);

export default engine;
