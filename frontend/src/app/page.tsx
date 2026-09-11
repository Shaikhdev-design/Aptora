"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Landmark,
  Search,
  Sparkles,
  UserRound,
  Check,
} from "lucide-react";

const opportunities = [
  {
    icon: GraduationCap,
    category: "SCHOLARSHIP",
    title: "Merit Scholarship",
    description: "For undergraduate students",
    amount: "₹50,000",
    match: "96%",
  },
  {
    icon: BriefcaseBusiness,
    category: "GOVERNMENT JOB",
    title: "Junior Data Analyst",
    description: "Mumbai · Full time",
    amount: "₹42K–₹68K",
    match: "91%",
  },
  {
    icon: Landmark,
    category: "WELFARE SCHEME",
    title: "Education Support",
    description: "Student assistance",
    amount: "₹25,000",
    match: "88%",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about yourself",
    description:
      "Create your profile with your education, skills, interests and the kind of opportunities you're looking for.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Aptora checks the fit",
    description:
      "We compare your profile with opportunity requirements and identify where you meet the eligibility criteria.",
    icon: Search,
  },
  {
    number: "03",
    title: "Discover what fits",
    description:
      "Get a personalised list of scholarships, jobs, schemes and other opportunities worth exploring.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#24212A]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden px-6 pb-20 pt-24 sm:px-10 sm:pt-28 lg:px-16 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-[#EEEAF5]" />

        <div className="pointer-events-none absolute right-20 top-20 h-[300px] w-[300px] rounded-full border border-[#5B4B8A]/10" />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
            {/* LEFT */}

            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#5B4B8A]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77727F]">
                  Opportunity intelligence
                </span>
              </div>

              <h1 className="max-w-[800px] text-[58px] font-semibold leading-[0.93] tracking-[-0.065em] sm:text-[78px] lg:text-[100px]">
                Find what
                <br />
                <span className="text-[#5B4B8A]">fits you.</span>
              </h1>

              <p className="mt-9 max-w-[570px] text-[16px] leading-7 text-[#77727F] sm:text-[17px]">
                Aptora finds scholarships, government jobs, welfare schemes,
                grants and other opportunities based on your profile and
                eligibility.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {/* FIND OPPORTUNITIES */}

                <Link
                  href="/get-started"
                  className="group flex h-12 items-center justify-center gap-2 rounded-full bg-[#C9BDE7] px-10 text-[16px] font-medium text-[#20201D] shadow-[0_12px_35px_rgba(91,75,138,0.12)] transition hover:bg-[#BDAFDF]"
                >
                  Find opportunities

                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

                {/* EXPLORE OPPORTUNITIES */}

                <Link
                  href="/opportunities"
                  className="group flex h-12 items-center justify-center gap-2 rounded-full border border-[#E5E1E9] bg-white px-10 text-[16px] font-medium text-[#29252F] transition hover:bg-[#FAF9FC]"
                >
                  Explore opportunities

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-7">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.17em] text-[#AAA4B1]">
                    One profile
                  </p>

                  <p className="mt-1 text-xs text-[#77727F]">
                    Multiple opportunity types
                  </p>
                </div>

                <div className="h-8 w-px bg-[#E4E0E8]" />

                <div>
                  <p className="text-[9px] uppercase tracking-[0.17em] text-[#AAA4B1]">
                    Smart matching
                  </p>

                  <p className="mt-1 text-xs text-[#77727F]">Ranked for you</p>
                </div>
              </div>
            </div>

            {/* RIGHT PRODUCT PREVIEW */}

            <div className="relative">
              <div className="absolute -left-3 -top-6 z-20 flex items-center gap-2 rounded-full border border-[#E7E3EC] bg-white px-4 py-2 shadow-[0_8px_25px_rgba(50,40,70,0.07)]">
                <Sparkles size={13} className="text-[#5B4B8A]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#77727F]">
                  Matched for you
                </span>
              </div>

              <div className="rounded-[28px] border border-[#E4E0E8] bg-white p-3 shadow-[0_30px_80px_rgba(60,45,80,0.09)]">
                <div className="rounded-[21px] bg-[#F3F0F7] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                        Aptora search
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#393440]">
                        What are you looking for?
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                      <Search size={14} className="text-[#5B4B8A]" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-[#E5E1E9] bg-white px-4 py-4">
                    <Search size={16} className="text-[#AAA4B1]" />

                    <span className="text-xs text-[#89838F]">
                      Opportunities that match my profile
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-2 pt-5">
                  <div className="mb-3 flex items-center justify-between px-3">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                      Recommended for you
                    </span>

                    <span className="text-[9px] text-[#AAA4B1]">
                      03 matches
                    </span>
                  </div>

                  <div className="space-y-2">
                    {opportunities.map((item, index) => {
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.title}
                          className={`rounded-2xl border p-4 transition ${
                            index === 0
                              ? "border-[#D9D0E7] bg-[#F8F6FB]"
                              : "border-transparent hover:border-[#E7E3EC] hover:bg-[#FCFBFD]"
                          }`}
                        >
                          <div className="flex gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEEAF5] text-[#5B4B8A]">
                              <Icon size={17} strokeWidth={1.5} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                                    {item.category}
                                  </p>

                                  <p className="mt-1 text-[13px] font-semibold text-[#302C36]">
                                    {item.title}
                                  </p>

                                  <p className="mt-1 text-[10px] text-[#89838F]">
                                    {item.description}
                                  </p>
                                </div>

                                <span className="text-sm font-semibold text-[#5B4B8A]">
                                  {item.match}
                                </span>
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] text-[#77727F]">
                                  {item.amount}
                                </span>

                                <span className="text-[9px] font-medium text-[#5B4B8A]">
                                  Strong match
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#ECE8F0] px-5 py-4">
                  <span className="text-[9px] text-[#AAA4B1]">
                    Ranked by your eligibility
                  </span>

                  <Link
                    href="/opportunities"
                    className="text-[9px] font-semibold text-[#5B4B8A]"
                  >
                    View all →
                  </Link>
                </div>
              </div>

              <div className="absolute -bottom-7 -left-6 hidden rounded-xl border border-[#E7E3EC] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(50,40,70,0.08)] sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEEAF5]">
                    <Sparkles size={13} className="text-[#5B4B8A]" />
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.13em] text-[#AAA4B1]">
                      Match insight
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#5F5965]">
                      4 eligibility criteria matched
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-[#E7E3EC] bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-[650px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
              How it works
            </p>

            <h2 className="mt-5 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[60px]">
              Less searching.
              <br />
              More finding.
            </h2>

            <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#77727F] sm:text-[17px]">
              Aptora turns your profile into a personalised opportunity
              search, so you spend less time figuring out what you're eligible
              for.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="rounded-[26px] border border-[#E5E1E9] bg-[#FAF9FC] p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-[#AAA4B1]">
                      {step.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEAF5] text-[#5B4B8A]">
                      <Icon size={17} />
                    </div>
                  </div>

                  <h3 className="mt-9 text-[18px] font-semibold tracking-[-0.025em]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-[10px] leading-5 text-[#85808B]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT APTORA DOES
      ====================================================== */}

      <section
        id="about"
        className="scroll-mt-20 border-b border-[#E7E3EC] bg-[#FAF9FC] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
                About Aptora
              </p>

              <h2 className="mt-5 max-w-xl text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#29252F] sm:text-[58px]">
                You shouldn't
                <br />
                need to know
                <br />
                where to look.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-lg leading-8 text-[#77727F] sm:text-xl">
                Opportunities are everywhere, but finding the right ones can
                take hours. Aptora brings them together and helps you understand
                which ones actually fit your profile.
              </p>

              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {[
                  "Scholarships",
                  "Government jobs",
                  "Welfare schemes",
                  "Grants",
                  "Fellowships",
                  "Internships",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[#E5E1E9] bg-white px-4 py-4"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEEAF5] text-[#5B4B8A]">
                      <Check size={13} />
                    </div>

                    <span className="text-[10px] font-medium text-[#625C68]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ORIGINAL IDEA SECTION
      ====================================================== */}

      <section className="border-b border-[#E7E3EC] bg-white px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
                The idea
              </p>

              <h2 className="mt-5 max-w-xl text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-[#29252F] sm:text-[58px]">
                You tell us
                <br />
                about yourself.
              </h2>
            </div>

            <div>
              <p className="max-w-2xl text-lg leading-8 text-[#77727F] sm:text-xl">
                Aptora does the tedious part — checking opportunities,
                understanding their requirements and finding the ones where
                your profile actually makes sense.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Scholarships",
                  "Government jobs",
                  "Welfare schemes",
                  "Grants",
                  "Fellowships",
                  "Internships",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#E5E1E9] bg-[#FAF9FC] px-4 py-2 text-[10px] text-[#77727F]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-6 py-6 sm:px-10 lg:px-16 lg:py-8">
        <div className="mx-auto max-w-[1400px] rounded-[30px] bg-[#5B4B8A] px-7 py-14 sm:px-12 lg:px-20 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#DCD6EA]">
                Start with Aptora
              </p>

              <h2 className="mt-5 max-w-3xl text-[42px] font-semibold leading-[0.96] tracking-[-0.055em] text-white sm:text-[62px]">
                Your next opportunity
                <br />
                starts with you.
              </h2>
            </div>

            <Link
              href="/get-started"
              className="group flex h-12 w-fit shrink-0 items-center gap-3 rounded-full bg-white px-6 text-[13px] font-medium text-[#40345F] transition hover:bg-[#F0EDF5]"
            >
              Get started

              <ArrowUpRight
                size={15}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}