import React from "react";
import ReactDOMServer from "react-dom/server";
import { Request, Response } from "express";
import { Server } from "./Server";
import { asyncPrefetch, AsyncProvider } from "ssr/async";
import { SSRData } from "ssr/SSRData";

export class Renderer
{
	public static readonly HTML: React.FC<HTMLProps> = ({ appString, title = "", scripts = [], styles = [], ssrData }) =>
	{
		return (
			<html>
				<head>
					<meta charSet="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>{title}</title>
					{styles.map((s, i) => <link key={i} rel="stylesheet" href={s} />)}
				</head>
				<body>
					<div id="root" dangerouslySetInnerHTML={{ __html: appString }} />
					{ssrData && <script id="__SSR_DATA__" dangerouslySetInnerHTML={{ __html: `window.__SSR_DATA__ = ${JSON.stringify(ssrData)};` }}></script>}
					{scripts.map((s, i) => <script key={i} src={s} />)}
				</body>
			</html>
		);
	}

	public readonly server: Server;
	public readonly app: RendererAppImporter;
	protected readonly handler?: RenderHandler;

	public constructor(server: Server, app: RendererAppImporter, handler?: RenderHandler)
	{
		this.server = server;
		this.app = app;
		this.handler = handler;
	}

	public async render(req: Request, res: Response): Promise<string>
	{
		if (this.handler)
			return await this.handler(req, res);

		const App = (await this.app()).default;

		const ssrData: SSRData = {
			async: await asyncPrefetch(<App />)
		};

		const appString = ReactDOMServer.renderToString(
			<AsyncProvider initData={ssrData.async}>
				<App />
			</AsyncProvider>
		);

		for (const id in ssrData.async)
			if (id.startsWith("DYNAMIC"))
				delete ssrData.async[id];

		// const mainJS = this.server.manifest.get("main", "js");
		// const chunkJS = this.server.manifest.get("chunks", "js");
		// 
		// const mainCSS = this.server.manifest.get("main", "css");
		// const chunkCSS = this.server.manifest.get("chunks", "css");

		const m = this.server.manifest;

		const css = [...m.getMainStyles()];
		const js = [...m.getMainScripts()];

		return "<!DOCTYPE html>" + ReactDOMServer.renderToStaticMarkup(<Renderer.HTML appString={appString} scripts={js} styles={css} title="test" ssrData={ssrData} />);
	}
}

export type RenderHandler = (req: Request, res: Response) => Promise<string>;
export type RendererAppImporter = () => Promise<{ default: React.ComponentClass | React.FC }>;

type HTMLProps = {
	appString: string;
	title?: string;
	scripts?: string[];
	styles?: string[];
	ssrData?: SSRData;
};
