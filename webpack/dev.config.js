// Forge source code is distributed under the MIT license.

const Path = require( "path" );
const merge = require( "webpack-merge" );
const baseConfig = require( "./base.config.js" );

module.exports = merge( baseConfig, {
	// watch: true,
	output: {
		filename: "[name].bundle.js",
		path: Path.resolve( __dirname, "../dist/" ),
		publicPath: "dist/"
	},
	devtool: "source-map"
});
