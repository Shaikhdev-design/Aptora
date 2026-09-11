"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
} from "lucide-react";

const sources = [
  {
    name: "National Scholarship Portal",
    type: "Scholarships",
    status: "Connected",
    updated: "Today",
  },
  {
    name: "Government Schemes",
    type: "Schemes",
    status: "Connected",
    updated: "Today",
  },
  {
    name: "Employment Exchange",
    type: "Jobs",
    status: "Connected",
    updated: "Yesterday",
  },
  {
    name: "University Opportunities",
    type: "Education",
    status: "Needs review",
    updated: "3 days ago",
  },
];

export default function DataSourcesPage() {
  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <header className="border-b border-[#E7E3EC] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1250px] items-center justify-between px-6 sm:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-[10px] text-[#817A88] hover:text-[#5B4B8A]"
          >
            <ArrowLeft size={13} />
            Admin
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
              A
            </div>
            <span className="text-[17px] font-semibold">Aptora</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-8 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
              Admin / Sources
            </p>

            <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.05em]">
              Data sources
            </h1>

            <p className="mt-3 text-[10px] leading-5 text-[#88818E]">
              Manage the sources Aptora uses to discover opportunities.
            </p>
          </div>

          <button className="flex h-10 w-fit items-center gap-2 rounded-full bg-[#5B4B8A] px-5 text-[9px] font-medium text-white hover:bg-[#4F417A]">
            <Plus size={13} />
            Add source
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {sources.map((source) => (
            <div
              key={source.name}
              className="rounded-[23px] border border-[#E4DFE8] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDF7] text-[#5B4B8A]">
                    <Database size={17} />
                  </div>

                  <div>
                    <h2 className="text-[13px] font-semibold">
                      {source.name}
                    </h2>

                    <p className="mt-1 text-[9px] text-[#918A96]">
                      {source.type} · Updated {source.updated}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`flex items-center gap-1.5 text-[8px] font-medium ${
                      source.status === "Connected"
                        ? "text-[#6F8173]"
                        : "text-[#9A8264]"
                    }`}
                  >
                    <CheckCircle2 size={11} />
                    {source.status}
                  </span>

                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E0E8] text-[#9B94A1] hover:text-[#5B4B8A]">
                    <RefreshCw size={12} />
                  </button>

                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E0E8] text-[#9B94A1] hover:text-[#5B4B8A]">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}