"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Loader2,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import { getStoredToken } from "@/hooks/useAuth";

const states = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "West Bengal",
  "Uttar Pradesh",
  "Rajasthan",
  "Telangana",
  "Kerala",
  "Other",
];

const categories = [
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS",
  "Prefer not to say",
];

const incomeOptions = [
  "Below ₹1 lakh",
  "₹1–3 lakh",
  "₹3–5 lakh",
  "₹5–8 lakh",
  "₹8–12 lakh",
  "Above ₹12 lakh",
  "Prefer not to say",
];

const livingOptions = [
  "Urban",
  "Semi-urban",
  "Rural",
];

const genderOptions = [
  "Female",
  "Male",
  "Other",
  "Prefer not to say",
];

type ProfileData = {
  name?: string;
  age?: string;
  education?: string;
  course?: string;
  status?: string;
  interests?: string[];
};

type ProfilePayload = {
  age: number | null;
  education_level: string | null;
  field_of_study: string | null;
  institution: string | null;
  graduation_year: number | null;
  location: string | null;
  state: string | null;
  category: string | null;
  annual_family_income: number | null;
  skills: string | null;
  interests: string | null;
  preferred_opportunity_types: string | null;
  gender: string | null;
};

function convertIncomeToNumber(
  value: string,
): number | null {
  switch (value) {
    case "Below ₹1 lakh":
      return 50000;

    case "₹1–3 lakh":
      return 200000;

    case "₹3–5 lakh":
      return 400000;

    case "₹5–8 lakh":
      return 650000;

    case "₹8–12 lakh":
      return 1000000;

    case "Above ₹12 lakh":
      return 1200001;

    default:
      return null;
  }
}

function mapInterestToOpportunityType(
  interest: string,
): string | null {
  const normalized = interest.toLowerCase();

  if (normalized.includes("scholarship")) {
    return "SCHOLARSHIP";
  }

  if (normalized.includes("government job")) {
    return "JOB";
  }

  if (normalized.includes("private job")) {
    return "JOB";
  }

  if (normalized.includes("internship")) {
    return "INTERNSHIP";
  }

  if (normalized.includes("government scheme")) {
    return "GOVERNMENT_SCHEME";
  }

  if (normalized.includes("fellowship")) {
    return "FELLOWSHIP";
  }

  if (normalized.includes("skill development")) {
    return "TRAINING";
  }

  if (normalized.includes("entrepreneurship")) {
    return "PROGRAM";
  }

  return null;
}

