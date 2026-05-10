"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerSchema } from "@/utils/validators";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((state) => state.auth);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role"),
      company: form.get("company") || undefined,
    });

    if (!parsed.success) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      await dispatch(register(parsed.data)).unwrap();
      router.push("/dashboard");
    } catch (error) {
      setError(typeof error === "string" ? error : "Unable to create account.");
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-lg gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Create your SyncUp account</h1>
        <p className="mt-2 text-sm text-slate-600">Choose candidate to apply for jobs or recruiter to post roles.</p>
      </div>
      <form className="grid gap-4" onSubmit={submit}>
        <input className="field" name="name" placeholder="Full name" />
        <input className="field" name="email" type="email" placeholder="Email" />
        <input className="field" name="password" type="password" placeholder="Password" />
        <select className="field" name="role" defaultValue="CANDIDATE">
          <option value="CANDIDATE">Candidate</option>
          <option value="EMPLOYER">Recruiter</option>
        </select>
        <input className="field" name="company" placeholder="Company, for recruiters" />
        {(error || authError) && <p className="text-sm text-red-600">{error || authError}</p>}
        <button className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-slate-600">
        Already registered? <Link className="font-semibold text-teal-700" href="/login">Login</Link>
      </p>
    </section>
  );
}
