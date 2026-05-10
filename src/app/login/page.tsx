"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginSchema } from "@/utils/validators";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error: authError } = useAppSelector((state) => state.auth);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (!parsed.success) {
      setError("Enter a valid email and password.");
      return;
    }

    try {
      await dispatch(login(parsed.data)).unwrap();
      router.push("/dashboard");
    } catch (error) {
      setError(typeof error === "string" ? error : "Invalid email or password.");
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-md gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage jobs, applications, and notifications.</p>
      </div>
      <form className="grid gap-4" onSubmit={submit}>
        <input className="field" name="email" type="email" placeholder="Email" />
        <input className="field" name="password" type="password" placeholder="Password" />
        {(error || authError) && <p className="text-sm text-red-600">{error || authError}</p>}
        <button className="rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="text-sm text-slate-600">
        New to SyncUp? <Link className="font-semibold text-teal-700" href="/register">Create an account</Link>
      </p>
    </section>
  );
}
