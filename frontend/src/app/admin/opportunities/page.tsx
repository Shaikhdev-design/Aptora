"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Edit3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const initialOpportunities = [
  {
    title: "Junior Data Analyst",
    organisation: "Analytics & Technology",
    type: "Job",
    status: "Published",
  },
  {
    title: "Digital India Internship",
    organisation: "Government of India",
    type: "Internship",
    status: "Published",
  },
  {
    title: "Post-Matric Scholarship",
    organisation: "Government of India",
    type: "Scholarship",
    status: "Published",
  },
  {
    title: "Women in Technology Scholarship",
    organisation: "Education Foundation",
    type: "Scholarship",
    status: "Draft",
  },
  {
    title: "Student Skill Development Scheme",
    organisation: "Government Initiative",
    type: "Scheme",
    status: "Published",
  },
];

export default function AdminOpportunitiesPage() {
  const [search, setSearch] = useState("");

  const filtered = initialOpportunities.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.organisation.toLowerCase().includes(search.toLowerCase())
  );

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

          <span className="text-[17px] font-semibold">Aptora</span>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-8 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
              Admin / Opportunities
            </p>

            <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.05em]">
              Opportunities
            </h1>

            <p className="mt-3 text-[10px] text-[#88818E]">
              Manage opportunities available across Aptora.
            </p>
          </div>

          <button className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#5B4B8A] px-5 text-[9px] font-medium text-white hover:bg-[#4F417A]">
            <Plus size={13} />
            Add opportunity
          </button>
        </div>

        <div className="mt-8 rounded-[23px] border border-[#E4DFE8] bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search opportunities..."
                className="h-11 w-full rounded-[15px] bg-[#FAF9FC] pl-10 pr-4 text-[10px] outline-none placeholder:text-[#AAA4B1]"
              />
            </div>

            <button className="hidden h-11 items-center gap-2 rounded-[15px] border border-[#E4DFE8] px-4 text-[9px] text-[#77717F] sm:flex">
              All types
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[24px] border border-[#E4DFE8] bg-white">
          <div className="hidden grid-cols-[1fr_180px_110px_90px] border-b border-[#EEEAEF] px-6 py-4 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#AAA4B1] sm:grid">
            <span>Opportunity</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filtered.map((item) => (
            <div
              key={item.title}
              className="grid gap-4 border-b border-[#F0ECF2] px-5 py-5 last:border-b-0 sm:grid-cols-[1fr_180px_110px_90px] sm:items-center sm:px-6"
            >
              <div>
                <h2 className="text-[11px] font-semibold">
                  {item.title}
                </h2>
                <p className="mt-1 text-[8px] text-[#918A96]">
                  {item.organisation}
                </p>
              </div>

              <span className="text-[9px] text-[#77717F]">
                {item.type}
              </span>

              <span
                className={`w-fit rounded-full px-2.5 py-1 text-[7px] font-medium ${
                  item.status === "Published"
                    ? "bg-[#EEF4EF] text-[#6F8173]"
                    : "bg-[#F5F0E9] text-[#967D5F]"
                }`}
              >
                {item.status}
              </span>

              <div className="flex gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E0E8] text-[#96909C] hover:text-[#5B4B8A]">
                  <Edit3 size={11} />
                </button>

                <button className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E0E8] text-[#96909C] hover:text-[#9A6E6E]">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}