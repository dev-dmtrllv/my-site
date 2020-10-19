import React from "react";
import { AsyncData } from "./AsyncData";

export const AsyncContext = React.createContext<AsyncContextType>({
	data: {},
	get: (key: string) => null,
	resolve: (key, resolver) => { return new Promise(res => res({ data: null, error: null })); },
	isPrefetching: false,
});

export type AsyncContextType = {
	data: { [key: string]: AsyncData<any> };
	get: <D>(key: string) => AsyncData<D> | null;
	isPrefetching: boolean;
	resolve: <D>(key: string, resolver: AsyncResolver<D>) => void;
};

export type AsyncResolver<D> = () => Promise<D>;
