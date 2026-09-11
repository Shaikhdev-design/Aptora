
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  UserRound,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearStoredToken,
  getStoredToken,
} from "@/hooks/useAuth";

type StoredProfile = {
  name?: string;
};

type StoredUser = {
  name?: string;
  email?: string;
};

function getTokenEmail(token: string | null): string {
  if (!token) return "";

  try {
    const payload = token.split(".")[1];

    if (!payload) return "";

    const decoded = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/"),
      ),
    ) as { email?: string };

    return decoded.email || "";
  } catch {
    return "";
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAppRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/opportunities") ||
    pathname === "/saved" ||
    pathname === "/applications" ||
    pathname === "/notifications" ||
    pathname === "/profile" ||
    pathname === "/settings";

  useEffect(() => {
    const loadUser = () => {
      const token = getStoredToken();

      const storedProfile =
        localStorage.getItem("aptora_profile");

      const storedUser =
        localStorage.getItem("aptora_user");

      let name = "";
      let email = "";

      if (storedProfile) {
        try {
          const profile: StoredProfile =
            JSON.parse(storedProfile);

          if (profile?.name?.trim()) {
            name = profile.name.trim();
          }
        } catch {
          // Ignore invalid profile data.
        }
      }

      if (storedUser) {
        try {
          const user: StoredUser =
            JSON.parse(storedUser);

          if (!name && user?.name?.trim()) {
            name = user.name.trim();
          }

          if (user?.email?.trim()) {
            email = user.email.trim();
          }
        } catch {
          // Ignore invalid user data.
        }
      }

      if (!email) {
        email = getTokenEmail(token);
      }

      const loggedIn = Boolean(token);

      setIsLoggedIn(loggedIn);

      if (name) {
        setUserName(name);
        setUserInitial(
          name.charAt(0).toUpperCase(),
        );
      } else if (email) {
        setUserName(email);
        setUserInitial(
          email.charAt(0).toUpperCase(),
        );
      } else if (loggedIn) {
        setUserName("Your account");
        setUserInitial("A");
      } else {
        setUserName("");
        setUserInitial("");
      }
    };

    loadUser();

    window.addEventListener(
      "storage",
      loadUser,
    );

    window.addEventListener(
      "aptora-auth-changed",
      loadUser,
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadUser,
      );

      window.removeEventListener(
        "aptora-auth-changed",
        loadUser,
      );
    };
  }, [pathname]);

  const handleLogout = () => {
    clearStoredToken();

    localStorage.removeItem("aptora_user");
    localStorage.removeItem("aptora_profile");
    localStorage.removeItem("aptora_details");
    localStorage.removeItem("aptora_token");

    setUserName("");
    setUserInitial("");
    setIsLoggedIn(false);
    setProfileOpen(false);

    window.dispatchEvent(
      new Event("aptora-auth-changed"),
    );

    router.push("/login");
  };

  if (!isAppRoute) {
    return (
      <header className="sticky top-0 z-50 border-b border-[#E8E2EF] bg-[#FCFBFE]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
              <span className="text-[15px] font-semibold">
                A
              </span>
            </div>

            <span className="text-[19px] font-semibold tracking-[-0.04em] text-[#29252F]">
              Aptora
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/opportunities"
              className="text-xs font-medium text-[#77727F] transition hover:text-[#5B4B8A]"
            >
              Opportunities
            </Link>

            <Link
              href="/#how-it-works"
              className="text-xs font-medium text-[#77727F] transition hover:text-[#5B4B8A]"
            >
              How it works
            </Link>

            <Link
              href="/#about"
              className="text-xs font-medium text-[#77727F] transition hover:text-[#5B4B8A]"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-[#C9BDE7] px-5 py-2.5 text-xs font-medium text-[#20201D] transition hover:bg-[#BDAFDF]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2.5 text-xs font-medium text-[#5F5965] transition hover:bg-[#F3F0F7] hover:text-[#5B4B8A] sm:block"
                >
                  Log in
                </Link>

                <Link
                  href="/signup"
                  className="hidden rounded-full border border-[#E4DFE9] bg-white px-4 py-2.5 text-xs font-medium text-[#403B47] transition hover:bg-[#F8F6FB] sm:block"
                >
                  Sign up
                </Link>

                <Link
                  href="/get-started"
                  className="rounded-full bg-[#C9BDE7] px-5 py-2.5 text-xs font-medium text-[#20201D] transition hover:bg-[#BDAFDF]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E2EF] bg-[#FCFBFE]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          href="/"
          className="flex items-center gap-2.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#5B4B8A] text-white">
            <span className="text-[15px] font-semibold">
              A
            </span>
          </div>

          <span className="text-[19px] font-semibold tracking-[-0.04em] text-[#29252F]">
            Aptora
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/dashboard"
            className={`text-xs font-medium transition ${
              pathname === "/dashboard"
                ? "text-[#5B4B8A]"
                : "text-[#77727F] hover:text-[#5B4B8A]"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/opportunities"
            className={`text-xs font-medium transition ${
              pathname.startsWith("/opportunities")
                ? "text-[#5B4B8A]"
                : "text-[#77727F] hover:text-[#5B4B8A]"
            }`}
          >
            Opportunities
          </Link>

          <Link
            href="/saved"
            className={`text-xs font-medium transition ${
              pathname === "/saved"
                ? "text-[#5B4B8A]"
                : "text-[#77727F] hover:text-[#5B4B8A]"
            }`}
          >
            Saved
          </Link>

          <Link
            href="/applications"
            className={`text-xs font-medium transition ${
              pathname === "/applications"
                ? "text-[#5B4B8A]"
                : "text-[#77727F] hover:text-[#5B4B8A]"
            }`}
          >
            Applications
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2.5 text-xs font-medium text-[#5F5965] transition hover:bg-[#F3F0F7] hover:text-[#5B4B8A] sm:block"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-[#C9BDE7] px-5 py-2.5 text-xs font-medium text-[#20201D] transition hover:bg-[#BDAFDF]"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/notifications"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#77727F] transition hover:bg-[#F3F0F7] hover:text-[#5B4B8A]"
                aria-label="Notifications"
              >
                <Bell
                  size={17}
                  strokeWidth={1.7}
                />
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(
                      (open) => !open,
                    )
                  }
                  className="flex items-center gap-2 rounded-full border border-[#E5E0EA] bg-white py-1.5 pl-1.5 pr-2.5 transition hover:border-[#D8D0E2] hover:bg-[#FAF8FC]"
                  aria-expanded={profileOpen}
                  aria-label="Open profile menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9BDE7] text-[12px] font-semibold text-[#302746]">
                    {userInitial}
                  </span>

                  <ChevronDown
                    size={13}
                    className={`text-[#89838F] transition-transform ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-[230px] overflow-hidden rounded-2xl border border-[#E5E0EA] bg-white shadow-[0_18px_50px_rgba(50,40,70,0.12)]">
                    <div className="border-b border-[#EEEAF1] px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9BDE7] text-[12px] font-semibold text-[#302746]">
                          {userInitial}
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#302C36]">
                            {userName ||
                              "Your account"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#96909C]">
                            Aptora account
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      <Link
                        href="/profile"
                        onClick={() =>
                          setProfileOpen(
                            false,
                          )
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#5F5965] transition hover:bg-[#F7F4FA] hover:text-[#5B4B8A]"
                      >
                        <UserRound
                          size={15}
                          strokeWidth={1.7}
                        />
                        Profile
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() =>
                          setProfileOpen(
                            false,
                          )
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#5F5965] transition hover:bg-[#F7F4FA] hover:text-[#5B4B8A]"
                      >
                        <Settings
                          size={15}
                          strokeWidth={1.7}
                        />
                        Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#77727F] transition hover:bg-[#F7F4FA] hover:text-[#5B4B8A]"
                      >
                        <LogOut
                          size={15}
                          strokeWidth={1.7}
                        />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
