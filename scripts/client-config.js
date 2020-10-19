const fs = require("fs");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const { ManifestPlugin } = require("./manifest-plugin");
const { aliases, resolve, rootPath } = require("./paths");

const createClientConfig = ({ name = "app", isDev = true, output = "public", onManifest, entry = "app/index.tsx", staticPath = "static" } = {}) =>
{
	const plugins = [
		new ManifestPlugin({ onManifest }),
		new webpack.DefinePlugin({
			"process.env": JSON.stringify({ isClient: true, isServer: false, isDev })
		}),
		new MiniCssExtractPlugin({
			filename: `css/[name].bundle.css`,
			chunkFilename: `css/${isDev ? "[id]" : "[id].[chunkhash]"}.chunk.css`,
			ignoreOrder: false
		}),
	];

	if (!isDev && fs.existsSync(resolve(staticPath)))
		plugins.push(new CopyPlugin([{ from: resolve(staticPath), to: resolve("build", output) }]));

	return ({
		mode: isDev ? "development" : "production",
		entry: {
			[name]: resolve("src", entry),
		},
		stats: "minimal",
		target: "web",
		name: "client",
		devtool: "cheap-module-source-map",
		output: {
			path: resolve("build", output),
			filename: `js/[name].bundle.js`,
			chunkFilename: `js/chunks/${isDev ? "[id]" : "[id].[chunkhash]"}.chunk.js`,
			publicPath: "/"
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
			alias: aliases
		},
		plugins,
		context: rootPath,
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /(node_modules|build|.config)/,
					use: {
						loader: "babel-loader",
						options: {
							cacheDirectory: true,
							presets: [
								"@babel/preset-env",
								"@babel/preset-react",
								"@babel/preset-typescript"
							],
							plugins: [
								["babel-plugin-module-resolver", {
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
								"@babel/plugin-syntax-dynamic-import",
							]
						}
					}
				},
				{
					test: /\.js$/,
					use: ["source-map-loader"],
					enforce: "pre"
				},
				{
					test: /\.s?(c|a)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
					exclude: /node_modules/
				},
				{
					test: /\.(jpe?g|png|gif|svg|ico)$/i,
					use: {
						loader: "url-loader",
						options: {
							fallback: "file-loader",
							limit: 40000,
							name: "images/[name].[ext]",
						},
					},
				}
			]
		},
		optimization: {
			runtimeChunk: {
				name: "runtime"
			},
			splitChunks: {
				chunks: "async",
				cacheGroups: {
					default: false,
					vendors: false,
					vendor: {
						chunks: "all",
						test: /node_modules/,
						priority: 20,
						name: "vendor",
					}
				}
			}
		}
	});
};

module.exports = {
	createClientConfig
};
