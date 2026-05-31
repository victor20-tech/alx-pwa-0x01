import { MovieProps } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const MovieCard: React.FC<MovieProps> = ({
  id,
  title,
  posterImage,
  releaseYear,
}) => {
  const router = useRouter();
  const [imgSrc, setImgSrc] = useState<string>(
    posterImage ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=60"
  );

  const handleClick = () => {
    if (id) {
      router.push(`/movies/${id}`);
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl glass-panel p-3 transition duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      <div
        className="relative w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/5"
        onClick={handleClick}
      >
        <div className="aspect-[2/3] w-full">
          <Image
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            src={imgSrc}
            width={320}
            height={480}
            alt={title || "Movie poster"}
            onError={() =>
              setImgSrc(
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=60"
              )
            }
          />
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <p className="line-clamp-2 font-medium leading-snug text-foreground md:text-lg">
          {title || "Unknown Title"}
        </p>
        <p className="shrink-0 text-sm font-semibold text-accent md:text-base">
          {releaseYear || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
