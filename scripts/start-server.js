process.env = {
	...process.env,
	isDev: true,
	isServer: true,
	isClient: false,
};

require("./ts-loader");
require("./overrideRequire");

const { resolve } = require("./paths");
const { watch } = require("./watch");

let removing = [];

const onChange = (path) =>
{
	if (!removing.includes(path))
	{
		const i = removing.push(path) - 1;
		setTimeout(() => 
		{
			delete require.cache[path];
			removing.splice(i, 1);
		}, 100);
	}
};

watch(resolve("src","app"), onChange);
watch(resolve("src","utils"), onChange);

require("../src/server");

process.on("exit", () => 
{
	console.log("server stopped!");
})
