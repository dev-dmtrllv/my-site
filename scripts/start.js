const { fork } = require("child_process");
const { resolve } = require("./paths");
const { watch } = require("./watch");
const webpack = require("webpack");
const { createClientConfig } = require("./client-config");

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(3030, () => console.log('live reloader listening on *:3030'));

let server = null;

const sendServer = (msg) => 
{
	if (server && "send" in server)
	{
		server.send(msg);
	}
}

let manifest = {};

const updateManifest = (m) =>
{
	manifest = m;
	sendServer(m);
}

const watchClient = (onStarted) =>
{
	let didStart = false;
	webpack(createClientConfig({ onManifest: updateManifest })).watch({}, (err, stats) =>
	{
		if (err)
			console.error(err);
		else
			console.log(stats.toString("minimal"));

		if (!didStart)
		{
			didStart = true;
			onStarted();
		}
		else
		{
			//"client-change";
			io.emit("reload");
		}
	});
}

const startServer = () =>
{
	if (server)
	{
		console.log("Restarting server...\r\n");
		server.kill();
	}
	else
	{
		console.log("Starting server...\r\n");
	}

	server = fork("./scripts/start-server", ["--trace-deprecation"]);
	server.on("message", (msg) => 
	{
		if (msg === "get-manifest")
			sendServer(manifest);
	});
	io.emit("reload");
};

watchClient(() => 
{
	watch(resolve("src", "server"), () => startServer());
	watch(resolve("src", "ssr"), () => startServer());

	startServer();
});
