"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Landmark,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";

const goals = [
  {
    title: "Scholarships",
    description: "Financial support for your education",
    icon: GraduationCap,
  },
  {
    title: "Government jobs",
    description: "Public-sector roles you may qualify for",
    icon: Landmark,
  },
  {
    title: "Welfare schemes",
    description: "Government benefits and assistance",
    icon: Users,
  },
  {
    title: "Internships & jobs",
    description: "Early-career and professional opportunities",
    icon: BriefcaseBusiness,
  },
];

export default function GetStartedPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleGoal = (goal: string) => {
    setSelected((current) =>
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal]
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      {/* MAIN */}

      <section className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          {/* TOP PROGRESS */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCD2F2] text-[10px] font-semibold text-[#51427D]">
                1
              </span>

              <span className="text-[11px] font-medium text-[#5F5965]">
                Personalise your Aptora
              </span>
            </div>

            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#AAA4B1]">
              Step 1 of 3
            </span>
          </div>

          <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-[#E9E5EE]">
            <div className="h-full w-1/3 rounded-full bg-[#B9A9D8]" />
          </div>

          {/* CONTENT */}

          <div className="mt-16 grid gap-16 lg:grid-cols-[0.72fr_1.28fr]">
            {/* LEFT */}

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEAF5]">
                <Sparkles
                  size={19}
                  className="text-[#8A78AD]"
                />
              </div>

              <h1 className="mt-7 max-w-md text-[46px] font-semibold leading-[0.96] tracking-[-0.055em] sm:text-[58px]">
                Let&apos;s make
                <br />
                Aptora
                <br />
                <span className="text-[#8A78AD]">
                  relevant to you.
                </span>
              </h1>

              <p className="mt-7 max-w-md text-sm leading-7 text-[#89838F]">
                Tell us what you&apos;re interested in. We&apos;ll use this
                information to build a more relevant opportunity feed for you.
              </p>

              <div className="mt-10 hidden border-l-2 border-[#DDD6E8] pl-5 sm:block">
                <p className="text-xs font-medium text-[#5F5965]">
                  You can change these preferences later.
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#AAA4B1]">
                  Your selections help Aptora understand what opportunities
                  matter to you.
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div>
              <div className="mb-7">
                <p className="text-sm font-semibold text-[#403B47]">
                  What would you like to discover?
                </p>

                <p className="mt-1 text-xs text-[#AAA4B1]">
                  Select all that apply.
                </p>
              </div>

              {/* OPTIONS */}

              <div className="grid gap-3 sm:grid-cols-2">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selected.includes(goal.title);

                  return (
                    <button
                      key={goal.title}
                      type="button"
                      onClick={() => toggleGoal(goal.title)}
                      className={`group relative min-h-[145px] rounded-[22px] border p-5 text-left transition ${
                        isSelected
                          ? "border-[#B9A9D8] bg-[#F1EDF8] shadow-[0_8px_25px_rgba(91,75,138,0.06)]"
                          : "border-[#E5E1E9] bg-white hover:-translate-y-0.5 hover:border-[#D2C9DE] hover:shadow-[0_8px_25px_rgba(50,40,70,0.05)]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                            isSelected
                              ? "bg-[#DCD2F2] text-[#5B4B8A]"
                              : "bg-[#F2EFF6] text-[#8A78AD]"
                          }`}
                        >
                          <Icon size={18} strokeWidth={1.6} />
                        </div>

                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
                            isSelected
                              ? "border-[#B9A9D8] bg-[#DCD2F2] text-[#5B4B8A]"
                              : "border-[#DDD8E3] bg-white text-transparent"
                          }`}
                        >
                          <Check
                            size={13}
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-semibold text-[#403B47]">
                          {goal.title}
                        </p>

                        <p className="mt-1.5 max-w-[220px] text-[10px] leading-5 text-[#AAA4B1]">
                          {goal.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* SELECTED COUNT */}

              <div className="mt-7 flex items-center justify-between">
                <p className="text-[11px] text-[#AAA4B1]">
                  {selected.length === 0
                    ? "Choose at least one"
                    : `${selected.length} ${
                        selected.length === 1 ? "interest" : "interests"
                      } selected`}
                </p>

                <Link
                  href="/get-started/profile"
                  className={`group flex h-12 items-center gap-3 rounded-full px-7 text-xs font-semibold transition ${
                    selected.length > 0
                      ? "bg-[#DCD2F2] text-[#51427D] shadow-sm hover:bg-[#CEC1E9]"
                      : "pointer-events-none bg-[#E8E4EC] text-[#AAA4B1]"
                  }`}
                >
                  Continue

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM NOTE */}

      <div className="border-t border-[#E7E3EC] bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <p className="text-[10px] text-[#AAA4B1]">
            Aptora · Find opportunities that fit you.
          </p>

          <p className="hidden text-[10px] text-[#AAA4B1] sm:block">
            Your preferences stay under your control.
          </p>
        </div>
      </div>
    </main>
  );
}