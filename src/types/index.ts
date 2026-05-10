export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  company?: string | null;
  bio?: string | null;
  resumeUrl?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location?: string | null;
  salary?: string | null;
  skills: string[];
  status: "OPEN" | "CLOSED";
  employerId: string;
  createdAt: string;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  status: "APPLIED" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";
  aiScore?: number | null;
  aiSummary?: string | null;
  createdAt: string;
  job: Job;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
