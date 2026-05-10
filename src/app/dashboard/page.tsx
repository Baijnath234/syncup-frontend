"use client";

import { FormEvent, useEffect, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { api, unwrap } from "@/services/api";
import { createJob, fetchJobs } from "@/redux/jobsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { jobSchema } from "@/utils/validators";
import type { Application } from "@/types";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const jobs = useAppSelector((state) => state.jobs.items);
  const [applications, setApplications] = useState<Application[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(fetchJobs(user?.role === "EMPLOYER" ? { } : undefined));
    if (user) {
      api.get("/applications").then((response) => setApplications(unwrap<Application[]>(response))).catch(() => setApplications([]));
    }
  }, [dispatch, user]);

  const submitJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const parsed = jobSchema.safeParse({
      title: form.get("title"),
      company: form.get("company"),
      location: form.get("location") || undefined,
      salary: form.get("salary") || undefined,
      description: form.get("description"),
      skills: form.get("skills"),
    });

    if (!parsed.success) {
      setMessage("Complete the job title, company, description, and skills.");
      return;
    }

    await dispatch(createJob({
      ...parsed.data,
      skills: parsed.data.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
    }));
    event.currentTarget.reset();
    setMessage("Job posted successfully.");
  };

  if (!user) {
    return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Login to open your dashboard.</p>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">{user.role === "EMPLOYER" ? "Post roles and review candidates." : "Track applications and AI match feedback."}</p>
      </div>

      {user.role === "EMPLOYER" || user.role === "ADMIN" ? (
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <form className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submitJob}>
            <h2 className="text-lg font-semibold text-slate-950">Post a job</h2>
            <input className="field" name="title" placeholder="Job title" />
            <input className="field" name="company" placeholder="Company" defaultValue={user.company || ""} />
            <input className="field" name="location" placeholder="Location" />
            <input className="field" name="salary" placeholder="Salary range" />
            <input className="field" name="skills" placeholder="Skills, comma separated" />
            <textarea className="field min-h-36" name="description" placeholder="Job description" />
            {message && <p className="text-sm text-slate-700">{message}</p>}
            <button className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800">Post job</button>
          </form>
          <div className="grid gap-4">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <article key={application.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">{application.job.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{application.job.company}</p>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">{application.status}</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">AI score: {application.aiScore ?? "Pending"}</p>
              {application.aiSummary && <p className="mt-2 text-sm leading-6 text-slate-600">{application.aiSummary}</p>}
            </article>
          ))}
          {applications.length === 0 && <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No applications yet.</p>}
        </div>
      )}
    </section>
  );
}
