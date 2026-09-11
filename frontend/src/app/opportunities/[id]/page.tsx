"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  GraduationCap,
  IndianRupee,
  Link2,
  MapPin,
  Share2,
  BriefcaseBusiness,
  Landmark,
  Sparkles,
} from "lucide-react";

import {
  BackendOpportunity,
  getOpportunity,
  removeSavedOpportunity,
  saveOpportunity,
} from "@/services/opportunityService";

import { getStoredToken } from "@/hooks/useAuth";

type EligibilityRule = {
  field_name?: string;
  operator?: string;
  expected_value?: unknown;
  actual_value?: unknown;
  passed?: boolean | null;
  status?: string;
  explanation?: string;
  message?: string;
};

type EligibilityData = {
  eligible?: boolean | null;
  eligibility_status?: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN";
  total_rules?: number;
  passed_rules?: number;
  failed_rules?: number;
  unknown_rules?: number;
  message?: string;
  results?: EligibilityRule[];
};

function formatType(type: string): string {
  return type
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

function getCategory(type: string): string {
  const value = type.toLowerCase().trim();

  if (value.includes("job")) return "Jobs";
  if (value.includes("intern")) return "Internships";
  if (value.includes("scholar")) return "Scholarships";
  if (value.includes("scheme")) return "Schemes";
  if (value.includes("fellow")) return "Fellowships";
  if (value.includes("train")) return "Training";
  if (value.includes("program")) return "Programs";
  if (value.includes("competition")) return "Competitions";

  return "Opportunities";
}

function getOpportunityIcon(type: string) {
  const category = getCategory(type);

  if (category === "Scholarships") {
    return <GraduationCap size={20} className="text-[#5B4B8A]" />;
  }

  if (category === "Schemes") {
    return <Landmark size={20} className="text-[#5B4B8A]" />;
  }

  return <BriefcaseBusiness size={20} className="text-[#5B4B8A]" />;
}

function getEligibilityLabel(
  status: "ELIGIBLE" | "NOT_ELIGIBLE" | "UNKNOWN",
): string {
  if (status === "ELIGIBLE") return "Eligible";
  if (status === "NOT_ELIGIBLE") return "Not eligible";
  return "Eligibility unknown";
}

export default function OpportunityDetailsPage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [opportunity, setOpportunity] =
    useState<BackendOpportunity | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadOpportunity() {
      try {
        setLoading(true);
        setError(null);

        const data = await getOpportunity(Number(id));

        setOpportunity(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this opportunity.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  async function toggleSaved() {
    if (!opportunity || saveLoading) return;

    const token = getStoredToken();

    if (!token) {
      setError("Please log in to save opportunities.");
      return;
    }

    try {
      setSaveLoading(true);
      setError(null);

      if (saved) {
        await removeSavedOpportunity(opportunity.id);
        setSaved(false);
      } else {
        await saveOpportunity(opportunity.id);
        setSaved(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update saved opportunity.",
      );
    } finally {
      setSaveLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9FC] px-6 py-20 text-[#29252F]">
        <div className="mx-auto max-w-[1000px]">
          <div className="rounded-[28px] border border-[#E7E3EC] bg-white px-6 py-24 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E4DFE8] border-t-[#5B4B8A]" />

            <p className="mt-5 text-sm text-[#89838F]">
              Loading opportunity...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !opportunity) {
    return (
      <main className="min-h-screen bg-[#FAF9FC] px-6 py-20 text-[#29252F]">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#85808C] transition hover:text-[#5B4B8A]"
          >
            <ArrowLeft size={15} />
            Back to opportunities
          </Link>

          <div className="mt-8 rounded-[28px] border border-[#E7E3EC] bg-white p-10 text-center">
            <h1 className="text-2xl font-semibold">
              Opportunity not found
            </h1>

            <p className="mx-auto mt-3 max-w-[500px] text-sm leading-6 text-[#85808C]">
              {error}
            </p>

            <Link
              href="/opportunities"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#5B4B8A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4F4078]"
            >
              Browse opportunities
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!opportunity) {
    return null;
  }

  const type = formatType(opportunity.opportunity_type);
  const category = getCategory(opportunity.opportunity_type);

  const eligibilityData =
    (opportunity.eligibility as EligibilityData | undefined) ?? {};

  const eligibilityStatus =
    opportunity.eligibility_status ?? "UNKNOWN";

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1250px] px-6 py-10 sm:px-8 lg:py-14">
        {/* BACK */}
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#85808C] transition hover:text-[#5B4B8A]"
        >
          <ArrowLeft size={15} />
          Back to opportunities
        </Link>

        {/* BREADCRUMB */}
        <div className="mt-7 flex flex-wrap items-center gap-2 text-xs text-[#AAA4B1]">
          <Link
            href="/opportunities"
            className="transition hover:text-[#5B4B8A]"
          >
            Opportunities
          </Link>

          <span>/</span>

          <span>{category}</span>

          <span>/</span>

          <span className="max-w-[300px] truncate font-medium text-[#6F6877]">
            {opportunity.title}
          </span>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-[#E4DDEB] bg-[#F5F1F9] px-5 py-4 text-sm text-[#66577F]">
            {error}
          </div>
        )}

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_310px]">
          {/* MAIN */}
          <div className="space-y-6">
            {/* HEADER */}
            <section className="rounded-[28px] border border-[#E4DFE8] bg-white p-7 sm:p-9">
              <div className="flex items-start justify-between gap-5">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                    {getOpportunityIcon(
                      opportunity.opportunity_type,
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#F1EDF7] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6D5D89]">
                        {type}
                      </span>

                      {opportunity.matching_score !== undefined && (
                        <span className="rounded-full bg-[#F5F1F9] px-3 py-1.5 text-[9px] font-semibold text-[#6D5D89]">
                          {Math.round(
                            opportunity.matching_score,
                          )}
                          % match
                        </span>
                      )}

                      {eligibilityStatus === "ELIGIBLE" && (
                        <span className="rounded-full bg-[#F1F7F2] px-3 py-1.5 text-[9px] font-semibold text-[#55755D]">
                          Eligible
                        </span>
                      )}
                    </div>

                    <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-[#29252F] sm:text-[40px]">
                      {opportunity.title}
                    </h1>

                    <p className="mt-3 text-sm text-[#817B87]">
                      {opportunity.provider_name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleSaved}
                  disabled={saveLoading}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                    saved
                      ? "border-[#CFC3D9] bg-[#F1EDF7] text-[#5B4B8A]"
                      : "border-[#E4DFE8] bg-white text-[#AAA4B1] hover:text-[#5B4B8A]"
                  }`}
                  aria-label={
                    saved
                      ? "Remove from saved"
                      : "Save opportunity"
                  }
                >
                  {saved ? (
                    <Check size={16} />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#EEEAEF] pt-6">
                <div className="flex items-center gap-2 text-sm text-[#716A79]">
                  <MapPin
                    size={15}
                    className="text-[#7966A4]"
                  />
                  {opportunity.location ||
                    opportunity.state ||
                    "India"}
                </div>

                <div className="flex items-center gap-2 text-sm text-[#716A79]">
                  <CalendarDays
                    size={15}
                    className="text-[#7966A4]"
                  />
                  Deadline:{" "}
                  {formatDeadline(opportunity.deadline)}
                </div>

                {opportunity.amount && (
                  <div className="flex items-center gap-2 text-sm text-[#716A79]">
                    <IndianRupee
                      size={15}
                      className="text-[#7966A4]"
                    />
                    {opportunity.amount}
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {opportunity.application_url ? (
                  <a
                    href={opportunity.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#5B4B8A] px-6 text-sm font-semibold text-white transition hover:bg-[#4F4078]"
                  >
                    Apply Now
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : opportunity.official_source_url ? (
                  <a
                    href={opportunity.official_source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#EDE7F7] px-6 text-sm font-semibold text-[#5B4B8A] transition hover:bg-[#E3DAF2]"
                  >
                    View official source
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        window.location.href,
                      );
                    } catch {
                      // Clipboard may be unavailable.
                    }
                  }}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E1DCE5] bg-white px-5 text-sm font-medium text-[#716A79] transition hover:border-[#CEC3D9] hover:text-[#5B4B8A]"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </section>

            {/* FULL DESCRIPTION */}
            <section className="rounded-[28px] border border-[#E4DFE8] bg-white p-7 sm:p-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                Opportunity details
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                About this opportunity
              </h2>

              <div className="mt-6 whitespace-pre-line text-sm leading-7 text-[#716B78]">
                {opportunity.description ||
                  "No detailed description is currently available for this opportunity."}
              </div>

              <div className="mt-8">
                <h3 className="text-base font-semibold text-[#302B36]">
                  Opportunity information
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#F4F0F8] px-3 py-1.5 text-[11px] font-medium text-[#70617F]">
                    {type}
                  </span>

                  {opportunity.state && (
                    <span className="rounded-full bg-[#F4F0F8] px-3 py-1.5 text-[11px] font-medium text-[#70617F]">
                      {opportunity.state}
                    </span>
                  )}

                  {opportunity.location &&
                    opportunity.location !==
                      opportunity.state && (
                      <span className="rounded-full bg-[#F4F0F8] px-3 py-1.5 text-[11px] font-medium text-[#70617F]">
                        {opportunity.location}
                      </span>
                    )}
                </div>
              </div>
            </section>

            {/* ELIGIBILITY */}
            <section className="rounded-[28px] border border-[#E4DFE8] bg-white p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                    Aptora eligibility
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    Eligibility
                  </h2>
                </div>

                <div
                  className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-semibold ${
                    eligibilityStatus === "ELIGIBLE"
                      ? "bg-[#F1F7F2] text-[#55755D]"
                      : eligibilityStatus ===
                          "NOT_ELIGIBLE"
                        ? "bg-[#F8F0F0] text-[#8A5E5E]"
                        : "bg-[#F4F0F8] text-[#70617F]"
                  }`}
                >
                  {getEligibilityLabel(
                    eligibilityStatus,
                  )}
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#716B78]">
                {eligibilityData.message ||
                  "Aptora could not determine eligibility from the available structured requirements."}
              </p>

              {Array.isArray(eligibilityData.results) &&
                eligibilityData.results.length > 0 && (
                  <div className="mt-7 space-y-3">
                    {eligibilityData.results.map(
                      (rule, index) => (
                        <div
                          key={`${rule.field_name ?? "rule"}-${index}`}
                          className="rounded-2xl bg-[#FAF8FC] p-4"
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                                rule.passed === true
                                  ? "bg-[#EAF3EC] text-[#55755D]"
                                  : rule.passed === false
                                    ? "bg-[#F7EDED] text-[#8A5E5E]"
                                    : "bg-[#EEEAF3] text-[#70617F]"
                              }`}
                            >
                              {rule.passed === true ? (
                                <Check size={13} />
                              ) : (
                                <span className="text-[11px]">
                                  {rule.passed === false
                                    ? "!"
                                    : "?"}
                                </span>
                              )}
                            </span>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#403A47]">
                                {rule.explanation ||
                                  rule.message ||
                                  "Eligibility requirement"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

              {eligibilityData.total_rules !== undefined && (
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <StatBox
                    label="Rules"
                    value={eligibilityData.total_rules}
                  />

                  <StatBox
                    label="Passed"
                    value={
                      eligibilityData.passed_rules ?? 0
                    }
                  />

                  <StatBox
                    label="Failed"
                    value={
                      eligibilityData.failed_rules ?? 0
                    }
                  />

                  <StatBox
                    label="Unknown"
                    value={
                      eligibilityData.unknown_rules ?? 0
                    }
                  />
                </div>
              )}
            </section>

            {/* OFFICIAL SOURCE */}
            <section className="rounded-[28px] border border-[#E4DFE8] bg-white p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F1EDF7]">
                  <Link2
                    size={18}
                    className="text-[#5B4B8A]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                    Official information
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Source
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#817B87]">
                    Always verify the latest eligibility,
                    deadline and application instructions on
                    the official source before applying.
                  </p>

                  {opportunity.official_source_url && (
                    <a
                      href={opportunity.official_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#5B4B8A] transition hover:text-[#4B3D70]"
                    >
                      Open official source
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </section>

            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-full border border-[#DDD8E3] bg-white px-5 py-2.5 text-sm font-medium text-[#5B4B8A] transition hover:bg-[#F4F0FA]"
            >
              <ArrowLeft size={15} />
              Back to opportunities
            </Link>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* MATCH */}
            <section className="rounded-[27px] bg-[#5B4B8A] p-6 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={17} />
              </div>

              <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/55">
                Personalised match
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-[-0.05em]">
                  {Math.round(
                    opportunity.matching_score ?? 0,
                  )}
                  %
                </span>

                <span className="mb-1 text-[11px] text-white/60">
                  match
                </span>
              </div>

              <p className="mt-3 text-[11px] leading-5 text-white/65">
                Aptora calculates this match using your
                profile, preferences, opportunity type and
                available eligibility information.
              </p>

              <Link
                href="/profile"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#DDD4F0] px-4 py-2.5 text-[10px] font-semibold text-[#29252F] transition hover:bg-[#D1C6E9]"
              >
                Improve profile
                <ArrowUpRight size={14} />
              </Link>
            </section>

            {/* KEY INFORMATION */}
            <section className="rounded-[27px] border border-[#E4DFE8] bg-white p-6">
              <h2 className="text-base font-semibold">
                Key information
              </h2>

              <div className="mt-6 space-y-5">
                <InfoRow
                  icon={<BriefcaseBusiness size={16} />}
                  label="Type"
                  value={type}
                />

                <InfoRow
                  icon={<MapPin size={16} />}
                  label="Location"
                  value={
                    opportunity.location ||
                    opportunity.state ||
                    "India"
                  }
                />

                <InfoRow
                  icon={<CalendarDays size={16} />}
                  label="Deadline"
                  value={formatDeadline(
                    opportunity.deadline,
                  )}
                />

                <InfoRow
                  icon={<IndianRupee size={16} />}
                  label="Amount / stipend"
                  value={
                    opportunity.amount || "Not specified"
                  }
                />

                <InfoRow
                  icon={<Check size={16} />}
                  label="Eligibility"
                  value={getEligibilityLabel(
                    eligibilityStatus,
                  )}
                />

                <InfoRow
                  icon={<Share2 size={16} />}
                  label="Provider"
                  value={opportunity.provider_name}
                />
              </div>
            </section>

            {/* APPLICATION */}
            <section className="rounded-[27px] border border-[#E4DFE8] bg-white p-6">
              <h2 className="text-base font-semibold">
                Ready to apply?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#817B87]">
                Review the complete opportunity details and
                use the official source to submit your
                application.
              </p>

              {opportunity.application_url ? (
                <a
                  href={opportunity.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-[#5B4B8A] text-sm font-semibold text-white transition hover:bg-[#4F4078]"
                >
                  Apply now
                  <ArrowUpRight size={15} />
                </a>
              ) : opportunity.official_source_url ? (
                <a
                  href={opportunity.official_source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-[#EDE7F7] text-sm font-semibold text-[#5B4B8A] transition hover:bg-[#E3DAF2]"
                >
                  Open official source
                  <ArrowUpRight size={15} />
                </a>
              ) : (
                <p className="mt-5 rounded-2xl bg-[#FAF8FC] px-4 py-3 text-xs leading-5 text-[#817B87]">
                  Application information is not currently
                  available.
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1EDF7] text-[#695494]">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-[11px] text-[#99939E]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm leading-5 text-[#5D5764]">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-[#FAF8FC] px-4 py-3">
      <p className="text-[10px] text-[#99939E]">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-[#514B59]">
        {value}
      </p>
    </div>
  );
}