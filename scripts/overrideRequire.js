const path = require("path");
const Module = require("module");

[
	".css",
	".sass",
	".scss",
	".less",
].forEach(i => require.extensions[i] = () => { });

const imageExtensions = [
	".jpg",
	".jpeg",
	".gif",
	".png",
	".svg",
];

var originalRequire = Module.prototype.require;

Module.prototype.require = function ()
{
	const name = arguments["0"]
	for (const e of imageExtensions)
		if (name.endsWith(e))
			return "/" + path.join("images", name).replace(/\\/g, "/");
	return originalRequire.apply(this, arguments);
};