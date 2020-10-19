declare interface Environment
{
	isDev: boolean;
	isServer: boolean;
	isClient: boolean;
}

declare const env: Environment & NodeJS.ProcessEnv;

declare var process: NodeJS.Process & { env: Environment & NodeJS.ProcessEnv };
