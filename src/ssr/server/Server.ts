import express, { Application } from "express";
import { Manifest } from "ssr/Manifest";
import { DevMiddleware } from "./dev-middleware";
import { Renderer, RendererAppImporter, RenderHandler } from "./Renderer";
import path from "path";

const PUBLIC_PATH = path.resolve(__dirname, process.env.isDev ? "../../../build/public" : "./public");

export class Server
{
	public readonly app: Application = express();
	public readonly port: number;
	public readonly host: string;

	private _manifest: Manifest;
	public get manifest() { return this._manifest }; 

	protected readonly renderers: Map<string, Renderer> = new Map();

	public constructor(port: number, host: string = "127.0.0.1")
	{
		this.port = port;
		this.host = host;
	}

	public async start()
	{
		if (process.env.isDev)
			await DevMiddleware.initDevEnv(this);
		
		this.app.use(express.static(PUBLIC_PATH));

		this.renderers.forEach((r, url) => this.app.get(url, async (req, res) => res.send(await r.render(req, res))));
		this.app.listen(this.port, this.host, () => console.log(`Server is listening on http://${this.host}:${this.port}`));
	}

	public useRenderer(url: string, app: RendererAppImporter, handler?: RenderHandler)
	{
		if (!this.renderers.has(url))
		{
			this.renderers.set(url, new Renderer(this, app, handler));
		}
		else
		{
			console.error(`There is already a renderer registered on path: ${url}`);
		}
	}

	
}
