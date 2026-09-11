import Link from "next/link";

const footerLinks = {
  Explore: [
    { label: "Opportunities", href: "/opportunities" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "About Aptora", href: "/#about" },
  ],
  Account: [
    { label: "Log in", href: "/login" },
    { label: "Sign up", href: "/signup" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#E7E3EC] bg-[#FAF9FC]">
      <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-16">

        {/* TOP */}

        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* BRAND */}

          <div className="max-w-sm">
            <Link
              href="/"
              className="flex w-fit items-center gap-2.5"
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

            <p className="mt-5 max-w-[320px] text-sm leading-6 text-[#89838F]">
              Discover scholarships, government jobs, welfare schemes
              and opportunities that actually fit you.
            </p>
          </div>


          {/* EXPLORE */}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
              Explore
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.Explore.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-xs text-[#77727F] transition hover:text-[#5B4B8A]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>


          {/* ACCOUNT */}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AAA4B1]">
              Account
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.Account.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-xs text-[#77727F] transition hover:text-[#5B4B8A]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>


        {/* BOTTOM */}

        <div className="mt-14 flex flex-col gap-4 border-t border-[#E7E3EC] pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[10px] text-[#AAA4B1]">
            © {new Date().getFullYear()} Aptora. All rights reserved.
          </p>

          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="text-[10px] text-[#AAA4B1] transition hover:text-[#5B4B8A]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[10px] text-[#AAA4B1] transition hover:text-[#5B4B8A]"
            >
              Terms
            </Link>

          </div>

        </div>

      </div>
    </footer>
  );
}