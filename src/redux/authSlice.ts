"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api, unwrap } from "@/services/api";
import { reconnectSocket, disconnectSocket } from "@/services/socket";
import type { User, Notification } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  notifications: [],
  loading: false,
  error: null,
};

const apiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || error.message || fallback;
  }

  return fallback;
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return unwrap<{ user: User; token: string }>(await api.post("/auth/login", payload));
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Login failed"));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string; role: string; company?: string },
    { rejectWithValue },
  ) => {
    try {
      return unwrap<{ user: User; token: string }>(await api.post("/auth/register", payload));
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, "Registration failed"));
    }
  },
);

export const loadProfile = createAsyncThunk("auth/me", async () => {
  return unwrap<User>(await api.get("/auth/me"));
});

export const fetchNotifications = createAsyncThunk("auth/notifications", async () => {
  return unwrap<Notification[]>(await api.get("/auth/notifications"));
});

const saveSession = (token: string, user: User) => {
  localStorage.setItem("syncup_token", token);
  localStorage.setItem("syncup_user", JSON.stringify(user));
  reconnectSocket();
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      const token = localStorage.getItem("syncup_token");
      const user = localStorage.getItem("syncup_user");
      state.token = token;
      state.user = user ? JSON.parse(user) : null;
      if (token) reconnectSocket();
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.notifications = [];
      localStorage.removeItem("syncup_token");
      localStorage.removeItem("syncup_user");
      disconnectSocket();
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveSession(action.payload.token, action.payload.user);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        saveSession(action.payload.token, action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string | undefined) || action.error.message || "Login failed";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string | undefined) || action.error.message || "Registration failed";
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("syncup_user", JSON.stringify(action.payload));
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
  },
});

export const { hydrateAuth, logout, addNotification } = authSlice.actions;
export default authSlice.reducer;
