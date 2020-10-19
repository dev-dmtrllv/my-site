export class Manifest
{
	public readonly main: TransformedData = {};
	public readonly chunks: TransformedData = {};

	public constructor(data: ManifestData)
	{
		const transformData = (target: "main" | "chunks") =>
		{
			for (const name in data[target])
			{
				const { files, id } = data[target][name];
				const transformedData: TransformedChunkData = { id, css: [], js: [] };
				files.forEach(f => 
				{
					if (f.endsWith(".css"))
						transformedData.css.push(f);
					else
						transformedData.js.push(f);
				});
				this[target][name] = transformedData;
			}
		}
		transformData("main");
		transformData("chunks");
	}

	public getMainStyles()
	{
		const styles: string[] = [];
		styles.push(...this.main["runtime"].css);
		if (this.main["vendor"])
			styles.push(...this.main["vendor"].css);
		styles.push(...this.main["app"].css);
		return styles;
	}

	public getMainScripts()
	{
		const scripts: string[] = [];
		scripts.push(...this.main["runtime"].js);
		if (this.main["vendor"])
			scripts.push(...this.main["vendor"].js);
		scripts.push(...this.main["app"].js);
		return scripts;
	}

	public get(type: "css" | "js", ...from: string[])
	{
		const vals = [];
		for (const k in this.chunks)
		{
			if (from.length > 0)
			{
				if (from.includes(k))
					vals.push(...this.chunks[k][type]);
			}
			else
			{
				vals.push(...this.chunks[k][type]);
			}
		}
		return vals;
	}
}

type TransformedChunkData = { id: string, css: string[], js: string[] };
type TransformedData = { [key: string]: TransformedChunkData };

type ManifestChunk = {
	id: string,
	files: string[]
}

type ManifestChunkGroup = {
	[key: string]: ManifestChunk;
};

export type ManifestData = {
	main: ManifestChunkGroup & {
		app: ManifestChunk;
		runtime: ManifestChunk;
		vendor?: ManifestChunk;
	};
	chunks: ManifestChunkGroup;
}
