import Link from "next/link";

export default function Home() {
  return (
    <section className="grid min-h-[72vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-7">
        <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800">
          AI recruitment workspace
        </div>
        <div className="space-y-5">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            SyncUp
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Post roles, search candidates, upload resumes, and let AI surface the strongest job matches while teams stay updated in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800" href="/jobs">
            Browse jobs
          </Link>
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100" href="/register">
            Create account
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3">
          {[
            ["Resume AI", "Scores candidates against skills, role context, and uploaded resumes."],
            ["Redis search", "Frequently requested job searches return quickly from cache."],
            ["S3 storage", "Resume uploads are sent to cloud storage when credentials are configured."],
            ["Live updates", "Socket notifications keep recruiters and candidates in sync."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
