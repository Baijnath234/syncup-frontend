import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/redux/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyncUp",
  description: "AI-powered recruitment and job matching platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950">
        <Providers>
          <Navbar />
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
