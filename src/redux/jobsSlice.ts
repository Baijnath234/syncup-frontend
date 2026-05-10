"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, unwrap } from "@/services/api";
import type { Job } from "@/types";

interface JobsState {
  items: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetch",
  async (filters?: { search?: string; location?: string; skill?: string }) => {
    return unwrap<Job[]>(await api.get("/jobs", { params: filters }));
  },
);

export const createJob = createAsyncThunk(
  "jobs/create",
  async (payload: { title: string; description: string; company: string; location?: string; salary?: string; skills: string[] }) => {
    return unwrap<Job>(await api.post("/jobs", payload));
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unable to load jobs";
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default jobsSlice.reducer;
