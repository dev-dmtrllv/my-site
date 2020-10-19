import React from "react";
import { Async } from "ssr/async";

const DynamicTest = () =>
{
	return (
		<Async id="test" resolver={() => new Promise(res => setTimeout(() => res(123), 10))}>
			{({ data }) => 
			{
				return data;
			}}
		</Async>
	);
}

export default DynamicTest;
