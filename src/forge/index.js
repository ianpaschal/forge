import Engine from "./core/Engine";
import AnimationSystem from "./systems/animation";
import LightingSystem from "./systems/lighting";
import SoundSystem from "./systems/sound";

const forge = new Engine();
forge.registerSystems([
	new AnimationSystem(),
	new LightingSystem(),
	new SoundSystem()
]);

export default forge;
