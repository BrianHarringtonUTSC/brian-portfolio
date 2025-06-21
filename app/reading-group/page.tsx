"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Layout from "@/components/layout";

interface Presenter {
  name: string;
  link: string;
}

interface Session {
  date: string;
  paperTitle: string;
  paperLink: string;
  slidesLink?: string;
  presenter: Presenter[];
}

interface Schedule {
  [year: string]: Session[];
}

const LoadingSpinner = () => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    <p className="mt-4 text-lg text-muted-foreground">Loading schedule...</p>
  </div>
);

const ErrorMessage = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="text-center">
    <p className="text-lg text-red-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Try Again
    </button>
  </div>
);

export default function ReadingGroupPage() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [activeYear, setActiveYear] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const years = useMemo(() => Object.keys(schedule), [schedule]);
  const activeSessions = useMemo(
    () => schedule[activeYear] || [],
    [schedule, activeYear]
  );

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/prg-sessions");
      if (!response.ok) {
        throw new Error("Failed to fetch schedule");
      }

      const data: Schedule = await response.json();
      setSchedule(data);

      const availableYears = Object.keys(data);
      if (availableYears.length > 0 && !activeYear) {
        setActiveYear(availableYears[0]);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError("Failed to load schedule. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [activeYear]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  if (loading) {
    return (
      <Layout>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <LoadingSpinner />
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="max-w-6xl mx-auto px-6 py-8">
          <ErrorMessage error={error} onRetry={fetchSchedule} />
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          CMS-URG Paper Reading Group
        </h1>

        <div className="text-lg text-muted-foreground text-center mb-8 space-y-4">
          <p>
            Interested in getting involved in research? Want to sharpen your
            academic skills? Just wondering what it is your professors do all
            day? Then come join the UTSC Computer and Mathematical Sciences
            Undergraduate Research Group.
          </p>
          <p>
            The CMS Undergraduate Research Group was founded to give students in
            our department an opportunity to explore and participate in
            research. Any level of experience or commitment is welcome. We have
            everything from reading and discussion groups, to full-fledged
            research projects. We have published dozens of papers undergraduate
            co-authors, established an annual symposium, and had students
            present at local, national and international research conferences.
          </p>
        </div>

        <div className="flex justify-center border-b border-gray-300 mb-6">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeYear === year
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Plan for {activeYear}
          </h2>
          <table className="w-full table-auto border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Paper</th>
                <th className="px-3 py-2">Slides</th>
                <th className="px-3 py-2">Presenter</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((session, index) => (
                <tr
                  key={`${session.date}-${index}`}
                  className="border-b border-gray-200"
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    {session.date}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={session.paperLink}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {session.paperTitle}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {session.slidesLink ? (
                      <Link
                        href={session.slidesLink}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        slides
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {session.presenter.map((presenter, idx) => (
                      <span key={`${presenter.name}-${idx}`}>
                        <Link
                          href={presenter.link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {presenter.name}
                        </Link>
                        {idx < session.presenter.length - 1 && " | "}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
