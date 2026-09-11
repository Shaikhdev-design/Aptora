"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function SettingsPage() {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);
  const [newMatches, setNewMatches] = useState(true);
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      {/* CONTENT */}

      <div className="mx-auto max-w-[1050px] px-6 py-12 sm:px-8 lg:py-16">
        {/* BACK */}

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8A8490] transition hover:text-[#5B4B8A]"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        {/* TITLE */}

        <section className="mt-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
            Account
          </p>

          <h1 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[54px]">
            Settings
          </h1>

          <p className="mt-5 max-w-[600px] text-[15px] leading-7 text-[#817B87]">
            Manage your account, notifications and Aptora preferences.
          </p>
        </section>

        {/* SAVED */}

        {saved && (
          <div className="mt-7 flex items-center gap-2 rounded-[18px] border border-[#DDD6E5] bg-[#F1EDF7] px-5 py-4 text-[13px] font-medium text-[#66577F]">
            <Check size={16} />
            Your settings have been saved.
          </div>
        )}

        <section className="mt-9 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* NOTIFICATIONS */}

          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <Bell size={18} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Stay informed
                </p>

                <h2 className="mt-1 text-[21px] font-semibold">
                  Notifications
                </h2>
              </div>
            </div>

            <div className="mt-8 divide-y divide-[#EEEAEF]">
              <ToggleRow
                icon={<Mail size={16} />}
                title="Email updates"
                description="Receive important account and opportunity updates."
                enabled={emailUpdates}
                onChange={() => setEmailUpdates(!emailUpdates)}
              />

              <ToggleRow
                icon={<Bell size={16} />}
                title="Deadline reminders"
                description="Get reminded when a saved opportunity is closing soon."
                enabled={deadlineAlerts}
                onChange={() => setDeadlineAlerts(!deadlineAlerts)}
              />

              <ToggleRow
                icon={<Sparkles size={16} />}
                title="New opportunity matches"
                description="Know when Aptora finds something relevant to your profile."
                enabled={newMatches}
                onChange={() => setNewMatches(!newMatches)}
              />
            </div>
          </div>

          {/* PRIVACY */}

          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-7 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EDF7]">
              <ShieldCheck size={18} className="text-[#5B4B8A]" />
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
              Your information
            </p>

            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">
              Privacy & security
            </h2>

            <p className="mt-4 text-[14px] leading-6 text-[#89838F]">
              Your profile information helps Aptora personalise the
              opportunities you see.
            </p>

            <div className="mt-7 space-y-2">
              <Link
                href="/privacy"
                className="flex items-center justify-between rounded-xl bg-[#FAF9FC] px-4 py-4 transition hover:bg-[#F4F0F7]"
              >
                <span className="text-[13px] font-medium text-[#686171]">
                  Privacy policy
                </span>

                <ChevronRight
                  size={15}
                  className="text-[#AAA4B1]"
                />
              </Link>

              <Link
                href="/terms"
                className="flex items-center justify-between rounded-xl bg-[#FAF9FC] px-4 py-4 transition hover:bg-[#F4F0F7]"
              >
                <span className="text-[13px] font-medium text-[#686171]">
                  Terms of service
                </span>

                <ChevronRight
                  size={15}
                  className="text-[#AAA4B1]"
                />
              </Link>
            </div>
          </div>

          {/* ACCOUNT */}

          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <UserRound size={18} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Account
                </p>

                <h2 className="mt-1 text-[21px] font-semibold">
                  Account settings
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <Link
                href="/profile"
                className="flex items-center justify-between rounded-xl border border-[#E8E3EB] px-4 py-4 transition hover:border-[#CEC4D7] hover:bg-[#FAF9FC]"
              >
                <div className="flex items-center gap-3">
                  <UserRound
                    size={16}
                    className="text-[#928A98]"
                  />

                  <div>
                    <p className="text-[13px] font-medium">
                      Edit profile
                    </p>

                    <p className="mt-1 text-[11px] text-[#AAA4B1]">
                      Update your personal information
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={15}
                  className="text-[#AAA4B1]"
                />
              </Link>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-[#E8E3EB] px-4 py-4 text-left transition hover:border-[#CEC4D7] hover:bg-[#FAF9FC]"
              >
                <div className="flex items-center gap-3">
                  <LockKeyhole
                    size={16}
                    className="text-[#928A98]"
                  />

                  <div>
                    <p className="text-[13px] font-medium">
                      Password & security
                    </p>

                    <p className="mt-1 text-[11px] text-[#AAA4B1]">
                      Manage your sign-in security
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={15}
                  className="text-[#AAA4B1]"
                />
              </button>
            </div>
          </div>

          {/* APTORA PREFERENCES */}

          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-7 sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1EDF7]">
              <Sparkles size={18} className="text-[#5B4B8A]" />
            </div>

            <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
              Personalisation
            </p>

            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">
              Your preferences
            </h2>

            <p className="mt-4 text-[14px] leading-6 text-[#89838F]">
              Aptora uses your profile and interests to make your
              opportunity feed more useful.
            </p>

            <Link
              href="/profile"
              className="mt-7 flex h-11 w-fit items-center gap-2 rounded-full bg-[#5B4B8A] px-6 text-[12px] font-medium text-white transition hover:bg-[#4E407A]"
            >
              Manage preferences
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* SAVE */}

        <div className="mt-7 flex justify-end">
          <button
            onClick={saveSettings}
            className="flex h-12 items-center gap-2 rounded-full bg-[#5B4B8A] px-7 text-[13px] font-medium text-white transition hover:bg-[#4E407A]"
          >
            <Check size={15} />
            Save settings
          </button>
        </div>

        {/* DANGER */}

        <section className="mt-12 rounded-[27px] border border-[#E5E0E5] bg-white p-7 sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
            Account actions
          </p>

          <h2 className="mt-2 text-[20px] font-semibold">
            Manage your Aptora account
          </h2>

          <p className="mt-3 max-w-[600px] text-[13px] leading-6 text-[#96909A]">
            If you no longer want to use Aptora, you can sign out of
            your account or contact us about account deletion.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-[#DDD8E3] px-6 py-3 text-[12px] font-medium text-[#77717F] transition hover:border-[#C9C0D2] hover:text-[#5B4B8A]"
            >
              Sign out
            </button>

            <button
              type="button"
              className="rounded-full border border-[#E4DADA] px-6 py-3 text-[12px] font-medium text-[#876D6D] transition hover:bg-[#F8F2F2]"
            >
              Request account deletion
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* TOGGLE ROW */

function ToggleRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9FC] text-[#8D8594]">
          {icon}
        </div>

        <div>
          <p className="text-[14px] font-medium text-[#4E4854]">
            {title}
          </p>

          <p className="mt-1.5 max-w-[460px] text-[12px] leading-5 text-[#A09AA5]">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative h-7 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#5B4B8A]" : "bg-[#D8D3DC]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-5" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}