"use client";

import React, { useState } from "react";
import VideoCard from "@/components/videoCard";
import Layout from "@/components/layout";
import videosData from "@/public/data/videos.json";

interface Video {
  id: string;
  title: string;
  platform: string;
  url: string;
}

const VideosPage: React.FC = () => {
  const videos: Video[] = videosData.videos;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4; // Number of videos per page

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = videos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(videos.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-primary mb-2 text-center">
          Videos
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Some videos featuring me!
        </p>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-4">
          {currentItems.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded transition ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default VideosPage;
