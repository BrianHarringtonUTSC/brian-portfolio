"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout";
import { FaFilePdf, FaLink } from "react-icons/fa";

interface Publication {
  category: string;
  thumb: string;
  title: string;
  authors: string;
  link: string;
  poster: string;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    fetch("/data/papers.json")
      .then((response) => response.json())
      .then((data) => setPublications(data))
      .catch((error) => console.error("Error fetching publications:", error));
  }, []);

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          Publications
        </h1>

        <p className="text-lg text-muted-foreground text-center mb-8">
          A collection of research papers and publications authored by Professor
          Brian Harrington.
        </p>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.length > 0 ? (
            publications.map((publication, index) => (
              <div
                key={index}
                className={`bg-secondary p-6 rounded-lg shadow ${publication.category
                  .split(" ")
                  .join(" ")}`}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-40 mb-4 overflow-hidden">
                  <Link
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Image
                      src={publication.thumb}
                      alt={publication.title}
                      fill
                      className="object-cover rounded-lg filter brightness-90 transition-all duration-300 hover:brightness-100"
                    />
                    <div className="absolute rounded-lg inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </Link>
                </div>

                {/* Publication Details */}
                <h2 className="text-xl font-semibold text-primary">
                  {publication.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {publication.authors}
                </p>

                {/* Links */}
                <div className="mt-4 flex gap-4 bottom">
                  <Link href={publication.link} target="_blank">
                    <FaLink style={{ fontSize: "1.2rem" }} />
                  </Link>
                  {publication.poster && (
                    <Link href={publication.poster} target="_blank">
                      <FaFilePdf style={{ fontSize: "1.2rem" }} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Loading publications...</p>
          )}
        </div>
      </main>
    </Layout>
  );
}
