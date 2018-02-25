/*
	The plugin manager is a singleton which loads plugins depending on the plugin
	order. This order is loaded from preferences, and then any no-longer existing
	packages are removed from the list, and any new packages are added to the
	list. the user can re-order the list, which, on save, will reload all plugins.
*/

import FS from "fs";
import Path from "path";

/** Class representing an Entity. */
class ContentManager {
	constructor( init = true ) {

		// this._pluginDir = Path.resolve( __dirname, "../../plugins/" );
		this._plugins = [];

		// It's possible to avoid running the init method, but default is to do it:
		if ( !init ) {
			return this;
		}
		// this._init();
	}

	_init() {

		const stackOrder = this._getStackOrder();
		console.log( stackOrder );
		this._findPlugins(( pluginData ) => {
			pluginData.sort(( a, b ) => {
				if (
					stackOrder.indexOf( a.name ) >= 0 &&
					stackOrder.indexOf( b.name ) >= 0
				) {
					return stackOrder.indexOf( a.name ) > stackOrder.indexOf( b.name );
				} else {
					if ( stackOrder.indexOf( a.name ) < 0 ) {
						return true;
					}
					if ( stackOrder.indexOf( b.name ) < 0 ) {
						return false;
					}
				}
			});
			this._plugins = pluginData;
		});
	}

	/**
		* Scans the plugins directory for installed plugins.
		* @protected
		* @param {function} callback - Function executed using the results of the scan.
		* @return {array} result of the sum value.
	*/
	_findPlugins( callback ) {

		// Keep track of how many plugins have been loaded:
		let loaded = 0;
		const pluginData = [],
			items = FS.readdirSync( this._pluginDir );

		// For each found item in the plugins directory, load it:
		items.forEach(( item ) => {

			// If the item is a .DS_Store file, skip it, but still mark as processed:
			if ( item == ".DS_Store" ) {
				loaded++;
				return;
			}

			// Read the package.json file, and add it to the pluginData array:
			const path = Path.join( this._pluginDir, item, "package.json" );
			FS.readFile( path, "utf8", ( err, data ) => {
				if ( err ) {
					throw err;
				}
				pluginData.push( JSON.parse( data ));
				loaded++;

				// When we've loaded as many files as were found, it's time to return:
				if ( loaded === items.length ) {
					if ( typeof callback === "function" ) {
						callback( pluginData );
					}
					return pluginData;
				}
			});
		});
	}
	_getStackOrder() {
		return [ "better-human-models", "more-rocks-pack", "age-of-mythology" ]; // Simulate that ians texture mod is newly added
	}

	getAssets() {
		console.log( "Getting assets", this._plugins.length );
	}

	// ---------------------------------------------------------------------------
	// PUBLIC:
	// ---------------------------------------------------------------------------

	loadPlugins( plugins ) {
		const assetTypes = [ "texture", "sound", "model" ];
		let registered = 0;
		plugins.forEach(( plugin )=>{
			plugin.contents.forEach(( item )=>{
				if ( this._scanFor( item.type, assetTypes )) {
					this._registerAsset( item );
				}
			});
			registered++;
			if ( registered === plugins.length ) {
				console.log( Util.inspect( this._assets, { depth: null, colors: true }));
			}
		});
	};

	getStack() {
		return [];
	}
}

export default ContentManager;
