"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Search,
  Trash2,
} from "lucide-react";

import {
  getSavedOpportunities,
  removeSavedOpportunity,
  type SavedOpportunity,
} from "@/services/opportunityService";

function formatType(type: string): string {
  return type
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

export default function SavedPage() {
  const [items, setItems] = useState<
    SavedOpportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  async function loadSaved() {
    try {
      setLoading(true);
      setError(null);

      const response =
        await getSavedOpportunities();

      setItems(response.items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load saved opportunities.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSaved();
  }, []);

  async function removeSaved(opportunityId: number) {
    try {
      setError(null);

      await removeSavedOpportunity(
        opportunityId,
      );

      setItems((current) =>
        current.filter(
          (item) =>
            item.opportunity_id !== opportunityId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove saved opportunity.",
      );
    }
  }

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

        <section className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#AAA4B1]">
              Your collection
            </p>

            <h1 className="mt-3 text-[39px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px]">
              Saved opportunities
            </h1>

            <p className="mt-4 max-w-[540px] text-[11px] leading-6 text-[#817B87]">
              Opportunities you have saved from your
              Aptora account.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="flex h-10 w-fit items-center gap-2 rounded-full bg-[#DCD2F2] px-5 text-[10px] font-semibold text-[#51427D]"
          >
            Find opportunities
            <Search size={12} />
          </Link>
        </section>

        {error && (
          <div className="mt-7 rounded-2xl border border-[#E6D7DE] bg-[#FFF8FA] px-5 py-4 text-[11px] text-[#8B5E6A]">
            {error}
          </div>
        )}

        {loading ? (
          <section className="mt-9 rounded-[28px] bg-white px-6 py-20 text-center">
            <p className="text-[11px] text-[#96909A]">
              Loading saved opportunities...
            </p>
          </section>
        ) : items.length === 0 ? (
          <section className="mt-9 rounded-[28px] border border-dashed border-[#DCD6E1] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1EDF7]">
              <Bookmark
                size={21}
                className="text-[#5B4B8A]"
              />
            </div>

            <h2 className="mt-5 text-[18px] font-semibold">
              Nothing saved here yet
            </h2>

            <p className="mx-auto mt-2 max-w-[380px] text-[10px] leading-5 text-[#96909A]">
              Save opportunities from Aptora and they
              will appear here automatically.
            </p>

            <Link
              href="/opportunities"
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-[#DCD2F2] px-5 text-[10px] font-semibold text-[#51427D]"
            >
              Explore opportunities
              <ArrowRight size={12} />
            </Link>
          </section>
        ) : (
          <section className="mt-9 space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                      {formatType(
                        item.opportunity_type,
                      )}
                    </p>

                    <h2 className="mt-2 text-[18px] font-semibold">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-[10px] text-[#817B87]">
                      {item.provider_name}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-[9px] text-[#8A8490]">
                      <span>
                        Deadline:{" "}
                        {formatDeadline(
                          item.deadline,
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeSaved(
                        item.opportunity_id,
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E0E8] text-[#8D8792]"
                    aria-label="Remove saved opportunity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-5 border-t border-[#F0EDF2] pt-5">
                  <Link
                    href={`/opportunities/${item.opportunity_id}`}
                    className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#29252F]"
                  >
                    View opportunity
                    <ArrowRight size={12} />
                  </Link>

                  {item.official_source_url && (
                    <a
                      href={item.official_source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-medium text-[#5B4B8A]"
                    >
                      Official source
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}