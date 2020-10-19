
const pluginName = "ManifestPlugin";

class ManifestPlugin {
	constructor(props) {
		this.props = props;
	}

	transformPath(p) {
		if (p.startsWith("."))
			return p.substr(1, p.length);
		else if (!p.startsWith("/"))
			return "/" + p;
		else
			return p;
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync(pluginName, (c, cb) => {
			const manifest = {
				main: {},
				chunks: {}
			};

			for (const { files, name, id } of c.chunks) {
				if (name) {
					manifest.main[name === "main" ? "app" : name] = {
						id,
						files: files.map((p) => this.transformPath(p))
					};
				}
			}

			for (const { chunks, origins } of c.chunkGroups) {
				const origin = origins && origins[0];
				if (origin) {
					const fileName = origin.request;
					if (fileName) {
						for (const { id, files } of chunks) {
							manifest.chunks[fileName] = {
								id,
								files: files.map((p) => this.transformPath(p))
							};
						}
					}
				}
			}
			this.props.onManifest(manifest);
			cb();
		});
	}
}

module.exports = {
	ManifestPlugin
}
