import Link from "next/Link";
import React from "react";
import { FaLink } from "react-icons/fa";

interface Video {
  id: string;
  title: string;
  platform: string;
}

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow hover:shadow-lg transition">
      <div className="relative mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          style={{ width: "100%", height: "320px" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <h2 className="text-xl font-semibold text-primary mb-2">{video.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{video.platform}</p>
      <Link
        href={`https://www.youtube.com/watch?v=${video.id}`}
        target="_blank"
      >
        <FaLink />
      </Link>
    </div>
  );
};

export default VideoCard;
