import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/hooks/useAuth";

export type EligibilityStatus =
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "UNKNOWN";

export interface BackendOpportunity {
  id: number;
  title: string;
  opportunity_type: string;
  provider_name: string;
  description: string;
  location: string | null;
  state: string | null;
  application_url: string | null;
  official_source_url: string | null;
  deadline: string | null;
  amount: string | null;

  matching_score?: number;
  eligible?: boolean | null;
  eligibility_status?: EligibilityStatus;
  eligibility?: Record<string, unknown>;
}

export interface OpportunityListResponse {
  items: BackendOpportunity[];
  total: number;
}

export interface SavedOpportunity {
  id: number;
  opportunity_id: number;
  created_at: string;
  title: string;
  opportunity_type: string;
  provider_name: string;
  deadline: string | null;
  application_url: string | null;
  official_source_url: string | null;
}

export interface SavedOpportunityListResponse {
  items: SavedOpportunity[];
  total: number;
}

export interface ApplicationRecord {
  id: number;
  opportunity_id: number;
  title: string;
  opportunity_type: string;
  provider_name: string;
  status: string;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationListResponse {
  items: ApplicationRecord[];
  total: number;
}

function requireToken(): string {
  const token = getStoredToken();

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return token;
}

/**
 * Get the complete public opportunity catalogue.
 *
 * This endpoint does NOT require authentication.
 * It is the fallback used by the UI when personalized
 * matching is unavailable.
 */
export async function getOpportunities(
  limit = 2000,
): Promise<OpportunityListResponse> {
  const safeLimit = Math.min(Math.max(limit, 1), 2000);

  return apiRequest<OpportunityListResponse>(
    `/opportunities?limit=${safeLimit}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Get personalized opportunities for the logged-in user.
 *
 * If the user has no profile, the backend may return UNKNOWN
 * eligibility. That is valid and should not be treated as an error.
 */
export async function getMatchingOpportunities(
  limit = 2000,
): Promise<OpportunityListResponse> {
  const token = requireToken();
  const safeLimit = Math.min(Math.max(limit, 1), 2000);

  return apiRequest<OpportunityListResponse>(
    `/matching/opportunities?limit=${safeLimit}`,
    {
      method: "GET",
      token,
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Load one real opportunity by ID.
 */
export async function getOpportunity(
  opportunityId: number,
): Promise<BackendOpportunity> {
  if (!Number.isFinite(opportunityId) || opportunityId <= 0) {
    throw new Error("Invalid opportunity ID.");
  }

  return apiRequest<BackendOpportunity>(
    `/opportunities/${opportunityId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Save an opportunity for the logged-in user.
 *
 * Saving an already-saved opportunity is treated as success.
 * This prevents the UI from showing a false failure when the
 * record already exists.
 */
export async function saveOpportunity(
  opportunityId: number,
): Promise<void> {
  const token = requireToken();

  if (!Number.isFinite(opportunityId) || opportunityId <= 0) {
    throw new Error("Invalid opportunity ID.");
  }

  try {
    await apiRequest(
      `/saved-opportunities/${opportunityId}`,
      {
        method: "POST",
        token,
        headers: {
          Accept: "application/json",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message.toLowerCase() : "";

    if (
      message.includes("already saved") ||
      message.includes("already exists") ||
      message.includes("409")
    ) {
      return;
    }

    throw error;
  }
}

/**
 * Remove a saved opportunity.
 */
export async function removeSavedOpportunity(
  opportunityId: number,
): Promise<void> {
  const token = requireToken();

  if (!Number.isFinite(opportunityId) || opportunityId <= 0) {
    throw new Error("Invalid opportunity ID.");
  }

  await apiRequest(
    `/saved-opportunities/${opportunityId}`,
    {
      method: "DELETE",
      token,
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Get all saved opportunities for the logged-in user.
 */
export async function getSavedOpportunities(): Promise<SavedOpportunityListResponse> {
  const token = requireToken();

  return apiRequest<SavedOpportunityListResponse>(
    "/saved-opportunities",
    {
      method: "GET",
      token,
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Get all applications tracked by the logged-in user.
 */
export async function getApplications(): Promise<ApplicationListResponse> {
  const token = requireToken();

  return apiRequest<ApplicationListResponse>(
    "/applications",
    {
      method: "GET",
      token,
      headers: {
        Accept: "application/json",
      },
    },
  );
}

/**
 * Build a Set of saved opportunity IDs.
 *
 * Pages can use this to instantly determine whether
 * an opportunity is saved.
 */
export async function getSavedOpportunityIds(): Promise<Set<number>> {
  const response = await getSavedOpportunities();

  return new Set(
    response.items
      .map((item) => Number(item.opportunity_id))
      .filter((id) => Number.isFinite(id) && id > 0),
  );
}

/**
 * Get personalized opportunities with a safe public-catalogue fallback.
 *
 * This is the function UI pages should use.
 *
 * Priority:
 *   1. Personalized matching
 *   2. Real public opportunities
 *
 * We NEVER replace failed API data with fake/static opportunities.
 */
export async function getOpportunityFeed(
  limit = 2000,
): Promise<OpportunityListResponse> {
  const token = getStoredToken();

  if (token) {
    try {
      const matching = await getMatchingOpportunities(limit);

      if (matching.items.length > 0) {
        return {
          items: matching.items,
          total: matching.total,
        };
      }
    } catch {
      // Personalized matching is unavailable.
      // Fall through to the real public catalogue.
    }
  }

  return getOpportunities(limit);
}

/**
 * Normalize backend opportunity data so the UI can safely
 * render every record, including records without structured
 * eligibility rules.
 */
export function normalizeOpportunity(
  opportunity: BackendOpportunity,
): BackendOpportunity {
  return {
    ...opportunity,

    id: Number(opportunity.id),
    title: opportunity.title || "Untitled opportunity",
    opportunity_type: opportunity.opportunity_type || "PROGRAM",
    provider_name: opportunity.provider_name || "Unknown provider",
    description: opportunity.description || "",
    location: opportunity.location || null,
    state: opportunity.state || null,
    application_url: opportunity.application_url || null,
    official_source_url: opportunity.official_source_url || null,
    deadline: opportunity.deadline || null,
    amount: opportunity.amount || null,

    matching_score:
      typeof opportunity.matching_score === "number"
        ? opportunity.matching_score
        : 0,

    eligible:
      typeof opportunity.eligible === "boolean"
        ? opportunity.eligible
        : null,

    eligibility_status:
      opportunity.eligibility_status === "ELIGIBLE" ||
      opportunity.eligibility_status === "NOT_ELIGIBLE" ||
      opportunity.eligibility_status === "UNKNOWN"
        ? opportunity.eligibility_status
        : "UNKNOWN",
  };
}

/**
 * Normalize an entire opportunity response.
 */
export function normalizeOpportunityResponse(
  response: OpportunityListResponse,
): OpportunityListResponse {
  return {
    items: Array.isArray(response.items)
      ? response.items.map(normalizeOpportunity)
      : [],
    total:
      typeof response.total === "number"
        ? response.total
        : response.items?.length || 0,
  };
}