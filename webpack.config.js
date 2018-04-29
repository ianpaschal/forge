const Path = require( "path" );
const Webpack = require( "webpack" );
module.exports = {
	watch: true,
	target: "electron",
	node: {
		__dirname: true,
		__filename: true,
	},
	entry: {
		play: "./src/play.js",
		main: "./src/main.js"
	},
	output: {
		filename: "[name].bundle.js",
		publicPath: "dist/",
		path: __dirname + "/dist/",
	},
	devtool: "eval-source-map",
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
		new Webpack.IgnorePlugin( /uws/ )
	]
};
