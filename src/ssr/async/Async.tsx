import React from "react";
import { JSXReturnTypes, transformJSX } from "utils/react";
import { AsyncContext } from "./AsyncContext";
import { AsyncData } from "./AsyncData";

export const Async: React.FC<AsyncProps<any>> = ({ id, componentID = "ASYNC", resolver, children, prefetch = true }) =>
{
	const ctx = React.useContext(AsyncContext);

	const asyncID = componentID + "/" + id;

	const resolvedData = ctx.get(asyncID);

	React.useEffect(() => 
	{
		if (!resolvedData)
			ctx.resolve(asyncID, resolver);
	}, []);

	if (resolvedData)
	{
		return transformJSX(children({ ...resolvedData, isResolving: false }));
	}
	else
	{
		if (ctx.isPrefetching)
			ctx.resolve(asyncID, resolver);
		return transformJSX(children({ data: null, error: null, isResolving: true}));
	}
}

type AsyncProps<D> = {
	componentID?: string;
	id: string;
	prefetch?: boolean;
	resolver: () => Promise<D>;
	children: (asyncData: AsyncData<D> & { isResolving: boolean }) => JSXReturnTypes;
};
