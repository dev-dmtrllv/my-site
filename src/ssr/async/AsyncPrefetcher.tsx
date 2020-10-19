import React from "react";
import ReactDOMServer from "react-dom/server";
import { AsyncResolver } from "./AsyncContext";
import { AsyncDataMap } from "./AsyncData";
import { AsyncProvider } from "./AsyncProvider";

export const asyncPrefetch = async (app: JSX.Element, initData: AsyncDataMap = {}) =>
{
	const resolvers: { [key: string]: AsyncResolver<any> } = {};

	ReactDOMServer.renderToStaticMarkup(
		<AsyncProvider isPrefetching={true} initData={initData} onResolve={(k, r) => resolvers[k] = r}>
			{app}
		</AsyncProvider>
	);

	if (Object.keys(resolvers).length > 0)
	{
		for (const key in resolvers)
		{
			const r = resolvers[key];
			if (r)
			{
				const asyncData = { data: null, error: null };
				try
				{
					asyncData.data = await r();
				}
				catch (e)
				{
					asyncData.error = e;
				}
				initData[key] = asyncData;
			}
		}
		await asyncPrefetch(app, initData);
	}
	return initData;
}
