"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);

    if (!email.trim() || !password) {
      setFormError("Please enter your email and password.");
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    }
  }

  const displayError = formError || error;

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#24212A]">
      <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT BRAND PANEL */}
        <section className="relative hidden overflow-hidden bg-[#5B4B8A] lg:flex">
          <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/[0.04]" />

          <div className="relative flex w-full flex-col justify-between p-14">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white text-[#5B4B8A]">
                <span className="text-[15px] font-semibold">A</span>
              </div>

              <span className="text-[19px] font-semibold tracking-[-0.04em]">
                Aptora
              </span>
            </Link>

            <div className="max-w-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#DCD6EA]">
                Welcome back
              </p>

              <h1 className="mt-6 text-[54px] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
                Opportunities
                <br />
                are waiting.
              </h1>

              <p className="mt-7 max-w-sm text-sm leading-6 text-[#DCD6EA]">
                Sign in to see opportunities matched to your profile,
                eligibility and goals.
              </p>
            </div>

            <p className="text-[10px] text-[#C8C0DA]">
              © {new Date().getFullYear()} Aptora
            </p>
          </div>
        </section>

        {/* LOGIN */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-[430px]">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
                  <span className="text-[15px] font-semibold">A</span>
                </div>

                <span className="text-[19px] font-semibold">
                  Aptora
                </span>
              </Link>
            </div>

            <Link
              href="/"
              className="mb-10 flex w-fit items-center gap-2 text-xs text-[#89838F] transition hover:text-[#5B4B8A]"
            >
              <ArrowLeft size={14} />
              Back to Aptora
            </Link>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
                Sign in
              </p>

              <h2 className="mt-3 text-[38px] font-semibold tracking-[-0.05em] text-[#29252F]">
                Welcome back.
              </h2>

              <p className="mt-3 text-sm text-[#89838F]">
                Sign in to continue to your Aptora account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-xs font-medium text-[#4F4A55]">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E3DFE8] bg-white pl-11 pr-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#B4AFB9] focus:border-[#8B7BAE] focus:ring-4 focus:ring-[#5B4B8A]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-[#4F4A55]">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-medium text-[#5B4B8A] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E3DFE8] bg-white pl-11 pr-12 text-sm text-[#29252F] outline-none transition placeholder:text-[#B4AFB9] focus:border-[#8B7BAE] focus:ring-4 focus:ring-[#5B4B8A]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAA4B1] hover:text-[#5B4B8A] disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {displayError && (
                <div className="rounded-xl border border-[#E8D8D8] bg-[#FCF7F7] px-4 py-3 text-xs leading-5 text-[#8A5252]">
                  {displayError}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B4B8A] text-sm font-medium text-white transition hover:bg-[#4E407A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E7E3EC]" />

              <span className="text-[10px] uppercase tracking-[0.15em] text-[#AAA4B1]">
                New here?
              </span>

              <div className="h-px flex-1 bg-[#E7E3EC]" />
            </div>

            <Link
              href="/signup"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-[#DDD8E3] bg-white text-sm font-medium text-[#4F4A55] transition hover:border-[#CFC6DB] hover:bg-[#FDFCFF]"
            >
              Create an Aptora account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}