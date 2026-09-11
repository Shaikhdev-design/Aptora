"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/hooks/useAuth";
import {
  getApplications,
  getMatchingOpportunities,
  getSavedOpportunities,
  type ApplicationRecord,
  type BackendOpportunity,
  type SavedOpportunity,
} from "@/services/opportunityService";

interface UserResponse {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }

  return "Good night";
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Open";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Open";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatType(type: string): string {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isClosingSoon(deadline: string | null): boolean {
  if (!deadline) return false;

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const difference =
    date.getTime() - now.getTime();

  return (
    difference >= 0 &&
    difference <= 7 * 24 * 60 * 60 * 1000
  );
}

export default function DashboardPage() {
  const [greeting, setGreeting] =
    useState(getGreeting());

  const [userName, setUserName] =
    useState("there");

  const [matches, setMatches] = useState<
    BackendOpportunity[]
  >([]);

  const [saved, setSaved] = useState<
    SavedOpportunity[]
  >([]);

  const [applications, setApplications] =
    useState<ApplicationRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [user, savedResponse, applicationResponse] =
          await Promise.all([
            apiRequest<UserResponse>("/users/me", {
              method: "GET",
              token,
            }),
            getSavedOpportunities(),
            getApplications(),
          ]);

        setUserName(
          user.full_name?.trim() || "there",
        );

        setSaved(savedResponse.items);
        setApplications(applicationResponse.items);

        try {
          const matchingResponse =
            await getMatchingOpportunities(20);

          setMatches(matchingResponse.items);
        } catch {
          /*
           * If personalised matching is unavailable,
           * do not break the dashboard. The saved and
           * application sections still work from the
           * database.
           */
          setMatches([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    const interval = window.setInterval(() => {
      setGreeting(getGreeting());
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const closingSoon = useMemo(
    () =>
      saved.filter((item) =>
        isClosingSoon(item.deadline),
      ).length,
    [saved],
  );

  const bestMatch = useMemo(() => {
    return [...matches].sort(
      (a, b) =>
        (b.matching_score ?? 0) -
        (a.matching_score ?? 0),
    )[0];
  }, [matches]);

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1380px] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
              Your Aptora
            </p>

            <h1 className="mt-3 text-[39px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[52px]">
              {greeting},
              <br />
              {userName}.
            </h1>

            <p className="mt-4 max-w-[560px] text-[12px] leading-6 text-[#817B87]">
              Your opportunity space, powered by real
              opportunities and your Aptora account.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="flex h-11 w-fit items-center gap-2 rounded-full bg-[#DCD2F2] px-5 text-[10px] font-semibold text-[#51427D]"
          >
            Explore opportunities
            <ArrowRight size={12} />
          </Link>
        </section>

        {error && (
          <div className="mt-7 rounded-2xl border border-[#E6D7DE] bg-[#FFF8FA] px-5 py-4 text-[11px] text-[#8B5E6A]">
            {error}
          </div>
        )}

        <section className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Sparkles size={16} />}
            value={
              loading ? "—" : String(matches.length)
            }
            label="Matches"
          />

          <StatCard
            icon={<Bookmark size={16} />}
            value={
              loading ? "—" : String(saved.length)
            }
            label="Saved"
          />

          <StatCard
            icon={<TrendingUp size={16} />}
            value={
              loading
                ? "—"
                : String(applications.length)
            }
            label="Applications"
          />

          <StatCard
            icon={<CheckCircle2 size={16} />}
            value={
              loading
                ? "—"
                : String(closingSoon)
            }
            label="Closing soon"
          />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.55fr_0.9fr]">
          <div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                  Aptora opportunities
                </p>

                <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.035em]">
                  Recommended for you
                </h2>
              </div>

              <Link
                href="/opportunities"
                className="flex items-center gap-1.5 text-[9px] font-medium text-[#716A79]"
              >
                View all
                <ArrowRight size={11} />
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 rounded-[25px] border border-[#E5E0E9] bg-white px-6 py-16 text-center">
                <p className="text-[11px] text-[#96909A]">
                  Loading your opportunities...
                </p>
              </div>
            ) : matches.length === 0 ? (
              <div className="mt-6 rounded-[25px] border border-dashed border-[#DCD6E1] bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                  <Search
                    size={19}
                    className="text-[#5B4B8A]"
                  />
                </div>

                <h3 className="mt-5 text-[15px] font-semibold">
                  Complete your profile for matches
                </h3>

                <p className="mx-auto mt-2 max-w-[390px] text-[10px] leading-5 text-[#8A8490]">
                  Aptora can still show you the full
                  opportunity catalogue, but personalised
                  matching needs your profile information.
                </p>

                <Link
                  href="/profile"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#DCD2F2] px-5 py-2.5 text-[9px] font-semibold text-[#51427D]"
                >
                  Complete profile
                  <ArrowRight size={11} />
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {matches
                  .slice(0, 5)
                  .map((opportunity) => (
                    <OpportunityPreview
                      key={opportunity.id}
                      opportunity={opportunity}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[25px] bg-[#F1EDF7] p-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8B8295]">
                Your collection
              </p>

              <h3 className="mt-2 text-[17px] font-semibold text-[#40384A]">
                Saved opportunities
              </h3>

              {saved.length === 0 ? (
                <p className="mt-3 text-[10px] leading-5 text-[#817788]">
                  Nothing saved yet. Save an opportunity
                  and it will appear here.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {saved.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/opportunities/${item.opportunity_id}`}
                      className="block rounded-2xl bg-white p-4"
                    >
                      <p className="text-[10px] font-semibold leading-4">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[9px] text-[#8A8490]">
                        {item.provider_name}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/saved"
                className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#5B4B8A]"
              >
                View saved
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="rounded-[25px] border border-[#E5E0E9] bg-white p-6">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                Applications
              </p>

              <h3 className="mt-2 text-[17px] font-semibold">
                Your application tracker
              </h3>

              {applications.length === 0 ? (
                <p className="mt-3 text-[10px] leading-5 text-[#817788]">
                  You haven't created any application
                  records yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {applications
                    .slice(0, 3)
                    .map((application) => (
                      <div
                        key={application.id}
                        className="rounded-2xl bg-[#FAF9FC] p-4"
                      >
                        <p className="text-[10px] font-semibold">
                          {application.title}
                        </p>

                        <p className="mt-1 text-[9px] text-[#8A8490]">
                          {application.status}
                        </p>
                      </div>
                    ))}
                </div>
              )}

              <Link
                href="/applications"
                className="mt-5 inline-flex items-center gap-2 text-[9px] font-semibold text-[#5B4B8A]"
              >
                View applications
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </section>

        {bestMatch && (
          <section className="mt-8 rounded-[27px] bg-[#5B4B8A] p-7 text-white">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55">
              Best current match
            </p>

            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[22px] font-semibold">
                  {bestMatch.title}
                </h2>

                <p className="mt-1 text-[10px] text-white/65">
                  {bestMatch.provider_name}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-white/15 px-4 py-2 text-[10px] font-semibold">
                  {Math.round(
                    bestMatch.matching_score ?? 0,
                  )}
                  % match
                </span>

                <Link
                  href={`/opportunities/${bestMatch.id}`}
                  className="flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[9px] font-semibold text-[#40345F]"
                >
                  View
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[23px] border border-[#E5E0E9] bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7] text-[#5B4B8A]">
        {icon}
      </div>

      <p className="mt-5 text-[26px] font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#AAA4B1]">
        {label}
      </p>
    </div>
  );
}

function OpportunityPreview({
  opportunity,
}: {
  opportunity: BackendOpportunity;
}) {
  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="block rounded-[23px] border border-[#E5E0E9] bg-white p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EDF7]">
          {opportunity.opportunity_type ===
          "SCHOLARSHIP" ? (
            <GraduationCap
              size={17}
              className="text-[#5B4B8A]"
            />
          ) : opportunity.opportunity_type ===
            "GOVERNMENT_SCHEME" ? (
            <Landmark
              size={17}
              className="text-[#5B4B8A]"
            />
          ) : (
            <BriefcaseBusiness
              size={17}
              className="text-[#5B4B8A]"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#9A939F]">
              {formatType(
                opportunity.opportunity_type,
              )}
            </span>

            {typeof opportunity.matching_score ===
              "number" && (
              <span className="rounded-full bg-[#F1EDF7] px-2.5 py-1 text-[7px] font-semibold text-[#6D5D89]">
                {Math.round(
                  opportunity.matching_score,
                )}
                % match
              </span>
            )}
          </div>

          <h3 className="mt-2 text-[13px] font-semibold leading-5">
            {opportunity.title}
          </h3>

          <p className="mt-1 text-[9px] text-[#89838F]">
            {opportunity.provider_name}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[8px] text-[#89838F]">
            <span>
              {opportunity.location ||
                opportunity.state ||
                "India"}
            </span>

            <span>
              Deadline:{" "}
              {formatDeadline(opportunity.deadline)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}