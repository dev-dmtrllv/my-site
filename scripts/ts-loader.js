const { rootPath, aliases } = require("./paths");

const babelConfig = {
	extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts", ".tsx", ".json"],
	cache: true,
	root: rootPath,
	ignore: [
		/node_modules/,
		"./package-lock.json",
		"./package.json",
		/\.s?(c|a)ss$/
	],
	presets: [
		"@babel/preset-env",
		"@babel/preset-react",
		"@babel/preset-typescript"
	],
	plugins: [
		["module-resolver", {
			root: rootPath,
			alias: aliases
		}],
		"@babel/plugin-transform-runtime",
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		["@babel/plugin-proposal-class-properties", { "loose": true }],
		"@babel/plugin-proposal-object-rest-spread",
	],
};

require("@babel/register")(babelConfig);