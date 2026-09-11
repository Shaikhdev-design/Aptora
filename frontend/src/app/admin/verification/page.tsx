"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  ExternalLink,
  X,
} from "lucide-react";

const pending = [
  {
    title: "Women in Technology Scholarship",
    organisation: "Education Foundation",
    submitted: "Today",
    type: "Scholarship",
  },
  {
    title: "Graduate Data Fellowship",
    organisation: "Research Foundation",
    submitted: "Yesterday",
    type: "Fellowship",
  },
  {
    title: "Youth Employment Support Scheme",
    organisation: "Government Initiative",
    submitted: "2 days ago",
    type: "Scheme",
  },
];

export default function VerificationPage() {
  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <header className="border-b border-[#E7E3EC] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between px-6 sm:px-8">
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
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
          Admin / Verification
        </p>

        <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.05em]">
          Verification
        </h1>

        <p className="mt-3 max-w-[540px] text-[10px] leading-5 text-[#88818E]">
          Review newly submitted opportunities before they become
          available to Aptora users.
        </p>

        <div className="mt-8 space-y-3">
          {pending.map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-[#E4DFE8] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0E9] text-[#967D5F]">
                    <Clock3 size={17} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[12px] font-semibold">
                        {item.title}
                      </h2>

                      <span className="rounded-full bg-[#F1EDF7] px-2.5 py-1 text-[7px] text-[#6D5D89]">
                        {item.type}
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] text-[#918A96]">
                      {item.organisation}
                    </p>

                    <p className="mt-2 text-[8px] text-[#AAA4B1]">
                      Submitted {item.submitted}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex h-9 items-center gap-2 rounded-full border border-[#E1DCE5] px-4 text-[8px] font-medium text-[#77717F] hover:text-[#5B4B8A]">
                    <ExternalLink size={11} />
                    Review
                  </button>

                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF4EF] text-[#6F8173] hover:bg-[#E3EEE5]">
                    <Check size={13} />
                  </button>

                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7EEEE] text-[#9A6E6E] hover:bg-[#F1E5E5]">
                    <X size={13} />
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