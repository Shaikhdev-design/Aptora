"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  Search,
} from "lucide-react";

import {
  getApplications,
  type ApplicationRecord,
} from "@/services/opportunityService";

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<ApplicationRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setError(null);

        const response = await getApplications();

        setApplications(response.items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load applications.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const activeCount = useMemo(
    () =>
      applications.filter((application) => {
        const status =
          application.status.toLowerCase();

        return ![
          "rejected",
          "withdrawn",
          "closed",
        ].includes(status);
      }).length,
    [applications],
  );

  const appliedCount = useMemo(
    () =>
      applications.filter((application) => {
        const status =
          application.status.toLowerCase();

        return [
          "applied",
          "submitted",
          "under_review",
        ].includes(status);
      }).length,
    [applications],
  );

  const pendingCount = useMemo(
    () =>
      applications.filter((application) => {
        const status =
          application.status.toLowerCase();

        return [
          "pending",
          "awaiting_response",
          "under_review",
        ].includes(status);
      }).length,
    [applications],
  );

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1180px] px-6 py-10 sm:px-8 lg:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[11px] font-medium text-[#8A8490]"
        >
          <ArrowLeft size={13} />
          Back to dashboard
        </Link>

        <section className="mt-7">
          <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
            Your progress
          </p>

          <h1 className="mt-3 text-[39px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px]">
            Applications
          </h1>

          <p className="mt-4 max-w-[570px] text-[11px] leading-6 text-[#817B87]">
            Track application records you have created
            through Aptora.
          </p>
        </section>

        {error && (
          <div className="mt-7 rounded-2xl border border-[#E6D7DE] bg-[#FFF8FA] px-5 py-4 text-[11px] text-[#8B5E6A]">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            value={
              loading
                ? "—"
                : String(activeCount)
            }
            label="Active"
          />

          <Stat
            value={
              loading
                ? "—"
                : String(appliedCount)
            }
            label="Applied"
          />

          <Stat
            value={
              loading
                ? "—"
                : String(pendingCount)
            }
            label="Awaiting response"
          />
        </section>

        {loading ? (
          <section className="mt-8 rounded-[28px] bg-white px-6 py-20 text-center">
            <p className="text-[11px] text-[#96909A]">
              Loading applications...
            </p>
          </section>
        ) : applications.length === 0 ? (
          <section className="mt-8 rounded-[28px] border border-dashed border-[#DCD6E1] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDF7]">
              <ClipboardCheck
                size={21}
                className="text-[#5B4B8A]"
              />
            </div>

            <h2 className="mt-5 text-[18px] font-semibold">
              No applications tracked yet
            </h2>

            <p className="mx-auto mt-2 max-w-[410px] text-[10px] leading-5 text-[#96909A]">
              When you explicitly create an application
              record, it will appear here.
            </p>

            <Link
              href="/opportunities"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#DCD2F2] px-5 text-[10px] font-semibold text-[#51427D]"
            >
              Browse opportunities
              <Search size={12} />
            </Link>
          </section>
        ) : (
          <section className="mt-8 space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1EDF7]">
                    <BriefcaseBusiness
                      size={17}
                      className="text-[#5B4B8A]"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#AAA4B1]">
                          {application.opportunity_type}
                        </p>

                        <h2 className="mt-2 text-[17px] font-semibold">
                          {application.title}
                        </h2>

                        <p className="mt-1 text-[10px] text-[#817B87]">
                          {application.provider_name}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F1EDF7] px-3 py-1.5 text-[9px] font-semibold text-[#5B4B8A]">
                        {application.status}
                      </span>
                    </div>

                    {application.notes && (
                      <p className="mt-4 rounded-xl bg-[#FAF9FC] p-4 text-[10px] leading-5 text-[#817B87]">
                        {application.notes}
                      </p>
                    )}

                    <div className="mt-5 border-t border-[#F0EDF2] pt-4">
                      <Link
                        href={`/opportunities/${application.opportunity_id}`}
                        className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#5B4B8A]"
                      >
                        View opportunity
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[23px] border border-[#E5E0E9] bg-white p-5">
      <p className="text-[27px] font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#AAA4B1]">
        {label}
      </p>
    </div>
  );
}