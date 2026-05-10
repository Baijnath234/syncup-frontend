"use client";

import { FormEvent, useEffect, useState } from "react";
import { loadProfile } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { api } from "@/services/api";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("syncup_token")) dispatch(loadProfile());
  }, [dispatch]);

  const uploadResume = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    const file = new FormData(event.currentTarget).get("resume");
    if (!(file instanceof File) || !file.name) {
      setMessage("Choose a resume file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    await api.post("/auth/resume", formData);
    await dispatch(loadProfile());
    setMessage("Resume uploaded successfully.");
  };

  if (!user) {
    return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">Login to view your profile.</p>;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{user.name}</h1>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Email</dt>
            <dd className="mt-1 text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Role</dt>
            <dd className="mt-1 text-slate-900">{user.role}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Company</dt>
            <dd className="mt-1 text-slate-900">{user.company || "Not set"}</dd>
          </div>
        </dl>
      </div>
      <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" onSubmit={uploadResume}>
        <h2 className="text-lg font-semibold text-slate-950">Resume</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Upload a PDF, DOC, DOCX, or TXT resume. The backend stores it through S3 when cloud credentials are available and extracts text for AI matching.</p>
        <input className="field mt-5" name="resume" type="file" accept=".pdf,.doc,.docx,.txt" />
        {user.resumeUrl && <p className="mt-3 text-sm text-slate-600">Current resume: {user.resumeUrl}</p>}
        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
        <button className="mt-5 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800">
          Upload resume
        </button>
      </form>
    </section>
  );
}
