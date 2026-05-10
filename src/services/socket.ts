"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (socket) return socket;

  const token = typeof window !== "undefined" ? localStorage.getItem("syncup_token") : null;
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
    autoConnect: Boolean(token),
    auth: { token },
  });

  return socket;
};

export const reconnectSocket = () => {
  const token = localStorage.getItem("syncup_token");
  const activeSocket = getSocket();
  activeSocket.auth = { token };
  activeSocket.connect();
};

export const disconnectSocket = () => {
  socket?.disconnect();
};
