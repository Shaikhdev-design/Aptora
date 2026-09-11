"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  MapPin,
  Sparkles,
  Target,
  UserRound,
  BriefcaseBusiness,
  Landmark,
} from "lucide-react";
import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "About you",
    short: "Basics",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Education",
    short: "Study",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Interests",
    short: "Skills",
    icon: Target,
  },
  {
    number: "04",
    title: "Preferences",
    short: "Goals",
    icon: BriefcaseBusiness,
  },
];

const opportunityTypes = [
  {
    id: "scholarships",
    title: "Scholarships",
    description: "Financial support for education",
    icon: GraduationCap,
  },
  {
    id: "jobs",
    title: "Government jobs",
    description: "Public sector career opportunities",
    icon: BriefcaseBusiness,
  },
  {
    id: "schemes",
    title: "Welfare schemes",
    description: "Government benefits and support",
    icon: Landmark,
  },
];

const interestOptions = [
  "Technology",
  "Business",
  "Finance",
  "Healthcare",
  "Education",
  "Engineering",
  "Design",
  "Government",
  "Research",
  "Arts & Media",
  "Science",
  "Law",
];

const qualificationOptions = [
  "Class 10",
  "Class 12",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    age: "",
    qualification: "",
    fieldOfStudy: "",
    institution: "",
    graduationYear: "",
    interests: [] as string[],
    opportunityTypes: [] as string[],
    workPreference: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((item) => item !== interest)
        : [...previous.interests, interest],
    }));
  };

  const toggleOpportunityType = (type: string) => {
    setFormData((previous) => ({
      ...previous,
      opportunityTypes: previous.opportunityTypes.includes(type)
        ? previous.opportunityTypes.filter((item) => item !== type)
        : [...previous.opportunityTypes, type],
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#171816]">
      {/* HEADER */}
      <header className="border-b border-black/[0.06] bg-[#f8f7f3]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#171816] text-white">
              <Sparkles size={17} />
            </div>

            <span className="text-[21px] font-semibold tracking-[-0.04em]">
              aptora
            </span>
          </a>

          <div className="flex items-center gap-3 text-xs text-[#85867f]">
            <span className="hidden sm:inline">Profile setup</span>

            <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-[#62645d]">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
        </div>
      </header>

      {/* PROGRESS */}
      <div className="h-1 bg-[#e9e9e3]">
        <div
          className="h-full bg-[#7f9562] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-77px)] max-w-7xl flex-col px-6 py-8 lg:px-10 lg:py-12">
        {/* STEP NAVIGATION */}
        <div className="mb-10 hidden lg:block">
          <div className="flex max-w-3xl items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const active = index === currentStep;
              const completed = index < currentStep;

              return (
                <div key={step.number} className="flex flex-1 items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        active
                          ? "bg-[#171816] text-white"
                          : completed
                            ? "bg-[#dfe7d4] text-[#61734c]"
                            : "bg-white text-[#9a9b95]"
                      }`}
                    >
                      {completed ? (
                        <Check size={15} strokeWidth={2.5} />
                      ) : (
                        <Icon size={16} strokeWidth={1.8} />
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          active ? "text-[#171816]" : "text-[#7d7e77]"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#a0a19b]">
                        {step.short}
                      </p>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="mx-5 h-px flex-1 bg-black/[0.08]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE STEP */}
        <div className="mb-7 lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#718454]">
                Step {currentStep + 1}
              </p>

              <p className="mt-1 text-sm font-semibold">
                {steps[currentStep].title}
              </p>
            </div>

            <div className="flex gap-1.5">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`h-1.5 rounded-full transition-all ${
                    index <= currentStep
                      ? "w-7 bg-[#7f9562]"
                      : "w-3 bg-[#dedfd9]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 items-start justify-center">
          <div className="w-full max-w-3xl">
            {currentStep === 0 && (
              <StepAboutYou
                formData={formData}
                updateField={updateField}
              />
            )}

            {currentStep === 1 && (
              <StepEducation
                formData={formData}
                updateField={updateField}
              />
            )}

            {currentStep === 2 && (
              <StepInterests
                interests={formData.interests}
                toggleInterest={toggleInterest}
              />
            )}

            {currentStep === 3 && (
              <StepPreferences
                formData={formData}
                toggleOpportunityType={toggleOpportunityType}
                updateField={updateField}
              />
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mx-auto mt-10 flex w-full max-w-3xl items-center justify-between border-t border-black/[0.07] pt-6">
          <button
            type="button"
            onClick={previousStep}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition ${
              currentStep === 0
                ? "cursor-not-allowed text-[#b4b5af]"
                : "text-[#656760] hover:bg-white hover:text-[#171816]"
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-xs text-[#92938d]">
            {currentStep === steps.length - 1
              ? "Almost there"
              : "You can update this later"}
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="group inline-flex items-center gap-2 rounded-full bg-[#171816] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(23,24,22,0.12)] transition hover:-translate-y-0.5 hover:bg-[#292a27]"
          >
            {currentStep === steps.length - 1
              ? "Complete profile"
              : "Continue"}

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </main>
  );
}

function StepAboutYou({
  formData,
  updateField,
}: {
  formData: {
    fullName: string;
    location: string;
    age: string;
  };
  updateField: (field: string, value: string) => void;
}) {
  return (
    <section>
      <div className="mb-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9eee2] text-[#718454]">
          <UserRound size={22} strokeWidth={1.8} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718454]">
          Let&apos;s start simple
        </p>

        <h1 className="mt-3 text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[50px]">
          Tell us a little
          <br />
          about yourself.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#777871]">
          This information helps Aptora understand who you are and which
          opportunities could be relevant to you.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(value) => updateField("fullName", value)}
          icon={<UserRound size={17} />}
        />

        <Field
          label="Age"
          placeholder="Your age"
          type="number"
          value={formData.age}
          onChange={(value) => updateField("age", value)}
        />

        <div className="sm:col-span-2">
          <Field
            label="Current location"
            placeholder="City, state"
            value={formData.location}
            onChange={(value) => updateField("location", value)}
            icon={<MapPin size={17} />}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#dfe5d6] bg-[#f1f4ec] p-4">
        <div className="flex items-start gap-3">
          <Sparkles
            size={17}
            className="mt-0.5 shrink-0 text-[#718454]"
          />

          <p className="text-xs leading-5 text-[#72766b]">
            Your location can help Aptora identify opportunities where
            geographic eligibility matters.
          </p>
        </div>
      </div>
    </section>
  );
}

function StepEducation({
  formData,
  updateField,
}: {
  formData: {
    qualification: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;
  };
  updateField: (field: string, value: string) => void;
}) {
  return (
    <section>
      <div className="mb-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9eee2] text-[#718454]">
          <GraduationCap size={23} strokeWidth={1.8} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718454]">
          Your education
        </p>

        <h1 className="mt-3 text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[50px]">
          What have you
          <br />
          studied?
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#777871]">
          Education is one of the strongest signals Aptora can use when
          matching you with scholarships and career opportunities.
        </p>
      </div>

      <div className="space-y-5">
        <SelectField
          label="Highest qualification"
          value={formData.qualification}
          placeholder="Select your qualification"
          options={qualificationOptions}
          onChange={(value) => updateField("qualification", value)}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Field of study"
            placeholder="e.g. Computer Science"
            value={formData.fieldOfStudy}
            onChange={(value) => updateField("fieldOfStudy", value)}
          />

          <Field
            label="Graduation year"
            placeholder="e.g. 2027"
            type="number"
            value={formData.graduationYear}
            onChange={(value) => updateField("graduationYear", value)}
          />
        </div>

        <Field
          label="Institution"
          placeholder="College, university or school"
          value={formData.institution}
          onChange={(value) => updateField("institution", value)}
        />
      </div>
    </section>
  );
}

function StepInterests({
  interests,
  toggleInterest,
}: {
  interests: string[];
  toggleInterest: (interest: string) => void;
}) {
  return (
    <section>
      <div className="mb-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9eee2] text-[#718454]">
          <Target size={22} strokeWidth={1.8} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718454]">
          Your interests
        </p>

        <h1 className="mt-3 text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[50px]">
          What are you
          <br />
          interested in?
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#777871]">
          Pick everything that sounds relevant. These preferences will help us
          make your future opportunity feed more focused.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {interestOptions.map((interest) => {
          const selected = interests.includes(interest);

          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`group relative min-h-[82px] rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-[#9aaa84] bg-[#edf2e7] shadow-[0_8px_20px_rgba(80,90,60,0.06)]"
                  : "border-black/[0.08] bg-white hover:-translate-y-0.5 hover:border-black/[0.14]"
              }`}
            >
              <span
                className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[#718454] bg-[#718454] text-white"
                    : "border-black/[0.12] bg-[#fafaf8]"
                }`}
              >
                {selected && <Check size={11} strokeWidth={3} />}
              </span>

              <span className="pr-5 text-sm font-semibold">{interest}</span>

              {selected && (
                <span className="mt-2 block text-[10px] font-medium text-[#718454]">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-[#92938d]">
        {interests.length === 0
          ? "Choose at least one area you're interested in."
          : `${interests.length} ${interests.length === 1 ? "interest" : "interests"} selected`}
      </p>
    </section>
  );
}

function StepPreferences({
  formData,
  toggleOpportunityType,
  updateField,
}: {
  formData: {
    opportunityTypes: string[];
    workPreference: string;
  };
  toggleOpportunityType: (type: string) => void;
  updateField: (field: string, value: string) => void;
}) {
  return (
    <section>
      <div className="mb-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9eee2] text-[#718454]">
          <BriefcaseBusiness size={22} strokeWidth={1.8} />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#718454]">
          What brings you here?
        </p>

        <h1 className="mt-3 text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[50px]">
          Tell Aptora what
          <br />
          you&apos;re looking for.
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#777871]">
          Choose the opportunity types you care about. You can change these
          preferences whenever you want.
        </p>
      </div>

      <div className="space-y-3">
        {opportunityTypes.map((item) => {
          const Icon = item.icon;
          const selected = formData.opportunityTypes.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleOpportunityType(item.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                selected
                  ? "border-[#9aaa84] bg-[#edf2e7]"
                  : "border-black/[0.08] bg-white hover:border-black/[0.14]"
              }`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  selected
                    ? "bg-white text-[#718454]"
                    : "bg-[#f0f1ec] text-[#777a72]"
                }`}
              >
                <Icon size={20} strokeWidth={1.8} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-[#85867f]">
                  {item.description}
                </p>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-[#718454] bg-[#718454] text-white"
                    : "border-black/[0.13] bg-white"
                }`}
              >
                {selected && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <label className="mb-2 block text-xs font-semibold text-[#454640]">
          Preferred work style
        </label>

        <div className="relative">
          <select
            value={formData.workPreference}
            onChange={(event) =>
              updateField("workPreference", event.target.value)
            }
            className="h-13 w-full appearance-none rounded-2xl border border-black/[0.09] bg-white px-4 pr-11 text-sm text-[#171816] outline-none transition focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
          >
            <option value="">Select a preference</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="any">Open to anything</option>
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#999a94]"
          />
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-[#dfe5d6] bg-[#f1f4ec] p-4">
        <div className="flex items-start gap-3">
          <Sparkles
            size={17}
            className="mt-0.5 shrink-0 text-[#718454]"
          />

          <div>
            <p className="text-xs font-semibold text-[#555a4e]">
              Your profile is almost ready
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#7d8077]">
              Once complete, Aptora will use this information to personalize
              the opportunities shown to you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#454640]">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#999a94]">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`h-13 w-full rounded-2xl border border-black/[0.09] bg-white text-sm text-[#171816] outline-none transition placeholder:text-[#aaaBA5] focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10 ${
            icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-[#454640]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-13 w-full appearance-none rounded-2xl border border-black/[0.09] bg-white px-4 pr-11 text-sm text-[#171816] outline-none transition focus:border-[#849866] focus:ring-4 focus:ring-[#849866]/10"
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#999a94]"
        />
      </div>
    </div>
  );
}
