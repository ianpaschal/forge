/*
	The preference manager is awesome.
*/

import FS from "fs";
import Path from "path";

class PreferenceManager {
	constructor() {
		this.search();
	}

	/**
		* Scan a directory for a preferences file.
		*/
	search() {
		// If no preferences found, load the default config file.
		this.load();
		return;
	}

	load( ) {
		this.prefs = {
			app: {
				windowWidth: undefined,
				windowHeight: undefined
			},
			gameplay: {},
			graphics: {
				renderDistance: 2048,
				renderWidth: undefined,
				renderHeight: undefined,
				antiAlias: false,
				pixelRatio: 1,
				maxFPS: 60,
				shadowMapSize: 2048
			},
			mechanics: {
				fixedStep: 1000
			},
			sound: {
				music: {
					volume: 1
				},
				sfx: {
					volume: 1
				}
			}
		};
	}

	save() {

	}

	getAllPreferences() {
		return this.prefs;
	}

	getPreference( id ) {

	}
}

export default PreferenceManager;
