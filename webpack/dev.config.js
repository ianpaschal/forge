const Path = require( "path" );
const merge = require( "webpack-merge" );
const baseConfig = require( "./base.config.js" );

module.exports = merge( baseConfig, {
	watch: true,
	output: {
		filename: "[name].js",
		path: Path.resolve( __dirname, "../dist/" ),
		publicPath: "dist/"
	}
});
