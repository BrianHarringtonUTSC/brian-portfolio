import type { FC, ReactNode } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaGithub,
  FaOrcid,
  FaLinkedin,
  FaReddit,
} from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

const icons = [
  {
    href: "mailto:brian.harrington@utoronto.ca",
    icon: <FaEnvelope style={{ fontSize: "2rem" }} />,
    label: "Email",
  },
  {
    href: "https://github.com/BrianHarringtonUTSC",
    icon: <FaGithub style={{ fontSize: "2rem" }} />,
    label: "Github",
  },
  {
    href: "https://orcid.org/0000-0002-0734-9630",
    icon: <FaOrcid style={{ fontSize: "2rem" }} />,
    label: "ORCID",
  },
  {
    href: "https://www.linkedin.com/in/brian-harrington-utsc/",
    icon: <FaLinkedin style={{ fontSize: "2rem" }} />,
    label: "LinkedIn",
  },
  {
    href: "https://www.reddit.com/user/BrianHarrington/",
    icon: <FaReddit style={{ fontSize: "2rem" }} />,
    label: "Reddit",
  },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/publications" className="hover:underline">
                Publications
              </Link>
            </li>
            <li>
              <Link href="/reading-group" className="hover:underline">
                Reading Group
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
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <div className="flex space-x-2 pt-2 justify-center pb-4">
            {icons.map(({ href, icon, label }, index) => (
              <Link
                key={`social-link-${index}`}
                href={encodeURI(href)}
                target="_blank"
                rel="noopener"
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
