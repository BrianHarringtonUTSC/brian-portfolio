"use client";

import type { FC, ReactNode } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  FaEnvelope,
  FaGithub,
  FaOrcid,
  FaLinkedin,
  FaReddit,
  FaGoogleScholar,
  FaBars,
  FaCross,
} from "react-icons/fa6";

interface LayoutProps {
  children: ReactNode;
}

const socialIcons = [
  {
    href: "mailto:brian.harrington@utoronto.ca",
    icon: <FaEnvelope className="text-2xl" />,
    label: "Email",
  },
  {
    href: "https://github.com/BrianHarringtonUTSC",
    icon: <FaGithub className="text-2xl" />,
    label: "Github",
  },
  {
    href: "https://orcid.org/0000-0002-0734-9630",
    icon: <FaOrcid className="text-2xl" />,
    label: "ORCID",
  },
  {
    href: "https://www.linkedin.com/in/brian-harrington-utsc/",
    icon: <FaLinkedin className="text-2xl" />,
    label: "LinkedIn",
  },
  {
    href: "https://www.reddit.com/user/BrianHarrington/",
    icon: <FaReddit className="text-2xl" />,
    label: "Reddit",
  },
  {
    href: "https://scholar.google.com/citations?user=uYCeHkcAAAAJ&hl=en",
    icon: <FaGoogleScholar className="text-2xl" />,
    label: "Google Scholar",
  },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  const [navOpen, setNavOpen] = useState(false);

  const toggleNav = () => setNavOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Site Title / Logo */}
          <div className="text-lg font-bold">
            <Link href="/" className="hover:underline">
              Brian Harrington
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden">
            <button onClick={toggleNav} className="text-2xl focus:outline-none">
              {navOpen ? <FaCross /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/publications" className="hover:underline">
                Publications
              </Link>
            </li>
            <li>
              <Link href="/reading-group" className="hover:underline">
                Undergraduate Research
              </Link>
            </li>
            <li>
              <Link href="/students" className="hover:underline">
                Students
              </Link>
            </li>
            <li>
              <Link href="/videos" className="hover:underline">
                Videos
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {navOpen && (
          <div className="md:hidden bg-background border-t">
            <ul className="flex flex-col space-y-2 px-4 py-2">
              <li>
                <Link
                  href="/"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="/reading-group"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Undergraduate Research
                </Link>
              </li>
              <li>
                <Link
                  href="/students"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Videos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block hover:underline"
                  onClick={() => setNavOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <div className="flex space-x-2 pt-2 justify-center pb-4">
            {socialIcons.map(({ href, icon, label }, index) => (
              <Link
                key={`social-link-${index}`}
                href={encodeURI(href)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <div className="text-gray-400 hover:text-black dark:hover:text-amber-100/80 transition duration-300 cursor-pointer">
                  {icon}
                </div>
              </Link>
            ))}
          </div>
          <p className="text-neutral-600 dark:text-neutral-300">
            © {new Date().getFullYear()} Brian Harrington. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
