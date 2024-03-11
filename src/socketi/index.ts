import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "app-id",
  key: "app-key",
  secret: "app-secret",
  cluster: "",
  useTLS: false,
  host: process.env.NEXT_PUBLIC_PUSH_SERVER_HOST,
  port: "6001",
});

export const pusherClient = new PusherClient("app-key", {
  cluster: "",
  httpHost: process.env.NEXT_PUBLIC_PUSH_SERVER_HOST,
  httpPort: 6001,
  wsHost: process.env.NEXT_PUBLIC_PUSH_SERVER_HOST,
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
  authTransport: "ajax",
  authEndpoint: "/api/pusher-auth",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
