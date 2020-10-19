import { Manifest } from "ssr/Manifest";
import { Server } from "./Server";

export class DevMiddleware
{
	public static initDevEnv(server: Server)
	{
		return new Promise((res, rej) => 
		{
			let resolved = false;
			if (process.send)
			{
				process.on("message", (msg) => 
				{
					server["_manifest"] = new Manifest(msg);
					if (!resolved)
					{
						resolved = true;
						res(msg);
					}
				});
				process.send("get-manifest");
			}
			else
			{
				rej("Could not send to master!");
			}
		});
	}
}
