"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!trimmedEmail) {
      setFormError("Please enter your email address.");
      return;
    }

    if (!password) {
      setFormError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    try {
      await register({
        full_name: trimmedName,
        email: trimmedEmail,
        password,
      });

      /*
       * Registration returns a JWT and useAuth stores it automatically.
       *
       * The user is therefore already authenticated.
       *
       * New users must complete their profile before entering
       * the main Aptora dashboard.
       */
      router.push("/get-started/profile");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create your account.";

      setFormError(message);
    }
  }

  const displayError = formError || error;

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#24212A]">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        {/* FORM */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[470px]">
            <div className="mb-10">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
                  <span className="text-[15px] font-semibold">A</span>
                </div>

                <span className="text-[19px] font-semibold tracking-[-0.04em]">
                  Aptora
                </span>
              </Link>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
                Create your account
              </p>

              <h1 className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.05em] text-[#29252F]">
                Let&apos;s find your fit.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-[#89838F]">
                Create your Aptora profile once and we&apos;ll use it to
                discover opportunities that match you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* NAME */}
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-2 block text-xs font-medium text-[#4F4A55]"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
                  />

                  <input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E3DFE8] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#B4AFB9] focus:border-[#8B7BAE] focus:ring-4 focus:ring-[#5B4B8A]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-[#4F4A55]"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E3DFE8] bg-white pl-11 pr-4 text-sm outline-none placeholder:text-[#B4AFB9] focus:border-[#8B7BAE] focus:ring-4 focus:ring-[#5B4B8A]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-[#4F4A55]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E3DFE8] bg-white pl-11 pr-12 text-sm outline-none placeholder:text-[#B4AFB9] focus:border-[#8B7BAE] focus:ring-4 focus:ring-[#5B4B8A]/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#AAA4B1] hover:text-[#5B4B8A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-[#AAA4B1]">
                  Use at least 8 characters.
                </p>
              </div>

              {/* ERROR */}
              {displayError && (
                <div className="rounded-xl border border-[#E7D5D5] bg-[#FFF8F8] px-4 py-3 text-xs leading-5 text-[#9A5555]">
                  {displayError}
                </div>
              )}

              <p className="pt-1 text-[10px] leading-5 text-[#AAA4B1]">
                By continuing, you agree to Aptora&apos;s terms and
                acknowledge our privacy policy.
              </p>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B4B8A] text-sm font-medium text-white hover:bg-[#4E407A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-[#89838F]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#5B4B8A] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* RIGHT INFORMATION PANEL */}
        <section className="relative hidden overflow-hidden bg-[#F0EDF5] lg:flex">
          <div className="absolute -right-40 top-20 h-[600px] w-[600px] rounded-full border border-[#5B4B8A]/10" />

          <div className="relative flex w-full flex-col justify-center p-16">
            <div className="max-w-md">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ArrowUpRight size={19} className="text-[#5B4B8A]" />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#AAA4B1]">
                One profile
              </p>

              <h2 className="mt-5 text-[48px] font-semibold leading-[0.96] tracking-[-0.055em] text-[#29252F]">
                More relevant.
                <br />
                Less searching.
              </h2>

              <p className="mt-7 text-sm leading-7 text-[#77727F]">
                Your profile becomes the foundation for discovering
                scholarships, jobs, schemes, grants and more.
              </p>

              <div className="mt-10 space-y-3">
                {[
                  "Tell Aptora about yourself",
                  "Set your goals and preferences",
                  "Discover matched opportunities",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl border border-white/80 bg-white/60 px-4 py-4"
                  >
                    <span className="text-[10px] font-semibold text-[#5B4B8A]">
                      0{index + 1}
                    </span>

                    <span className="text-xs font-medium text-[#5F5965]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}