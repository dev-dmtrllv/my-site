const { join } = require("path");
const fs = require("fs");

const watched = [];

const watch = (...args) =>
{
	const paths = [];
	let fn = () => { };

	for (const arg of args)
		if (typeof arg === "function")
			fn = arg;
		else if (typeof arg === "string")
			paths.push(arg);

	for (const p of paths)
		if (fs.existsSync(p))
			fs.watch(p, { recursive: true }, (a, file) => 
			{
				const path = join(p, file);
				if (!watched.includes(path))
				{
					fn(path);
					watched.push(path);
					setTimeout(() =>
					{
						if (watched.includes(path))
							watched.splice(watched.indexOf(path), 1);
					}, 350);
				}
			});
};

module.exports = {
	watch
}