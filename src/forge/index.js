import Engine from "./core/Engine";
import AnimationSystem from "./systems/animation";
import LightingSystem from "./systems/lighting";
import SoundSystem from "./systems/sound";

const ENGINE = new Engine();
const systems = [
	new AnimationSystem(),
	new LightingSystem(),
	new SoundSystem()
];
ENGINE.registerSystems( systems );

export default ENGINE;
