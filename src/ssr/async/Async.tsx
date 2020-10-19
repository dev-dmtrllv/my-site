import React from "react";
import { AsyncContext } from "./AsyncContext";
import { AsyncData } from "./AsyncData";

const parseJSX = (jsx: JSX.Element | string | number | null) =>
{
	if (typeof jsx === "string" || typeof jsx === "number" || typeof jsx === "boolean")
		return <>{new String(jsx)}</>;
	else if (Array.isArray(jsx))
		return <>{jsx.map((_, i) => <React.Fragment key={i}>{_}</React.Fragment>)}</>;
	else
		return jsx;
}

export const Async: React.FC<AsyncProps<any>> = ({ id, componentID = "ASYNC", resolver, children, prefetch = true }) =>
{
	const ctx = React.useContext(AsyncContext);

	const asyncID = componentID + "/" + id;

	const resolvedData = ctx.get(asyncID);

	React.useEffect(() => 
	{
		if(!resolvedData)
			ctx.resolve(asyncID, resolver);
	}, []);

	if (resolvedData)
	{
		return parseJSX(children(resolvedData, false));
	}
	else
	{
		if (ctx.isPrefetching)
			ctx.resolve(asyncID, resolver);
		return parseJSX(children({ data: null, error: null }, true))
	}
}

type AsyncProps<D> = {
	componentID?: string;
	id: string;
	prefetch?: boolean;
	resolver: () => Promise<D>;
	children: (asyncData: AsyncData<D>, isResolving: boolean) => JSX.Element | string | number | null;
};
