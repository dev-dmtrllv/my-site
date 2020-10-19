export type AsyncData<D> = {
	data: D | null;
	error: Error | null;
};

export type AsyncDataMap = {
	[key: string]: AsyncData<any>;
}
