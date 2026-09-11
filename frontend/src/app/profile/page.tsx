"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  GraduationCap,
  Pencil,
  Save,
  Sparkles,
  UserRound,
  MapPin,
} from "lucide-react";

type ProfileData = {
  name?: string;
  age?: string;
  education?: string;
  course?: string;
  status?: string;
  interests?: string[];
};

type DetailsData = {
  state?: string;
  category?: string;
  income?: string;
  livingArea?: string;
  gender?: string;
  disability?: string;
};

const fallback = "Not provided";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [year, setYear] = useState("");
  const [interest, setInterest] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [income, setIncome] = useState("");
  const [gender, setGender] = useState("");
  const [livingArea, setLivingArea] = useState("");
  const [disability, setDisability] = useState("");

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("aptora_profile");
      const storedDetails = localStorage.getItem("aptora_details");
      const storedUser = localStorage.getItem("aptora_user");

      const profile: ProfileData = storedProfile
        ? JSON.parse(storedProfile)
        : {};

      const details: DetailsData = storedDetails
        ? JSON.parse(storedDetails)
        : {};

      const user = storedUser ? JSON.parse(storedUser) : {};

      const storedName = profile.name || user.name || "";
      const storedEducation = profile.education || "";
      const storedCourse = profile.course || "";

      setName(storedName);
      setAge(profile.age || "");
      setEducation(storedEducation);
      setCourse(storedCourse);
      setStatus(profile.status || "");
      setInterests(profile.interests || []);

      setEmail(user.email || "");
      setLocation(details.state || "");
      setCategory(details.category || "");
      setIncome(details.income || "");
      setGender(details.gender || "");
      setLivingArea(details.livingArea || "");
      setDisability(details.disability || "");

      setInterest(
        profile.interests && profile.interests.length > 0
          ? profile.interests[0]
          : ""
      );

      /*
       * Year is not currently collected by the Get Started flow.
       * Do not invent a year.
       */
      setYear("");

      /*
       * Skills are not currently collected by the Get Started flow.
       * Do not invent skills.
       */
      setSkills([]);
    } catch {
      setName("");
      setAge("");
      setEducation("");
      setCourse("");
      setStatus("");
      setInterests([]);
      setEmail("");
      setLocation("");
      setCategory("");
      setIncome("");
      setGender("");
      setLivingArea("");
      setDisability("");
      setInterest("");
      setYear("");
      setSkills([]);
    }
  }, []);

  const displayName = name.trim() || fallback;

  const displayLocation = location.trim() || fallback;

  const displayEducation = education.trim()
    ? course.trim()
      ? `${education} — ${course}`
      : education
    : course.trim() || fallback;

  const displayInterest = interest.trim() || fallback;

  const completeness = useMemo(() => {
    const values = [
      name,
      age,
      education,
      course,
      status,
      interests.length > 0 ? "yes" : "",
      location,
      category,
      income,
      gender,
      livingArea,
      disability,
    ];

    const completed = values.filter(
      (value) => typeof value === "string" && value.trim().length > 0
    ).length;

    return Math.round((completed / values.length) * 100);
  }, [
    name,
    age,
    education,
    course,
    status,
    interests,
    location,
    category,
    income,
    gender,
    livingArea,
    disability,
  ]);

  function handleSave() {
    try {
      const existingProfile = localStorage.getItem("aptora_profile");
      const existingDetails = localStorage.getItem("aptora_details");

      const profile: ProfileData = existingProfile
        ? JSON.parse(existingProfile)
        : {};

      const details: DetailsData = existingDetails
        ? JSON.parse(existingDetails)
        : {};

      const updatedProfile: ProfileData = {
        ...profile,
        name: name.trim(),
        age: age.trim(),
        education: education.trim(),
        course: course.trim(),
        status: status.trim(),
        interests,
      };

      const updatedDetails: DetailsData = {
        ...details,
        state: location.trim(),
        category: category.trim(),
        income: income.trim(),
        gender: gender.trim(),
        livingArea: livingArea.trim(),
        disability: disability.trim(),
      };

      localStorage.setItem(
        "aptora_profile",
        JSON.stringify(updatedProfile)
      );

      localStorage.setItem(
        "aptora_details",
        JSON.stringify(updatedDetails)
      );

      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch {
      setEditing(false);
    }
  }

  function removeSkill(skill: string) {
    setSkills((current) => current.filter((item) => item !== skill));
  }

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      <div className="mx-auto max-w-[1100px] px-6 py-10 sm:px-8 lg:py-14">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[10px] font-medium text-[#8A8490] transition hover:text-[#5B4B8A]"
        >
          <ArrowLeft size={12} />
          Back to dashboard
        </Link>

        {/* PROFILE HERO */}
        <section className="mt-7 rounded-[30px] border border-[#E4DFE8] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[25px] bg-[#DCD2F2] text-[27px] font-semibold text-[#5B4B8A]">
                {name.trim() ? name.trim().charAt(0).toUpperCase() : "A"}
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#AAA4B1]">
                  Your profile
                </p>

                <h1 className="mt-2 text-[29px] font-semibold tracking-[-0.045em]">
                  {displayName}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[9px] text-[#8A8490]">
                    <MapPin size={11} />
                    {displayLocation}
                  </span>

                  {year && (
                    <span className="flex items-center gap-1.5 text-[9px] text-[#8A8490]">
                      <GraduationCap size={11} />
                      {year}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex h-10 w-fit items-center gap-2 rounded-full border border-[#DDD8E3] bg-white px-5 text-[10px] font-medium text-[#686171] transition hover:border-[#C7BDCF] hover:text-[#5B4B8A]"
              >
                <Pencil size={12} />
                Edit profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="flex h-10 w-fit items-center gap-2 rounded-full bg-[#DCD2F2] px-5 text-[10px] font-semibold text-[#51427D] transition hover:bg-[#CEC1E9]"
              >
                <Save size={12} />
                Save changes
              </button>
            )}
          </div>

          {/* PROFILE COMPLETION */}
          <div className="mt-8 border-t border-[#EEEAEF] pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold">
                  Profile completeness
                </p>

                <p className="mt-1 text-[9px] text-[#AAA4B1]">
                  Complete your profile to improve matching.
                </p>
              </div>

              <span className="text-[12px] font-semibold text-[#5B4B8A]">
                {completeness}%
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#EEEAEF]">
              <div
                className="h-full rounded-full bg-[#8B7BA5] transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </section>

        {/* SAVED MESSAGE */}
        {saved && (
          <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[#DDD6E5] bg-[#F3EFF7] px-5 py-3 text-[10px] font-medium text-[#66577F]">
            <Check size={13} />
            Your profile has been updated.
          </div>
        )}

        {/* FORM GRID */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* PERSONAL INFORMATION */}
          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <UserRound size={15} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  About you
                </p>

                <h2 className="mt-1 text-[17px] font-semibold">
                  Personal information
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                value={name || fallback}
                editing={editing}
                onChange={setName}
              />

              <Field
                label="Age"
                value={age || fallback}
                editing={editing}
                onChange={setAge}
              />

              <Field
                label="Email"
                value={email || fallback}
                editing={editing}
                onChange={setEmail}
              />

              <Field
                label="Location"
                value={location || fallback}
                editing={editing}
                onChange={setLocation}
              />

              <Field
                label="Current status"
                value={status || fallback}
                editing={editing}
                onChange={setStatus}
              />

              <Field
                label="Social category"
                value={category || fallback}
                editing={editing}
                onChange={setCategory}
              />
            </div>
          </div>

          {/* MATCHING */}
          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7]">
              <Sparkles size={15} className="text-[#5B4B8A]" />
            </div>

            <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
              Aptora matching
            </p>

            <h2 className="mt-2 text-[21px] font-semibold tracking-[-0.03em]">
              Your profile is working.
            </h2>

            <p className="mt-3 text-[10px] leading-5 text-[#89838F]">
              We use the information you provide to find opportunities that
              are more relevant to you.
            </p>

            <div className="mt-6 rounded-[18px] bg-[#FAF9FC] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-[#8A8490]">
                  Current profile quality
                </span>

                <span className="text-[14px] font-semibold text-[#5B4B8A]">
                  {completeness}%
                </span>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-[#EAE6EE]">
                <div
                  className="h-full rounded-full bg-[#8B7BA5] transition-all"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <GraduationCap size={15} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Education
                </p>

                <h2 className="mt-1 text-[17px] font-semibold">
                  Academic background
                </h2>
              </div>
            </div>

            <div className="mt-7">
              <Field
                label="Current education"
                value={education || fallback}
                editing={editing}
                onChange={setEducation}
              />

              <div className="mt-5">
                <Field
                  label="Course / field of study"
                  value={course || fallback}
                  editing={editing}
                  onChange={setCourse}
                />
              </div>
            </div>
          </div>

          {/* INTERESTS */}
          <div className="rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <BriefcaseBusiness size={15} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Preferences
                </p>

                <h2 className="mt-1 text-[17px] font-semibold">
                  Career interests
                </h2>
              </div>
            </div>

            <div className="mt-7">
              <Field
                label="Primary interest"
                value={displayInterest}
                editing={editing}
                onChange={(value) => {
                  setInterest(value);
                  setInterests(
                    value.trim()
                      ? value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                      : []
                  );
                }}
              />

              {interests.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#DDD6E5] bg-[#F5F1F8] px-3 py-1.5 text-[9px] text-[#66577F]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ADDITIONAL DETAILS */}
          <div className="lg:col-span-2 rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F1EDF7]">
                <UserRound size={15} className="text-[#5B4B8A]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                  Eligibility information
                </p>

                <h2 className="mt-1 text-[17px] font-semibold">
                  Additional details
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Annual family income"
                value={income || fallback}
                editing={editing}
                onChange={setIncome}
              />

              <Field
                label="Gender"
                value={gender || fallback}
                editing={editing}
                onChange={setGender}
              />

              <Field
                label="Area"
                value={livingArea || fallback}
                editing={editing}
                onChange={setLivingArea}
              />

              <Field
                label="Disability status"
                value={disability || fallback}
                editing={editing}
                onChange={setDisability}
              />

              <Field
                label="Social category"
                value={category || fallback}
                editing={editing}
                onChange={setCategory}
              />
            </div>
          </div>

          {/* SKILLS */}
          {skills.length > 0 && (
            <div className="lg:col-span-2 rounded-[27px] border border-[#E4DFE8] bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#AAA4B1]">
                    What you know
                  </p>

                  <h2 className="mt-1 text-[17px] font-semibold">
                    Skills
                  </h2>
                </div>

                {editing && (
                  <span className="text-[9px] text-[#AAA4B1]">
                    Click a skill to remove it
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    disabled={!editing}
                    onClick={() => removeSkill(skill)}
                    className={`rounded-full border px-4 py-2 text-[9px] font-medium transition ${
                      editing
                        ? "border-[#D8CFDF] bg-[#F4F0F7] text-[#66577F] hover:border-[#BBAFC9]"
                        : "border-[#E5E0E9] bg-[#FAF9FC] text-[#716A79]"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* BOTTOM CTA */}
        <section className="mt-6 rounded-[27px] bg-[#5B4B8A] p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white/60">
                <Sparkles size={13} />

                <span className="text-[9px] font-semibold uppercase tracking-[0.15em]">
                  Next step
                </span>
              </div>

              <h2 className="mt-3 text-[23px] font-semibold tracking-[-0.035em]">
                See what matches you.
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-white/65">
                Explore opportunities selected around your profile.
              </p>
            </div>

            <Link
              href="/opportunities"
              className="group flex h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-[#DCD2F2] px-6 text-[10px] font-semibold text-[#51427D] transition hover:bg-[#CEC1E9]"
            >
              View my matches

              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[9px] font-medium text-[#89838F]">
        {label}
      </label>

      {editing ? (
        <input
          value={value === fallback ? "" : value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="mt-2 h-11 w-full rounded-xl border border-[#DDD8E3] bg-[#FAF9FC] px-4 text-[10px] text-[#403B46] outline-none transition placeholder:text-[#B3ADB8] focus:border-[#8A78AD] focus:ring-4 focus:ring-[#5B4B8A]/[0.06]"
        />
      ) : (
        <div className="mt-2 min-h-11 rounded-xl bg-[#FAF9FC] px-4 py-3 text-[10px] text-[#403B46]">
          {value || fallback}
        </div>
      )}
    </div>
  );
}