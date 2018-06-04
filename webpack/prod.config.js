// Forge source code is distributed under the MIT license.

const Path = require( "path" );
const merge = require( "webpack-merge" );
const baseConfig = require( "./base.config.js" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );

module.exports = merge( baseConfig, {
	output: {
		filename: "[name].bundle.min.js",
		path: Path.resolve( __dirname, "../dist/" ),
		publicPath: "dist/"
	},
	plugins: [
		// Minify JS
		new UglifyJsPlugin({
			sourceMap: true
		})
	]
});
