import Engine from "./core/Engine";
import System from "./core/System";

import animationSystem from "./systems/animation";
import lightingSystem from "./systems/lighting";
import soundSystem from "./systems/sound";

const forge = new Engine();
forge.registerSystems([
	animationSystem,
	lightingSystem,
	soundSystem
]);

export default forge;
