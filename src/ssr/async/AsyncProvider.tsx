import React from "react";
import { AsyncContext, AsyncResolver } from "./AsyncContext"
import { AsyncData } from "./AsyncData";

export const AsyncProvider: React.FC<AsyncProviderProps> = ({ isPrefetching = false, onResolve, initData = {}, children }) =>
{
	const [data, setData] = React.useState<{ [key: string]: AsyncData<any> }>(initData);

	const get = (key: string) => data[key] || null;

	const resolve = async (key: string, resolver: AsyncResolver<any>) =>
	{
		if (isPrefetching)
		{
			onResolve && onResolve(key, resolver);
		}
		else
		{
			const asyncData = {
				data: null,
				error: null
			};
			try
			{
				asyncData.data = await resolver();
			}
			catch (e)
			{
				asyncData.error = e;
			}
			setData({ ...data, [key]: asyncData });
		}
	}

	return (
		<AsyncContext.Provider value={{ data, get, isPrefetching, resolve }}>
			{children}
		</AsyncContext.Provider>
	);
}

type AsyncProviderProps = {
	initData?: { [key: string]: AsyncData<any> };
	isPrefetching?: boolean;
	onResolve?: (key: string, resolver: AsyncResolver<any>) => void;
}
