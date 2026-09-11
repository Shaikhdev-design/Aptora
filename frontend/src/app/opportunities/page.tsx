"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GraduationCap,
  Landmark,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  BackendOpportunity,
  getOpportunityFeed,
  getSavedOpportunityIds,
  removeSavedOpportunity,
  saveOpportunity,
  normalizeOpportunityResponse,
} from "@/services/opportunityService";

type DisplayOpportunity = {
  id: number;
  title: string;
  organisation: string;
  type: string;
  category: string;
  location: string;
  deadline: string;
  description: string;
  match: number;
  tags: string[];
  eligible: boolean | null;
  eligibilityStatus: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN";
};

const categories = [
  "All",
  "Jobs",
  "Internships",
  "Scholarships",
  "Schemes",
  "Fellowships",
  "Training",
  "Programs",
  "Competitions",
];

function getCategory(opportunityType: string): string {
  const type = opportunityType.toLowerCase().trim();

  if (type.includes("job")) return "Jobs";
  if (type.includes("intern")) return "Internships";
  if (type.includes("scholar")) return "Scholarships";
  if (type.includes("scheme")) return "Schemes";
  if (type.includes("fellow")) return "Fellowships";
  if (type.includes("train")) return "Training";
  if (type.includes("program")) return "Programs";
  if (type.includes("competition")) return "Competitions";

  return "Programs";
}

