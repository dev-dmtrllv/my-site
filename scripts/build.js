const fs = require("fs-extra");
const webpack = require("webpack");
const { resolve, paths } = require("./paths");

const { createServerConfig } = require("./server-config");
const { createClientConfig } = require("./client-config");

if (fs.existsSync(paths.build))
	fs.removeSync(paths.build);

fs.mkdirSync(paths.build);

const clientConfig = createClientConfig({
	isDev: false,
	onManifest: (manifest) => fs.writeJsonSync(resolve("build", "manifest.json"), manifest)
});

webpack([createServerConfig(), clientConfig]).run((err, stats) => 
{
	if (err)
		throw err;
	console.log(`Compiled successfull!`);
	console.log(stats.toString("minimal") + "\r\n");
});
