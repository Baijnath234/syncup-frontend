"use client";

import axios from "axios";

export const api = axios.create({
  baseURL: "http://65.1.132.216:5000/api",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("syncup_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const unwrap = <T>(response: { data: { data: T } }) => response.data.data;
