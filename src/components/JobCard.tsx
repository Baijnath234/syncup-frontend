"use client";

import type { Job } from "@/types";

export function JobCard({ job, onApply }: { job: Job; onApply?: (job: Job) => void }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{job.title}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {job.company}
            {job.location ? ` · ${job.location}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{job.status}</span>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{job.salary || "Salary not disclosed"}</p>
        {onApply && (
          <button className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800" onClick={() => onApply(job)}>
            Apply
          </button>
        )}
      </div>
    </article>
  );
}
