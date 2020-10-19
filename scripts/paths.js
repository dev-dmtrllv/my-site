const path = require("path");

const rootPath = path.join(__dirname, "..");
const resolve = (...parts) => path.resolve(rootPath, ...parts);

const paths = {
	root: rootPath,
	client: resolve("src", "app", "index.tsx"),
	server: resolve("src", "server", "index.ts"),
	build: resolve("src", "build"),
	public: resolve("src", "public")
};

const aliases = (() =>
{
	const aliasPaths = require("../tsconfig.json").compilerOptions.paths;

	let a = {};
	for (let alias in aliasPaths)
	{
		let p = aliasPaths[alias][0];
		if (p)
			a[alias.replace("/*", "").replace("src/", "")] = "./" + p.replace("/*", "");
	}
	return a;
})();

module.exports = {
	rootPath,
	resolve,
	aliases,
	paths
};
