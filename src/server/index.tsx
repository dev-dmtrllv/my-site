import { Server } from "ssr/server";

const server = new Server(3001);

server.useRenderer("/", () => import("../app/App"));
server.useRenderer("/test", () => import("../app/App"));

server.start();
