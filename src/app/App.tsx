import React from "react";

import { Dynamic } from "ssr/async";

const App = () =>
{
	return (
		<Dynamic path={"./DynamicTest"} importer={() => import("./DynamicTest")} >
			{({ Component, error, isLoading }) => 
			{
				if(isLoading)
					return "Loading...";
				if(Component)
					return <Component />;
				return null;
			}}
		</Dynamic>
	);
}

export default App;
