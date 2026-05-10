"use client";

import { FormEvent, useState } from "react";
import { api } from "@/services/api";
import type { Job } from "@/types";

export function ApplyModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("jobId", job.id);
    formData.append("coverLetter", coverLetter);
    if (resume) formData.append("resume", resume);

    try {
      await api.post("/applications", formData);
      setMessage("Application submitted successfully.");
    } catch {
      setMessage("Unable to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onSubmit={submit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Apply for {job.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{job.company}</p>
          </div>
          <button type="button" className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100" onClick={onClose}>
            Close
          </button>
        </div>
        <textarea
          className="field mt-5 min-h-32"
          placeholder="Cover letter"
          value={coverLetter}
          onChange={(event) => setCoverLetter(event.target.value)}
        />
        <input className="field mt-3" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setResume(event.target.files?.[0] || null)} />
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
        <button className="mt-5 w-full rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60" disabled={loading}>
          {loading ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </div>
  );
}
