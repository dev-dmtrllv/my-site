const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const { resolve, rootPath, aliases } = require("./paths");

const createServerConfig = () => ({
	mode: "production",
	entry: {
		app: resolve("src", "server")
	},
	devtool: "source-map",
	stats: "minimal",
	target: "node",
	name: "server",
	output: {
		path: resolve("build"),
		filename: "server.js",
	},
	externals: [
		nodeExternals(),
	],
	node: {
		__dirname: false,
		__filename: false,
		fs: false,
		path: false,
		child_process: false,
		require: false
	},
	resolve: {
		extensions: [".js", ".json", ".jsx", ".css", ".scss", ".ts", ".tsx"],
		alias: aliases
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": JSON.stringify({ isClient: false, isServer: true, isDev: false })
		}),
	],
	context: rootPath,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|build)/,
				use: {
					loader: "babel-loader",
					options: {
						cacheDirectory: true,
						presets: [
							[
								"@babel/preset-env",
								{
									modules: false,
								}
							],
							"@babel/preset-react",
							"@babel/preset-typescript"
						],
						plugins: [
							["module-resolver", {
								root: rootPath,
								alias: aliases
							}],
							["@babel/plugin-transform-runtime",
								{
									"regenerator": true
								}
							],
							["@babel/plugin-proposal-decorators", { "legacy": true }],
							["@babel/plugin-proposal-class-properties", { "loose": true }],
							"@babel/plugin-proposal-object-rest-spread",
							"@babel/plugin-syntax-dynamic-import"
						]
					}
				}
			},
			{
				test: /\.js$/,
				loader: "source-map-loader",
				enforce: "pre"
			},
			{
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				use: {
					loader: "url-loader",
					options: {
						fallback: "file-loader",
						limit: 40000,
						name: "/images/[name].[ext]",
					},
				},
			},
			{
				test: /^(?!.*\.(jsx?|tsx?|json|jpe?g|png|gif|svg|ico))/,
				loader: "ignore-loader"
			}
		]
	}
});

module.exports = {
	createServerConfig
};
