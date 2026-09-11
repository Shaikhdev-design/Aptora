"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171816]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#171816] lg:flex">
          <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full bg-[#718454]/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-24 h-[500px] w-[500px] rounded-full bg-[#d8c8b4]/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#171816]">
                <Sparkles size={18} />
              </div>

              <span className="text-[22px] font-semibold tracking-[-0.04em] text-white">
                aptora
              </span>
            </Link>

            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a8b99a]">
                Start your journey
              </p>

              <h1 className="mt-6 text-[52px] font-semibold leading-[1] tracking-[-0.055em] text-white xl:text-[62px]">
                Tell Aptora about you.
              </h1>

              <p className="mt-6 max-w-lg text-[16px] leading-7 text-white/50">
                Create your profile once and discover scholarships, jobs and
                government opportunities that are relevant to you.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Build one profile for multiple opportunity types",
                  "Get opportunities based on your eligibility",
                  "Keep track of applications and deadlines",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-[#a8b99a]">
                      <Check size={13} />
                    </span>

                    <span className="text-sm text-white/65">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-white/25">
              One profile. More possibilities.
            </p>
          </div>
        </section>

        {/* RIGHT REGISTER PANEL */}
        <section className="flex min-h-screen flex-col">
          {/* MOBILE HEADER */}
          <div className="flex items-center justify-between px-6 py-6 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171816] text-white">
                <Sparkles size={17} />
              </div>

              <span className="text-xl font-semibold tracking-[-0.04em]">
                aptora
              </span>
            </Link>

            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08]"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
            <div className="w-full max-w-[450px]">
              {/* HEADER */}
              <div className="mb-8">
                <Link
                  href="/"
                  className="mb-7 hidden items-center gap-2 text-xs font-medium text-[#85867f] transition hover:text-[#171816] lg:inline-flex"
                >
                  <ArrowLeft size={14} />
                  Back to Aptora
                </Link>

                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718454]">
                  Create your account
                </p>

                <h2 className="mt-3 text-[38px] font-semibold tracking-[-0.05em]">
                  Let's get started.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#777871]">
                  Create your Aptora account. You can complete your opportunity
                  profile next.
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-semibold text-[#454640]"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999a94]"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Enter your full name"
                      required
                      className="h-13 w-full rounded-2xl border border-black/[0.09] bg-white pl-11 pr-4 text-sm text-[#171816] outline-none transition placeholder:text-[#aaaBA5] focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-[#454640]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999a94]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="h-13 w-full rounded-2xl border border-black/[0.09] bg-white pl-11 pr-4 text-sm text-[#171816] outline-none transition placeholder:text-[#aaaBA5] focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-[#454640]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999a94]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      required
                      minLength={8}
                      className="h-13 w-full rounded-2xl border border-black/[0.09] bg-white pl-11 pr-12 text-sm text-[#171816] outline-none transition placeholder:text-[#aaaBA5] focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999a94] transition hover:text-[#4e5049]"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-semibold text-[#454640]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999a94]"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      required
                      minLength={8}
                      className="h-13 w-full rounded-2xl border border-black/[0.09] bg-white pl-11 pr-12 text-sm text-[#171816] outline-none transition placeholder:text-[#aaaBA5] focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999a94] transition hover:text-[#4e5049]"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <button
                  type="button"
                  onClick={() => setAgree(!agree)}
                  className="flex items-start gap-3 pt-2 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition ${
                      agree
                        ? "border-[#718454] bg-[#718454] text-white"
                        : "border-black/[0.15] bg-white"
                    }`}
                  >
                    {agree && <Check size={11} strokeWidth={3} />}
                  </span>

                  <span className="text-[11px] leading-5 text-[#777871]">
                    I agree to Aptora&apos;s{" "}
                    <span className="font-semibold text-[#5f704b]">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-[#5f704b]">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </button>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#171816] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(23,24,22,0.12)] transition hover:-translate-y-0.5 hover:bg-[#292a27]"
                >
                  Create account

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* LOGIN */}
              <div className="mt-7 text-center">
                <p className="text-sm text-[#85867f]">
                  Already have an Aptora account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#64784d] transition hover:text-[#4f613b]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* INFO */}
              <div className="mt-8 rounded-2xl border border-[#dfe5d6] bg-[#f1f4ec] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#718454]">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#4d5147]">
                      Your profile comes next
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#7d8077]">
                      After creating your account, Aptora will ask a few
                      questions to understand your education, skills,
                      preferences and eligibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE FOOTER */}
          <div className="px-6 pb-6 text-center lg:hidden">
            <p className="text-[10px] text-[#a0a19b]">
              © 2026 Aptora. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}