"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  Loader2,
} from "lucide-react";

import {
  BackendOpportunity,
  getMatchingOpportunities,
  getSavedOpportunities,
  removeSavedOpportunity,
  saveOpportunity,
} from "@/services/opportunityService";

interface JobOpportunity {
  id: number;
  title: string;
  organisation: string;
  type: "JOB" | "INTERNSHIP";
  location: string;
  state: string | null;
  deadline: string | null;
  description: string;
  match: number;
  eligible: boolean | null;
  eligibilityStatus: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN";
  applicationUrl: string | null;
  officialSourceUrl: string | null;
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Open";

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatOpportunityType(type: string): "JOB" | "INTERNSHIP" {
  return type.toUpperCase().includes("INTERN")
    ? "INTERNSHIP"
    : "JOB";
}

function mapOpportunity(
  opportunity: BackendOpportunity,
): JobOpportunity {
  return {
    id: opportunity.id,
    title: opportunity.title,
    organisation: opportunity.provider_name,
    type: formatOpportunityType(opportunity.opportunity_type),
    location:
      opportunity.location ||
      opportunity.state ||
      "India",
    state: opportunity.state,
    deadline: opportunity.deadline,
    description:
      opportunity.description ||
      "View this opportunity for complete details, eligibility and application information.",
    match: Math.round(opportunity.matching_score ?? 0),
    eligible: opportunity.eligible ?? null,
    eligibilityStatus:
      opportunity.eligibility_status ?? "UNKNOWN",
    applicationUrl: opportunity.application_url,
    officialSourceUrl: opportunity.official_source_url,
  };
}

function getEligibilityLabel(
  status: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN",
): string {
  if (status === "ELIGIBLE") return "Eligible";
  if (status === "NOT_ELIGIBLE") return "Not eligible";
  return "Check eligibility";
}

function getEligibilityClass(
  status: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN",
): string {
  if (status === "ELIGIBLE") {
    return "bg-[#EEF7F1] text-[#467356]";
  }

  if (status === "NOT_ELIGIBLE") {
    return "bg-[#F5F1F5] text-[#8A687E]";
  }

  return "bg-[#F5F2F8] text-[#6D6180]";
}

export default function JobsPage() {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>(
    [],
  );

  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<
    "ALL" | "JOB" | "INTERNSHIP"
  >("ALL");

  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        /*
         * Use the personalised matching endpoint first.
         * It returns real opportunities from the database together
         * with eligibility and matching information.
         */
        const response = await getMatchingOpportunities(2000);

        const jobs = response.items
          .filter((item) => {
            const type = item.opportunity_type
              .toUpperCase()
              .trim();

            return (
              type === "JOB" ||
              type === "INTERNSHIP" ||
              type.includes("JOB") ||
              type.includes("INTERN")
            );
          })
          .map(mapOpportunity);

        setOpportunities(jobs);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load jobs and internships.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadSaved() {
      try {
        setSavedLoading(true);

        const response = await getSavedOpportunities();

        setSavedIds(
          response.items.map(
            (item) => item.opportunity_id,
          ),
        );
      } catch {
        /*
         * Saved state is supplementary.
         * The jobs page should still work if saved data
         * cannot be loaded.
         */
      } finally {
        setSavedLoading(false);
      }
    }

    loadSaved();
  }, []);

  const filteredOpportunities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return opportunities.filter((opportunity) => {
      const matchesType =
        activeType === "ALL" ||
        opportunity.type === activeType;

      const matchesSearch =
        !query ||
        opportunity.title
          .toLowerCase()
          .includes(query) ||
        opportunity.organisation
          .toLowerCase()
          .includes(query) ||
        opportunity.location
          .toLowerCase()
          .includes(query) ||
        opportunity.description
          .toLowerCase()
          .includes(query);

      return matchesType && matchesSearch;
    });
  }, [opportunities, activeType, search]);

  const jobCount = opportunities.filter(
    (item) => item.type === "JOB",
  ).length;

  const internshipCount = opportunities.filter(
    (item) => item.type === "INTERNSHIP",
  ).length;

  async function toggleSave(opportunityId: number) {
    const alreadySaved = savedIds.includes(opportunityId);

    try {
      setSavingId(opportunityId);
      setError(null);

      if (alreadySaved) {
        await removeSavedOpportunity(opportunityId);

        setSavedIds((current) =>
          current.filter((id) => id !== opportunityId),
        );
      } else {
        await saveOpportunity(opportunityId);

        setSavedIds((current) => [
          ...current,
          opportunityId,
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update saved opportunity.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1250px] px-6 py-10 sm:px-8 lg:py-14">

        {/* HEADER */}
        <section className="mb-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                <BriefcaseBusiness
                  size={22}
                  className="text-[#5B4B8A]"
                />
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
                Career opportunities
              </p>

              <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.04em] sm:text-[42px]">
                Jobs & internships
              </h1>

              <p className="mt-3 max-w-[650px] text-[14px] leading-6 text-[#817B87]">
                Discover real jobs and internships collected from
                official opportunity sources and ranked around your
                profile.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="flex h-11 w-fit items-center gap-2 rounded-full border border-[#DDD7E2] bg-white px-5 text-[12px] font-semibold text-[#5B4B8A] transition hover:border-[#C9C0D3]"
            >
              Explore all opportunities
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="mb-8 rounded-[25px] border border-[#E4DFE8] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-[520px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search jobs, internships or organisations..."
                className="h-12 w-full rounded-2xl border border-[#E4DFE8] bg-[#FAF9FC] pl-11 pr-4 text-[13px] outline-none transition placeholder:text-[#AAA4B1] focus:border-[#BEB3CE]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={activeType === "ALL"}
                onClick={() => setActiveType("ALL")}
              >
                All
                <span className="ml-1 text-[#AAA4B1]">
                  {opportunities.length}
                </span>
              </FilterButton>

              <FilterButton
                active={activeType === "JOB"}
                onClick={() => setActiveType("JOB")}
              >
                Jobs
                <span className="ml-1 text-[#AAA4B1]">
                  {jobCount}
                </span>
              </FilterButton>

              <FilterButton
                active={activeType === "INTERNSHIP"}
                onClick={() =>
                  setActiveType("INTERNSHIP")
                }
              >
                Internships
                <span className="ml-1 text-[#AAA4B1]">
                  {internshipCount}
                </span>
              </FilterButton>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-[#E4DFE8] bg-white px-5 py-4 text-[13px] text-[#817B87]">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-[13px] text-[#817B87]">
              <Loader2
                size={17}
                className="animate-spin text-[#5B4B8A]"
              />
              Loading real jobs and internships...
            </div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          /* EMPTY */
          <div className="rounded-[28px] border border-[#E4DFE8] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDF7]">
              <BriefcaseBusiness
                size={23}
                className="text-[#5B4B8A]"
              />
            </div>

            <h2 className="mt-5 text-[20px] font-semibold">
              No opportunities found
            </h2>

            <p className="mx-auto mt-2 max-w-[480px] text-[13px] leading-6 text-[#817B87]">
              Try another search or switch between jobs and
              internships.
            </p>
          </div>
        ) : (
          /* RESULTS */
          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
                  Live results
                </p>

                <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.025em]">
                  {filteredOpportunities.length}{" "}
                  {filteredOpportunities.length === 1
                    ? "opportunity"
                    : "opportunities"}
                </h2>
              </div>

              {!savedLoading && (
                <div className="hidden text-[11px] text-[#AAA4B1] sm:block">
                  {savedIds.length} saved
                </div>
              )}
            </div>

            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => {
                const isSaved = savedIds.includes(
                  opportunity.id,
                );

                const isSaving =
                  savingId === opportunity.id;

                return (
                  <article
                    key={opportunity.id}
                    className="rounded-[26px] border border-[#E4DFE8] bg-white p-5 transition hover:border-[#CEC3D9] hover:shadow-[0_15px_40px_rgba(50,40,70,0.05)] sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      {/* MAIN CONTENT */}
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                          {opportunity.type ===
                          "INTERNSHIP" ? (
                            <Building2
                              size={19}
                              className="text-[#5B4B8A]"
                            />
                          ) : (
                            <BriefcaseBusiness
                              size={19}
                              className="text-[#5B4B8A]"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#F1EDF7] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#5B4B8A]">
                              {opportunity.type}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-[9px] font-semibold ${getEligibilityClass(
                                opportunity.eligibilityStatus,
                              )}`}
                            >
                              {getEligibilityLabel(
                                opportunity.eligibilityStatus,
                              )}
                            </span>
                          </div>

                          <Link
                            href={`/opportunities/${opportunity.id}`}
                            className="block text-[18px] font-semibold tracking-[-0.02em] transition hover:text-[#5B4B8A] sm:text-[20px]"
                          >
                            {opportunity.title}
                          </Link>

                          <p className="mt-1 flex items-center gap-2 text-[12px] text-[#817B87]">
                            <Building2 size={13} />
                            {opportunity.organisation}
                          </p>

                          <p className="mt-3 line-clamp-2 max-w-[800px] text-[12px] leading-5 text-[#89838F]">
                            {opportunity.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-[#817B87]">
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} />
                              {opportunity.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={13} />
                              {formatDeadline(
                                opportunity.deadline,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="flex shrink-0 flex-row items-center gap-3 lg:flex-col lg:items-end">

                        <div className="rounded-2xl bg-[#FAF9FC] px-4 py-3 text-center">
                          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#AAA4B1]">
                            Match
                          </p>

                          <p className="mt-1 text-[22px] font-semibold text-[#5B4B8A]">
                            {opportunity.match}%
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            toggleSave(opportunity.id)
                          }
                          disabled={isSaving}
                          aria-label={
                            isSaved
                              ? "Remove from saved"
                              : "Save opportunity"
                          }
                          className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
                            isSaved
                              ? "border-[#D5CCE0] bg-[#F1EDF7] text-[#5B4B8A]"
                              : "border-[#E4DFE8] bg-white text-[#817B87] hover:border-[#CEC3D9] hover:text-[#5B4B8A]"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {isSaving ? (
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                          ) : isSaved ? (
                            <BookmarkCheck size={16} />
                          ) : (
                            <Bookmark size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-[#F0EDF2] pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-2">
                        {opportunity.state && (
                          <span className="rounded-full border border-[#E7E2EA] px-3 py-1 text-[9px] text-[#817B87]">
                            {opportunity.state}
                          </span>
                        )}

                        <span className="rounded-full border border-[#E7E2EA] px-3 py-1 text-[9px] text-[#817B87]">
                          Real source
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {opportunity.officialSourceUrl && (
                          <a
                            href={
                              opportunity.officialSourceUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-10 items-center gap-2 rounded-full border border-[#E4DFE8] px-4 text-[10px] font-semibold text-[#817B87] transition hover:border-[#CEC3D9] hover:text-[#5B4B8A]"
                          >
                            Official source
                            <ExternalLink size={12} />
                          </a>
                        )}

                        <Link
                          href={`/opportunities/${opportunity.id}`}
                          className="flex h-10 items-center gap-2 rounded-full bg-[#5B4B8A] px-5 text-[10px] font-semibold !text-white transition hover:bg-[#4E407A]"
                        >
                          View opportunity
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-full px-4 text-[11px] font-semibold transition ${
        active
          ? "bg-[#5B4B8A] text-white"
          : "border border-[#E4DFE8] bg-white text-[#817B87] hover:border-[#CEC3D9] hover:text-[#5B4B8A]"
      }`}
    >
      {children}
    </button>
  );
}