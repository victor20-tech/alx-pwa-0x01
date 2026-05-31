import { MoviesProps } from "@/interfaces";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1485841890310-6a055c88698a?auto=format&fit=crop&w=1920&q=80";

const INTERVAL_MS = 5500;

type HeroTrendingBackdropProps = {
  movies: MoviesProps[];
};

const HeroTrendingBackdrop: React.FC<HeroTrendingBackdropProps> = ({ movies }) => {
  const slides = useMemo(() => {
    const out: { id: string; url: string }[] = [];
    for (const m of movies) {
      const url = m.primaryImage?.url;
      if (!url) continue;
      if (out.some((o) => o.url === url)) continue;
      out.push({ id: m.id, url });
      if (out.length >= 8) break;
    }
    return out;
  }, [movies]);

  const urls = slides.length > 0 ? slides : [{ id: "fallback", url: FALLBACK_IMAGE }];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % urls.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [urls.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {urls.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full min-h-full w-full min-w-full">
            <Image
              src={slide.url}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              draggable={false}
              quality={80}
              className="object-cover object-[center_22%] min-[480px]:object-[center_26%] md:object-[center_32%] lg:object-center xl:object-[center_40%]"
            />
          </div>
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(5,7,13,0.94) 0%, rgba(12,18,34,0.5) 42%, rgba(5,7,13,0.9) 100%)",
        }}
      />
    </div>
  );
};

export default HeroTrendingBackdrop;
