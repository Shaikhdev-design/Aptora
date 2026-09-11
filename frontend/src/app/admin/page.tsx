"use client";

import Link from "next/link";
import {
  ArrowRight,
  Database,
  FileCheck2,
  ShieldCheck,
  Users,
  TrendingUp,
  Clock3,
} from "lucide-react";

const stats = [
  {
    label: "Total users",
    value: "1,284",
    change: "+12.4%",
    icon: Users,
  },
  {
    label: "Opportunities",
    value: "347",
    change: "+8.2%",
    icon: Database,
  },
  {
    label: "Pending verification",
    value: "18",
    change: "Needs attention",
    icon: FileCheck2,
  },
  {
    label: "Active matches",
    value: "2,641",
    change: "+16.8%",
    icon: TrendingUp,
  },
];

const adminLinks = [
  {
    title: "Opportunities",
    description: "Create, edit and manage available opportunities.",
    href: "/admin/opportunities",
    icon: Database,
  },
  {
    title: "Data sources",
    description: "Manage government and external data sources.",
    href: "/admin/data-sources",
    icon: Database,
  },
  {
    title: "Verification",
    description: "Review opportunities waiting for verification.",
    href: "/admin/verification",
    icon: ShieldCheck,
  },
  {
    title: "Users",
    description: "View and manage registered Aptora users.",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <header className="border-b border-[#E7E3EC] bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
              <span className="text-[15px] font-semibold">A</span>
            </div>
            <span className="text-[19px] font-semibold tracking-[-0.04em]">
              Aptora
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] text-[#96909C] sm:block">
              Administration
            </span>

            <Link
              href="/dashboard"
              className="rounded-full border border-[#E2DDE6] px-4 py-2 text-[9px] font-medium text-[#6F6877] hover:border-[#CFC5D8] hover:text-[#5B4B8A]"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1250px] px-6 py-10 sm:px-8 lg:py-14">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
            Admin
          </p>

          <h1 className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.055em] sm:text-[52px]">
            Aptora overview
          </h1>

          <p className="mt-4 max-w-[560px] text-[11px] leading-6 text-[#85808B]">
            Manage opportunities, data sources, verification and users
            from one place.
          </p>
        </div>

        <section className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-[22px] border border-[#E4DFE8] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7] text-[#5B4B8A]">
                    <Icon size={15} />
                  </div>

                  <span className="text-[8px] text-[#A39CA9]">
                    {stat.change}
                  </span>
                </div>

                <p className="mt-6 text-[28px] font-semibold tracking-[-0.04em]">
                  {stat.value}
                </p>

                <p className="mt-1 text-[9px] text-[#8E8893]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {adminLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-[25px] border border-[#E4DFE8] bg-white p-6 transition hover:border-[#CEC4D8] hover:shadow-[0_15px_40px_rgba(50,40,70,0.05)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1EDF7] text-[#5B4B8A]">
                    <Icon size={18} />
                  </div>

                  <ArrowRight
                    size={15}
                    className="text-[#AAA4B1] transition group-hover:translate-x-1 group-hover:text-[#5B4B8A]"
                  />
                </div>

                <h2 className="mt-6 text-[15px] font-semibold">
                  {item.title}
                </h2>

                <p className="mt-2 max-w-[400px] text-[10px] leading-5 text-[#8B8590]">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8 rounded-[25px] border border-[#E4DFE8] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7] text-[#5B4B8A]">
              <Clock3 size={15} />
            </div>

            <div>
              <h2 className="text-[13px] font-semibold">
                Recent activity
              </h2>

              <p className="mt-1 text-[9px] text-[#96909F]">
                Latest administrative activity across Aptora.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#EEEAEF] pt-5 text-[9px] text-[#817B87]">
            System is running normally. No critical issues reported.
          </div>
        </section>
      </div>
    </main>
  );
}