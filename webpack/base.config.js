const Webpack = require( "webpack" );

module.exports = {
	target: "electron",
	node: {
		__dirname: true,
		__filename: true,
	},
	entry: {
		play: "./src/play.js",
		main: "./src/main.js"
	},
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: "file-loader",
				query: {
					name: "[name].[ext]?[hash]"
				}
			}
		]
	},
	resolve: {
		alias: { vue: "vue/dist/vue.common.js" }
	},
	plugins: [
		new Webpack.EnvironmentPlugin( [
			"NODE_ENV",
		] ),
		new Webpack.IgnorePlugin( /uws/ )
	],

	/* Webpack tries to resolve electron module with the installed node_modules.
		But the electron module is resolved in Electron itself at runtime. So, you
		have to exclude particular module from webpack bundling like this: */
	/*
	externals: [
		( function () {
			const IGNORES = [
				"electron"
			];
			return function ( context, request, callback ) {
				if ( IGNORES.indexOf( request ) >= 0 ) {
					return callback( null, "require('" + request + "')" );
				}
				return callback();
			};
		})()
	]
	*/
};
