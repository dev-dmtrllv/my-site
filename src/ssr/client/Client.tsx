import React from "react";
import ReactDOM from "react-dom";
import { asyncPrefetch, AsyncProvider } from "ssr/async";
import { SSRData } from "ssr/SSRData";

export class Client
{
	private static _ssrData: SSRData;

	public static get ssrData(): SSRData
	{
		if (!this._ssrData)
		{
			const el = document.getElementById("__SSR_DATA__");
			if (el)
				el.remove();
			const __SSR_DATA__ = (window as any).__SSR_DATA__;
			if (__SSR_DATA__)
			{
				this._ssrData = JSON.parse(JSON.stringify(__SSR_DATA__));
				delete (window as any)["__SSR_DATA__"];
			}
			else
			{
				this._ssrData = { async: {} };
			}
		}
		return this._ssrData;
	}

	public static async render(App: React.ComponentClass | React.FC)
	{
		if (process.env.isDev)
		{
			console.log("live reload enabled!")
			const io = require("socket.io-client");
			const socket = io(`http://localhost:3030`);
			socket.on("reload", (data: any) => window.location.reload());
		}

		const asyncData = await asyncPrefetch(<App />, this.ssrData.async);

		ReactDOM.hydrate(
			<AsyncProvider initData={asyncData}>
				<App />
			</AsyncProvider>
		, document.getElementById("root"));
	}
}
