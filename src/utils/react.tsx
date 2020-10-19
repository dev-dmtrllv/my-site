import React from "react";

export type JSXReturnTypes = JSX.Element | string | number | null;

export const transformJSX = (jsx: JSXReturnTypes) =>
{
	if (typeof jsx === "string" || typeof jsx === "number" || typeof jsx === "boolean")
	return <>{new String(jsx)}</>;
else if (Array.isArray(jsx))
	return <>{jsx.map((_, i) => <React.Fragment key={i}>{_}</React.Fragment>)}</>;
else
	return jsx;
}
