"use client";

import { useEffect } from "react";
import { addNotification, fetchNotifications } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSocket } from "@/services/socket";
import type { Notification } from "@/types";

export const useSocketNotifications = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    dispatch(fetchNotifications());
    const socket = getSocket();
    const onNotification = (notification: Notification) => dispatch(addNotification(notification));

    socket.on("notification:new", onNotification);
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("notification:new", onNotification);
    };
  }, [dispatch, token]);
};