export default function DetailsPage() {
  const router = useRouter();

  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [income, setIncome] = useState("");
  const [livingArea, setLivingArea] = useState("");
  const [gender, setGender] = useState("");
  const [disability, setDisability] = useState("");

  const [profileData, setProfileData] =
    useState<ProfileData | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedProfile =
        localStorage.getItem("aptora_profile");

      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile));
      }

      const storedDetails =
        localStorage.getItem("aptora_details");

      if (!storedDetails) return;

      const details = JSON.parse(storedDetails);

      setState(details.state || "");
      setCategory(details.category || "");
      setIncome(details.income || "");
      setLivingArea(details.livingArea || "");
      setGender(details.gender || "");
      setDisability(details.disability || "");
    } catch {
      localStorage.removeItem("aptora_details");
    }
  }, []);

  useEffect(() => {
    const details = {
      state,
      category,
      income,
      livingArea,
      gender,
      disability,
    };

    localStorage.setItem(
      "aptora_details",
      JSON.stringify(details),
    );
  }, [
    state,
    category,
    income,
    livingArea,
    gender,
    disability,
  ]);

  const handleCompleteProfile = async () => {
    setError("");

    const token = getStoredToken();

    if (!token) {
      setError(
        "Your session has expired. Please sign in again.",
      );
      return;
    }

    if (!profileData) {
      setError(
        "Profile information is missing. Please go back and complete the previous step.",
      );
      return;
    }

    setSaving(true);

    try {
      const interests =
        profileData.interests || [];

      const preferredTypes = Array.from(
        new Set(
          interests
            .map(mapInterestToOpportunityType)
            .filter(
              (
                value,
              ): value is string =>
                Boolean(value),
            ),
        ),
      );

      const ageValue = profileData.age
        ? Number(profileData.age)
        : null;

      const payload: ProfilePayload = {
        age:
          ageValue !== null &&
          Number.isFinite(ageValue)
            ? ageValue
            : null,

        education_level:
          profileData.education?.trim() || null,

        field_of_study:
          profileData.course?.trim() || null,

        institution: null,

        graduation_year: null,

        location:
          state.trim() || null,

        state:
          state.trim() || null,

        category:
          category.trim() || null,

        annual_family_income:
          convertIncomeToNumber(income),

        skills: null,

        interests:
          interests.length > 0
            ? interests.join(", ")
            : null,

        preferred_opportunity_types:
          preferredTypes.length > 0
            ? preferredTypes.join(",")
            : null,

        gender:
          gender.trim() || null,
      };

      /*
       * A new user should not have a profile yet.
       * POST creates the profile.
       *
       * If the user somehow already has one,
       * PUT updates it instead.
       */
      try {
        await apiRequest("/profiles/me", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      } catch (createError) {
        const message =
          createError instanceof Error
            ? createError.message
            : "";

        if (
          message.toLowerCase().includes(
            "profile already exists",
          )
        ) {
          await apiRequest("/profiles/me", {
            method: "PUT",
            token,
            body: JSON.stringify(payload),
          });
        } else {
          throw createError;
        }
      }

      /*
       * The profile is now safely stored in PostgreSQL.
       * The temporary onboarding copies are no longer needed.
       */
      localStorage.removeItem("aptora_profile");
      localStorage.removeItem("aptora_details");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(
        "[Aptora] Profile creation failed:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      {/* PROGRESS */}
      <div className="mx-auto max-w-[760px] px-6 pt-10 sm:px-8">
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-[#5B4B8A]">
            Step 3 of 3
          </span>

          <span className="text-[#AAA4B1]">
            Almost there
          </span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E9E5EE]">
          <div className="h-full w-full rounded-full bg-[#B9A9D8]" />
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-[760px] px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
        {/* INTRO */}
        <div className="max-w-[620px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEEAF5]">
            <MapPin
              size={18}
              strokeWidth={1.7}
              className="text-[#8A78AD]"
            />
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F82A8]">
            One last step
          </p>

          <h1 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[56px]">
            Help us find
            <br />
            what fits you.
          </h1>

          <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#77717F]">
            These details help Aptora determine which
            opportunities you may be eligible for. You
            can update them anytime.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-8 rounded-2xl border border-[#E5CDD4] bg-[#FCF3F5] px-5 py-4 text-[13px] leading-6 text-[#875B68]">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="mt-12 space-y-10">
          {/* LOCATION */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Where do you currently live?
            </label>

            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AAA4B1]"
              />

              <select
                value={state}
                onChange={(e) =>
                  setState(e.target.value)
                }
                className="h-13 w-full appearance-none rounded-2xl border border-[#DDD8E3] bg-white pl-11 pr-4 text-sm text-[#29252F] outline-none focus:border-[#A996C7] focus:ring-4 focus:ring-[#B9A9D8]/[0.12]"
              >
                <option value="">
                  Select your state
                </option>

                {states.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Social category
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((item) => {
                const selected =
                  category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCategory(item)
                    }
                    className={`flex min-h-[50px] items-center justify-between rounded-2xl border px-4 text-left text-[12px] font-medium ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    <span>{item}</span>

                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B9A9D8] text-white">
                        <Check size={11} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INCOME */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Approximate annual family income
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {incomeOptions.map((item) => {
                const selected =
                  income === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setIncome(item)
                    }
                    className={`min-h-[50px] rounded-2xl border px-3 text-[11px] font-medium ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GENDER */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Gender
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {genderOptions.map((item) => {
                const selected =
                  gender === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setGender(item)
                    }
                    className={`min-h-[50px] rounded-2xl border px-3 text-[11px] font-medium ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LIVING AREA */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Area you live in
            </label>

            <div className="grid grid-cols-3 gap-3">
              {livingOptions.map((item) => {
                const selected =
                  livingArea === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setLivingArea(item)
                    }
                    className={`min-h-[50px] rounded-2xl border px-3 text-[11px] font-medium ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISABILITY */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              Do you identify as a person with a disability?
            </label>

            <div className="grid grid-cols-3 gap-3">
              {[
                "Yes",
                "No",
                "Prefer not to say",
              ].map((item) => {
                const selected =
                  disability === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setDisability(item)
                    }
                    className={`min-h-[50px] rounded-2xl border px-3 text-[11px] font-medium ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-14 flex flex-col-reverse gap-3 border-t border-[#E7E3EC] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/get-started/profile"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#D9D0E8] bg-white px-6 text-[13px] font-medium text-[#655C70] hover:border-[#C5B8D8] hover:bg-[#F8F5FB]"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <button
            type="button"
            onClick={handleCompleteProfile}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-3 rounded-full bg-[#DCD2F2] px-7 text-[13px] font-semibold text-[#51427D] shadow-sm hover:bg-[#CEC1E9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                Saving profile...
              </>
            ) : (
              <>
                Complete profile
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>

        {/* PRIVACY */}
        <p className="mt-6 text-center text-[10px] leading-5 text-[#AAA4B1]">
          Aptora uses these details to improve
          opportunity matching. You remain in control of
          your information.
        </p>
      </section>
    </main>
  );
}