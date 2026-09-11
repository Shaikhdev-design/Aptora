"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";

const users = [
  {
    name: "Aarav Mehta",
    email: "aarav@example.com",
    role: "User",
    joined: "28 Aug 2026",
    status: "Active",
  },
  {
    name: "Riya Shah",
    email: "riya@example.com",
    role: "User",
    joined: "26 Aug 2026",
    status: "Active",
  },
  {
    name: "Kabir Patel",
    email: "kabir@example.com",
    role: "User",
    joined: "24 Aug 2026",
    status: "Active",
  },
  {
    name: "Admin",
    email: "admin@aptora.app",
    role: "Admin",
    joined: "01 Aug 2026",
    status: "Active",
  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

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
          Admin / Users
        </p>

        <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.05em]">
          Users
        </h1>

        <p className="mt-3 text-[10px] text-[#88818E]">
          View registered users and account activity.
        </p>

        <div className="mt-8 rounded-[23px] border border-[#E4DFE8] bg-white p-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users..."
              className="h-11 w-full rounded-[15px] bg-[#FAF9FC] pl-10 pr-4 text-[10px] outline-none placeholder:text-[#AAA4B1]"
            />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((user) => (
            <div
              key={user.email}
              className="rounded-[23px] border border-[#E4DFE8] bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F1EDF7] text-[#5B4B8A]">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <h2 className="text-[12px] font-semibold">
                      {user.name}
                    </h2>

                    <p className="mt-1 text-[9px] text-[#918A96]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-[7px] uppercase tracking-[0.12em] text-[#AAA4B1]">
                      Role
                    </p>
                    <p className="mt-1 text-[9px] text-[#77717F]">
                      {user.role}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] uppercase tracking-[0.12em] text-[#AAA4B1]">
                      Joined
                    </p>
                    <p className="mt-1 text-[9px] text-[#77717F]">
                      {user.joined}
                    </p>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full bg-[#EEF4EF] px-3 py-1.5 text-[7px] font-medium text-[#6F8173]">
                    <ShieldCheck size={10} />
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}