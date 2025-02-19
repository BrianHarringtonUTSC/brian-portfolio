import type { FC, ReactNode } from "react";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
}

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
          © {new Date().getFullYear()} Dr. Brian Harrington. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
