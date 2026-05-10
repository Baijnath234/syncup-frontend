"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApplyModal } from "@/components/ApplyModal";
import { JobCard } from "@/components/JobCard";
import { fetchJobs } from "@/redux/jobsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Job } from "@/types";

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.jobs);
  const user = useAppSelector((state) => state.auth.user);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    dispatch(fetchJobs({
      search: String(form.get("search") || ""),
      location: String(form.get("location") || ""),
      skill: String(form.get("skill") || ""),
    }));
  };

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Open jobs</h1>
          <p className="mt-2 text-sm text-slate-600">Search roles with Redis-backed backend caching.</p>
        </div>
      </div>
      <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4" onSubmit={search}>
        <input className="field" name="search" placeholder="Role or company" />
        <input className="field" name="location" placeholder="Location" />
        <input className="field" name="skill" placeholder="Skill" />
        <button className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          Search
        </button>
      </form>
      {loading ? (
        <p className="text-sm text-slate-600">Loading jobs...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((job) => (
            <JobCard key={job.id} job={job} onApply={user?.role === "CANDIDATE" || user?.role === "ADMIN" ? setSelectedJob : undefined} />
          ))}
        </div>
      )}
      {!loading && items.length === 0 && <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No jobs found.</p>}
      {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </section>
  );
}