function formatType(opportunityType: string): string {
  return opportunityType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function mapOpportunity(
  opportunity: BackendOpportunity,
): DisplayOpportunity {
  const type = formatType(opportunity.opportunity_type);

  const location =
    opportunity.location ||
    opportunity.state ||
    "India";

  const tags = [
    type,
    opportunity.state || null,
  ].filter(Boolean) as string[];

  return {
    id: opportunity.id,
    title: opportunity.title || "Untitled opportunity",
    organisation:
      opportunity.provider_name || "Unknown provider",
    type,
    category: getCategory(opportunity.opportunity_type),
    location,
    deadline: formatDeadline(opportunity.deadline),
    description:
      opportunity.description ||
      "View this opportunity to see eligibility, application details and official information.",
    match: Math.round(opportunity.matching_score ?? 0),
    tags,
    eligible: opportunity.eligible ?? null,
    eligibilityStatus:
      opportunity.eligibility_status ?? "UNKNOWN",
  };
}

export default function OpportunitiesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [sort, setSort] = useState("Best match");

  const [opportunities, setOpportunities] = useState<
    DisplayOpportunity[]
  >([]);

  const [saved, setSaved] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPageData() {
      setLoading(true);
      setError(null);

      try {
        /*
         * IMPORTANT:
         * getOpportunityFeed() first tries personalized matching.
         * If matching is unavailable, it automatically falls back
         * to the real public opportunities endpoint.
         */
        const opportunityPromise = getOpportunityFeed(2000);

        /*
         * Saved opportunities are independent of the catalogue.
         * If this request fails, the opportunities page should still
         * load normally.
         */
        const savedPromise = getSavedOpportunityIds();

        const [opportunityResult, savedResult] =
          await Promise.allSettled([
            opportunityPromise,
            savedPromise,
          ]);

        if (cancelled) return;

        if (opportunityResult.status === "rejected") {
          throw opportunityResult.reason;
        }

        const normalized =
          normalizeOpportunityResponse(
            opportunityResult.value,
          );

        setOpportunities(
          normalized.items.map(mapOpportunity),
        );

        if (savedResult.status === "fulfilled") {
          setSaved(
            Array.from(savedResult.value),
          );
        } else {
          /*
           * Saved state failing must never make the
           * opportunity catalogue disappear.
           */
          setSaved([]);
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load opportunities.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = opportunities.filter((item) => {
      const matchesCategory =
        category === "All" ||
        item.category === category;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.organisation
          .toLowerCase()
          .includes(query) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(query),
        );

      const matchesLocation =
        location === "All locations" ||
        item.location
          .toLowerCase()
          .includes(location.toLowerCase());

      return (
        matchesCategory &&
        matchesSearch &&
        matchesLocation
      );
    });

    if (sort === "Highest match") {
      result = [...result].sort(
        (a, b) => b.match - a.match,
      );
    }

    if (sort === "Deadline soon") {
      result = [...result].sort((a, b) => {
        const first = new Date(
          a.deadline,
        ).getTime();

        const second = new Date(
          b.deadline,
        ).getTime();

        if (Number.isNaN(first)) return 1;
        if (Number.isNaN(second)) return -1;

        return first - second;
      });
    }

    if (sort === "Best match") {
      result = [...result].sort(
        (a, b) => b.match - a.match,
      );
    }

    return result;
  }, [
    opportunities,
    category,
    search,
    location,
    sort,
  ]);

  async function toggleSaved(id: number) {
    if (savingId === id) return;

    const isSaved = saved.includes(id);

    setSavingId(id);
    setError(null);

    try {
      if (isSaved) {
        await removeSavedOpportunity(id);

        setSaved((current) =>
          current.filter((item) => item !== id),
        );
      } else {
        await saveOpportunity(id);

        setSaved((current) =>
          current.includes(id)
            ? current
            : [...current, id],
        );
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

  const jobCount = opportunities.filter(
    (item) =>
      item.category === "Jobs" ||
      item.category === "Internships",
  ).length;

  const scholarshipCount = opportunities.filter(
    (item) => item.category === "Scholarships",
  ).length;

  const schemeCount = opportunities.filter(
    (item) => item.category === "Schemes",
  ).length;

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1250px] px-6 py-10 sm:px-8 lg:py-14">
        {/* TITLE */}
        <section>
          <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
            Explore
          </p>

          <h1 className="mt-3 text-[39px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px]">
            Opportunities for you
          </h1>

          <p className="mt-4 max-w-[590px] text-[11px] leading-6 text-[#817B87]">
            Discover real jobs, scholarships,
            schemes, internships and more matched
            around your profile.
          </p>
        </section>

        {/* SEARCH */}
        <section className="mt-8 rounded-[26px] border border-[#E4DFE8] bg-white p-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search opportunities, skills or organisations..."
                className="h-12 w-full rounded-[17px] bg-[#FAF9FC] pl-11 pr-4 text-[10px] text-[#403B46] outline-none placeholder:text-[#AAA4B1] focus:ring-2 focus:ring-[#5B4B8A]/10"
              />
            </div>

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className={`flex h-12 items-center justify-center gap-2 rounded-[17px] border px-5 text-[10px] font-medium transition ${
                showFilters
                  ? "border-[#CFC4D9] bg-[#F1EDF7] text-[#5B4B8A]"
                  : "border-[#E3DEE7] bg-white text-[#716A79]"
              }`}
            >
              <SlidersHorizontal size={13} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid gap-3 border-t border-[#EEEAEF] pt-3 sm:grid-cols-2">
              <FilterSelect
                label="Location"
                value={location}
                onChange={setLocation}
                options={[
                  "All locations",
                  "Mumbai",
                  "Remote",
                  "India",
                  "Maharashtra",
                  "Bengaluru",
                  "Delhi",
                  "Karnataka",
                ]}
              />

              <FilterSelect
                label="Sort by"
                value={sort}
                onChange={setSort}
                options={[
                  "Best match",
                  "Highest match",
                  "Deadline soon",
                ]}
              />
            </div>
          )}
        </section>

        {/* CATEGORY TABS */}
        <section className="mt-7 flex flex-wrap items-center gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2.5 text-[9px] font-medium transition ${
                category === item
                  ? "bg-[#5B4B8A] text-white"
                  : "border border-[#DDD8E3] bg-white text-[#77717F] hover:border-[#C9C0D2] hover:text-[#5B4B8A]"
              }`}
            >
              {item}
            </button>
          ))}

          <span className="ml-1 text-[9px] text-[#AAA4B1]">
            {filtered.length} results
          </span>
        </section>

        {/* ERROR BANNER */}
        {error && !loading && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-[#E7DDE8] bg-white px-4 py-3">
            <p className="text-[9px] leading-5 text-[#817B87]">
              {error}
            </p>

            <button
              onClick={() => setError(null)}
              className="shrink-0 text-[9px] font-medium text-[#5B4B8A]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN GRID */}
        <section className="mt-7 grid gap-7 lg:grid-cols-[1fr_290px]">
          {/* RESULTS */}
          <div>
            {loading ? (
              <div className="rounded-[27px] border border-[#E4DFE8] bg-white px-6 py-20 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#E4DFE8] border-t-[#5B4B8A]" />

                <p className="mt-5 text-[10px] text-[#89838F]">
                  Finding opportunities for you...
                </p>
              </div>
            ) : error && opportunities.length === 0 ? (
              <div className="rounded-[27px] border border-[#E4DFE8] bg-white px-6 py-20 text-center">
                <h2 className="text-[18px] font-semibold">
                  Unable to load opportunities
                </h2>

                <p className="mx-auto mt-2 max-w-[400px] text-[10px] leading-5 text-[#96909A]">
                  {error}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-6 rounded-full bg-[#5B4B8A] px-5 py-2.5 text-[9px] font-medium text-white"
                >
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[27px] border border-dashed border-[#DCD6E1] bg-white px-6 py-20 text-center">
                <Search
                  size={22}
                  className="mx-auto text-[#A59DAB]"
                />

                <h2 className="mt-5 text-[18px] font-semibold">
                  No opportunities found
                </h2>

                <p className="mx-auto mt-2 max-w-[380px] text-[10px] leading-5 text-[#96909A]">
                  Try changing your search or filters
                  to discover more opportunities.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setLocation("All locations");
                    setCategory("All");
                  }}
                  className="mt-6 rounded-full bg-[#5B4B8A] px-5 py-2.5 text-[9px] font-medium text-white"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    saved={saved.includes(
                      opportunity.id,
                    )}
                    saving={
                      savingId === opportunity.id
                    }
                    onSave={() =>
                      toggleSaved(opportunity.id)
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-[100px] space-y-4">
              {/* MATCH */}
              <div className="rounded-[25px] bg-[#5B4B8A] p-6 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <Sparkles size={15} />
                </div>

                <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/55">
                  Personalised
                </p>

                <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">
                  Built around you.
                </h2>

                <p className="mt-3 text-[9px] leading-5 text-white/65">
                  Aptora ranks opportunities using
                  your profile, eligibility and
                  preferences.
                </p>

                <Link
                  href="/profile"
                  className="mt-6 flex h-9 w-fit items-center gap-2 rounded-full bg-[#DCD2F2] px-4 text-[9px] font-semibold !text-black transition hover:bg-[#CEC1E9]"
                >
                  Improve profile
                  <ArrowRight
                    size={11}
                    className="text-black"
                  />
                </Link>
              </div>

              {/* TYPES */}
              <div className="rounded-[25px] border border-[#E4DFE8] bg-white p-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Explore by type
                </p>

                <div className="mt-4 space-y-1">
                  <SidebarLink
                    href="/opportunities/jobs"
                    icon={
                      <BriefcaseBusiness size={13} />
                    }
                    label="Jobs & internships"
                    count={jobCount}
                  />

                  <SidebarLink
                    href="/opportunities/scholarships"
                    icon={
                      <GraduationCap size={13} />
                    }
                    label="Scholarships"
                    count={scholarshipCount}
                  />

                  <SidebarLink
                    href="/opportunities/schemes"
                    icon={<Landmark size={13} />}
                    label="Government schemes"
                    count={schemeCount}
                  />
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

/* OPPORTUNITY CARD */

function OpportunityCard({
  opportunity,
  saved,
  saving,
  onSave,
}: {
  opportunity: DisplayOpportunity;
  saved: boolean;
  saving: boolean;
  onSave: () => void;
}) {
  const icon =
    opportunity.category === "Scholarships" ? (
      <GraduationCap
        size={18}
        className="text-[#5B4B8A]"
      />
    ) : opportunity.category === "Schemes" ? (
      <Landmark
        size={18}
        className="text-[#5B4B8A]"
      />
    ) : (
      <BriefcaseBusiness
        size={18}
        className="text-[#5B4B8A]"
      />
    );

  return (
    <article className="rounded-[25px] border border-[#E4DFE8] bg-white p-5 transition hover:border-[#CEC3D9] hover:shadow-[0_15px_40px_rgba(50,40,70,0.05)] sm:p-6">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDF7]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#9A939F]">
                  {opportunity.type}
                </span>

                {opportunity.match > 0 && (
                  <span className="rounded-full bg-[#F1EDF7] px-2.5 py-1 text-[7px] font-semibold text-[#6D5D89]">
                    {opportunity.match}% match
                  </span>
                )}

                {opportunity.eligibilityStatus ===
                  "ELIGIBLE" && (
                  <span className="rounded-full bg-[#F1F7F2] px-2.5 py-1 text-[7px] font-semibold text-[#55755D]">
                    Eligible
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-[15px] font-semibold tracking-[-0.025em]">
                {opportunity.title}
              </h2>

              <p className="mt-1 text-[9px] text-[#89838F]">
                {opportunity.organisation}
              </p>
            </div>

            <button
              onClick={onSave}
              disabled={saving}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${
                saved
                  ? "border-[#CFC3D9] bg-[#F1EDF7] text-[#5B4B8A]"
                  : "border-[#E4DFE8] bg-white text-[#AAA4B1] hover:text-[#5B4B8A]"
              } ${saving ? "cursor-wait opacity-60" : ""}`}
              aria-label={
                saved
                  ? "Remove from saved"
                  : "Save opportunity"
              }
            >
              {saving ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-[#D8D0DF] border-t-[#5B4B8A]" />
              ) : saved ? (
                <Check size={12} />
              ) : (
                <Bookmark size={13} />
              )}
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1.5 text-[8px] text-[#89838F]">
              <MapPin size={10} />
              {opportunity.location}
            </span>

            <span className="text-[8px] text-[#89838F]">
              Deadline: {opportunity.deadline}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {opportunity.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#FAF9FC] px-3 py-1.5 text-[7px] text-[#817A88]"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/opportunities/${opportunity.id}`}
            className="group mt-5 flex w-fit items-center gap-2 text-[9px] font-medium text-[#5B4B8A]"
          >
            View opportunity

            <ArrowRight
              size={11}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* FILTER SELECT */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-[0.1em] text-[#AAA4B1]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full appearance-none rounded-xl border border-[#E3DEE7] bg-white px-3 pr-9 text-[9px] text-[#686171] outline-none focus:border-[#CFC4D9]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>

      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-3 top-[30px] text-[#AAA4B1]"
      />
    </div>
  );
}

/* SIDEBAR LINK */

function SidebarLink({
  href,
  icon,
  label,
  count,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-[#FAF9FC]"
    >
      <span className="flex items-center gap-2.5 text-[9px] text-[#716A79]">
        <span className="text-[#928A98]">
          {icon}
        </span>
        {label}
      </span>

      <span className="text-[8px] text-[#AAA4B1]">
        {count}
      </span>
    </Link>
  );
}