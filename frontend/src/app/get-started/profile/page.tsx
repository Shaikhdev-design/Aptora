"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const educationOptions = [
  "School",
  "Undergraduate",
  "Postgraduate",
  "Diploma",
  "PhD",
  "Other",
];

const statusOptions = [
  "Student",
  "Looking for a job",
  "Working",
  "Entrepreneur",
  "Preparing for exams",
  "Other",
];

const interestOptions = [
  "Scholarships",
  "Government Jobs",
  "Private Jobs",
  "Internships",
  "Government Schemes",
  "Fellowships",
  "Skill Development",
  "Entrepreneurship",
];

type ProfileData = {
  name?: string;
  age?: string;
  education?: string;
  course?: string;
  status?: string;
  interests?: string[];
};

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  /*
   * Restore anything the user already entered if they
   * come back to this step.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aptora_profile");

      if (!stored) return;

      const profile: ProfileData = JSON.parse(stored);

      setName(profile.name || "");
      setAge(profile.age || "");
      setEducation(profile.education || "");
      setCourse(profile.course || "");
      setStatus(profile.status || "");
      setSelectedInterests(profile.interests || []);
    } catch {
      localStorage.removeItem("aptora_profile");
    }
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleContinue = () => {
    /*
     * Save exactly what the user entered.
     *
     * Blank fields remain blank.
     * Nothing is replaced with a default name,
     * education, course, or interest.
     */
    const profile: ProfileData = {
      name: name.trim(),
      age: age.trim(),
      education,
      course: course.trim(),
      status,
      interests: selectedInterests,
    };

    localStorage.setItem("aptora_profile", JSON.stringify(profile));

    router.push("/get-started/details");
  };

  return (
    <main className="min-h-screen bg-[#FAF9FC] text-[#29252F]">
      {/* PROGRESS */}
      <div className="mx-auto max-w-[760px] px-6 pt-10 sm:px-8">
        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-[#5B4B8A]">Step 2 of 3</span>
          <span className="text-[#AAA4B1]">66% complete</span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E9E5EE]">
          <div className="h-full w-2/3 rounded-full bg-[#B9A9D8]" />
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-[760px] px-6 pb-20 pt-12 sm:px-8 sm:pt-16">
        {/* INTRO */}
        <div className="max-w-[620px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F82A8]">
            Tell us about you
          </p>

          <h1 className="mt-4 text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] text-[#29252F] sm:text-[58px]">
            Build your
            <br />
            opportunity profile.
          </h1>

          <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-[#77717F]">
            A few details help Aptora understand where you are right now and
            surface opportunities that actually make sense for you.
          </p>
        </div>

        {/* FORM */}
        <div className="mt-12 space-y-10">
          {/* NAME + AGE */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-2.5 block text-[12px] font-medium text-[#4D4854]"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="h-13 w-full rounded-2xl border border-[#DDD8E3] bg-white px-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#B3ADB8] focus:border-[#A996C7] focus:ring-4 focus:ring-[#B9A9D8]/[0.12]"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="mb-2.5 block text-[12px] font-medium text-[#4D4854]"
              >
                Age
              </label>

              <input
                id="age"
                type="number"
                min="13"
                max="100"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="Your age"
                className="h-13 w-full rounded-2xl border border-[#DDD8E3] bg-white px-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#B3ADB8] focus:border-[#A996C7] focus:ring-4 focus:ring-[#B9A9D8]/[0.12]"
              />
            </div>
          </div>

          {/* EDUCATION */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              What is your current education level?
            </label>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {educationOptions.map((option) => {
                const selected = education === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setEducation(option)}
                    className={`rounded-2xl border px-4 py-4 text-left text-[13px] font-medium transition ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176] shadow-sm"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9] hover:bg-[#FCFBFD]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>

                      {selected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B9A9D8] text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COURSE */}
          <div>
            <label
              htmlFor="course"
              className="mb-2.5 block text-[12px] font-medium text-[#4D4854]"
            >
              Course / field of study
            </label>

            <input
              id="course"
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="e.g. Computer Science, Commerce, Mechanical Engineering"
              className="h-13 w-full rounded-2xl border border-[#DDD8E3] bg-white px-4 text-sm text-[#29252F] outline-none transition placeholder:text-[#B3ADB8] focus:border-[#A996C7] focus:ring-4 focus:ring-[#B9A9D8]/[0.12]"
            />

            <p className="mt-2 text-[11px] text-[#AAA4B1]">
              This helps us understand which opportunities are relevant to
              your background.
            </p>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-3 block text-[12px] font-medium text-[#4D4854]">
              What best describes you right now?
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {statusOptions.map((option) => {
                const selected = status === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setStatus(option)}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-[13px] font-medium transition ${
                      selected
                        ? "border-[#B9A9D8] bg-[#F1EDF8] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#6F6975] hover:border-[#C8BCD9]"
                    }`}
                  >
                    <span>{option}</span>

                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B9A9D8] text-white">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTERESTS */}
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#4D4854]">
                  What are you interested in?
                </label>

                <p className="mt-1.5 text-[11px] text-[#AAA4B1]">
                  Select as many as you want.
                </p>
              </div>

              <span className="shrink-0 text-[11px] font-medium text-[#AAA4B1]">
                {selectedInterests.length} selected
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {interestOptions.map((interest) => {
                const selected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full border px-4 py-2.5 text-[12px] font-medium transition ${
                      selected
                        ? "border-[#B9A9D8] bg-[#DCD2F2] text-[#514176]"
                        : "border-[#DDD8E3] bg-white text-[#746E7B] hover:border-[#C8BCD9] hover:text-[#5B4B8A]"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-14 flex flex-col-reverse gap-3 border-t border-[#E7E3EC] pt-7 sm:flex-row sm:items-center sm:justify-between">
          {/* BACK */}
          <Link
            href="/get-started"
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#D9D0E8] bg-white px-6 text-[13px] font-medium text-[#655C70] transition hover:border-[#C5B8D8] hover:bg-[#F8F5FB]"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          {/* CONTINUE */}
          <button
            type="button"
            onClick={handleContinue}
            className="group flex h-12 items-center justify-center gap-3 rounded-full bg-[#DCD2F2] px-7 text-[13px] font-semibold text-[#51427D] shadow-sm transition hover:bg-[#CEC1E9]"
          >
            Continue

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>

        {/* PRIVACY NOTE */}
        <p className="mt-6 text-center text-[10px] leading-5 text-[#AAA4B1]">
          Your information is used only to personalise your Aptora experience.
        </p>
      </section>
    </main>
  );
}