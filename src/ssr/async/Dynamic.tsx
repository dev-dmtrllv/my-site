import React from "react";
import { JSXReturnTypes, transformJSX } from "utils/react";
import { Async } from "./Async";

export const Dynamic: React.FC<DynamicProps> = ({ path, importer, prefetch, children }) =>
{
	const resolver = async () =>
	{
		const componentModule = await importer();
		if(!componentModule.default)
			throw new Error(`${path} has no default export!`);
		return componentModule.default;
	}
	return (
		<Async componentID="DYNAMIC" id={path} resolver={resolver} prefetch={prefetch}>
			{({ data, error, isResolving }) => transformJSX(children({ isLoading: isResolving, Component: data, error }))}
		</Async>
	);
}

type DynamicProps = {
	path: string;
	prefetch?: boolean;
	children: (props: { Component: React.ComponentClass | React.FC | null, isLoading: boolean; error: Error | null; }) => JSXReturnTypes;
	importer: () => Promise<{ default: React.ComponentClass | React.FC }>;
};
