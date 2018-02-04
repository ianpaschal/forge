const Path = require( "path" );
module.exports = {
	watch: true,
	target: "electron",
	node: {
		__dirname: true,
		__filename: true,
	},
	entry: "./src/play.js",
	output: {
		path: __dirname + "/src/windows/packed",
		publicPath: "packed/",
		filename: "play.pack.js"
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
	}
};
