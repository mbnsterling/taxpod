import Link from "next/link";
import { AppLogo } from "./app-logo";

const footerLinks = {
  Solutions: [
    { label: "Tax Calculator", href: "/features#calculator" },
    { label: "Filing Wizard", href: "/features#wizard" },
    { label: "Reminders", href: "/features#reminders" },
    { label: "PDF Reports", href: "/features#reports" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-gray-200 pt-12 pb-8">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <AppLogo />
            <p className="max-w-xs text-sm leading-relaxed text-gray-600">
              Nigeria&apos;s simplest tax filing platform. Built for employees,
              founders, and accountants. Fully compliant with the Nigeria Tax
              Act 2025.
            </p>
            {/* Social links */}
            <div className="mt-1 flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TaxPod on X (Twitter)"
                className="hover:border-primary hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TaxPod on LinkedIn"
                className="hover:border-primary hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="mb-3 text-xs font-semibold tracking-[0.08em] text-gray-900 uppercase">
                {title}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-primary block text-sm text-gray-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} TaxPod Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-gray-600"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-gray-600"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
