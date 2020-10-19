import React from "react";
import { Async } from "ssr/async";

const App = () =>
{
	return (
		<Async id="12345" resolver={() => new Promise((res) => setTimeout(() => res(12345), 50))}>
			{({ data, error }, isResolving) => 
			{
				return <h1>{data + "woopy" || "hisdsd"}</h1>
			}}
		</Async>
	);
}

export default App;
