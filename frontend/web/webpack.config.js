module.exports = {

	entry:  __dirname + "/main.js",
	output: {
		path: __dirname + "/",
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015']
				}
			}
		]
	},

}