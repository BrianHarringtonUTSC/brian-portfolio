"use client";

import React, { useState, useEffect } from "react";
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

export default function ReadingGroupPage() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [years, setYears] = useState<string[]>([]);
  const [activeYear, setActiveYear] = useState<string>("");

  useEffect(() => {
    fetch("/data/prg-schedule.json")
      .then((response) => response.json())
      .then((data: Schedule) => {
        setSchedule(data);
        const availableYears = Object.keys(data);
        setYears(availableYears);
        setActiveYear(availableYears[0]); // Default to the first year
      })
      .catch((error) => console.error("Error fetching schedule:", error));
  }, []);

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          CMS-URG Paper Reading Group
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Interested in getting involved in research? Want to sharpen your
          academic skills? Just wondering what it is your professors do all day?
          Then come join the UTSC Computer and Mathematical Sciences
          Undergraduate Research Group.
        </p>

        <p className="text-lg text-muted-foreground text-center mb-8">
          The CMS Undergraduate Research Group was founded to give students in
          our department an opportunity to explore and participate in research.
          Any level of experience or commitment is welcome. We have everything
          from reading and discussion groups, to full-fledged research projects.
          We have published dozens of papers undergraduate co-authors,
          established an annual symposium, and had students present at local,
          national and international research conferences.
        </p>

        {/* Year Selector Tabs */}
        <div className="flex justify-center border-b border-gray-300 mb-6">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 text-sm font-medium ${
                activeYear === year
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Schedule Table */}
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
              {schedule[activeYear]?.map((session, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="whitespace-nowrap px-3 py-2">
                    {session.date}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={session.paperLink}
                      className="text-blue-600 hover:underline"
                      target="_blank"
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
                      >
                        slides
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {session.presenter.map((presenter, idx) => (
                      <span key={idx}>
                        <Link
                          href={presenter.link}
                          className="text-blue-600 hover:underline"
                          target="_blank"
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
