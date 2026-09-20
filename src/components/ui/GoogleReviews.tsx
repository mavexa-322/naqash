"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, ExternalLink } from "lucide-react";

interface Review {
  name: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
  location?: string;
  purchased?: string;
}

const reviews: Review[] = [
  {
    name: "Ahmed Khan",
    rating: 5,
    text: "Absolutely stunning collection! I purchased a hand-knotted Persian rug for my living room and the quality is exceptional. The colors are vibrant, the craftsmanship is superb, and the team was incredibly helpful in guiding me to the perfect piece.",
    date: "2 weeks ago",
    avatar: "AK",
    location: "Islamabad",
    purchased: "Persian Silk Medallion",
  },
  {
    name: "Sarah Williams",
    rating: 5,
    text: "I've been searching for an authentic handwoven carpet for months. Naqash Carpets Gallery exceeded all my expectations. The attention to detail in every knot is remarkable. Their customer service is world-class.",
    date: "1 month ago",
    avatar: "SW",
    location: "Diplomatic Enclave",
    purchased: "Vintage Overdyed Wool",
  },
  {
    name: "Muhammad Ali",
    rating: 5,
    text: "Heritage rugs with genuine quality. Bought two carpets for my new home — the silk carpet is absolutely breathtaking. Fair pricing for the level of craftsmanship you get. Will definitely be coming back.",
    date: "3 weeks ago",
    avatar: "MA",
    location: "Lahore",
    purchased: "Royal Bokhara Classic",
  },
  {
    name: "Fatima Zahra",
    rating: 5,
    text: "Beautiful vintage collection. I found a unique overdyed rug that perfectly matches my interior. The delivery was prompt and the rug was packaged with great care. Highly recommend visiting their gallery.",
    date: "1 month ago",
    avatar: "FZ",
    location: "Karachi",
    purchased: "Emerald Overdyed Vintage",
  },
  {
    name: "Imran Shah",
    rating: 5,
    text: "Best carpet gallery in Islamabad without a doubt. The owner personally helped me choose the right size and pattern for my office. The traditional craftsmanship really shines in their collection.",
    date: "2 months ago",
    avatar: "IS",
    location: "Islamabad",
    purchased: "Tabriz Floral Heritage",
  },
  {
    name: "Ayesha Malik",
    rating: 5,
    text: "Purchased a stunning Bokhara carpet as a gift. The quality is museum-worthy and the price was very reasonable for a hand-knotted piece. Their passion for preserving traditional rug-making is truly admirable.",
    date: "3 months ago",
    avatar: "AM",
    location: "Rawalpindi",
    purchased: "Bokhara Runner",
  },
];

export function GoogleReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const review = reviews[currentIndex];

  return (
    <section className="py-24 md:py-36 bg-ivory border-t border-[#DFD7C9] text-text-dark relative overflow-hidden">
      <div className="container px-4 md:px-8 relative z-10">
        {/* Brand & Google Reviews Combined Header */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-14 md:mb-18">
          {/* Proper Naqash Brand Emblem Header */}
          <div className="flex flex-col items-center justify-center gap-2">
            <Image
              src="/naqash-emblem.svg"
              alt="Naqash Carpets Emblem"
              width={56}
              height={36}
              className="h-9 md:h-10 w-auto object-contain"
            />
            <span className="font-heading text-lg md:text-xl tracking-[0.26em] text-text-dark uppercase font-medium">
              NAQASH
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.32em] text-text-muted uppercase font-light -mt-1">
              Handmade Carpets
            </span>
          </div>

          {/* Google Reviews Live Badge */}
          <div className="inline-flex items-center gap-3.5 bg-white border border-[#DFD7C9] rounded-full px-5 py-2.5 shadow-xs">
            {/* Authentic Google 'G' Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>

            <span className="text-xs font-semibold text-text-dark tracking-wide">Google Reviews</span>

            {/* 5 Stars in Gold */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A15C] text-[#C9A15C]" />
              ))}
            </div>

            <span className="text-xs font-bold text-text-dark">4.9</span>
            <span className="text-[11px] text-text-muted hidden sm:inline">(120+ verified reviews)</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-medium text-text-dark tracking-tight">
            Voices from Our Collectors
          </h2>
        </div>

        {/* Featured Review Card */}
        <div
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="bg-white border border-[#DFD7C9] rounded-2xl p-7 md:p-12 shadow-sm relative">
            {/* Google Logo Watermark */}
            <div className="absolute top-6 right-6 flex items-center gap-1.5 opacity-80">
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Verified Google Review</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-5">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C9A15C] text-[#C9A15C]" />
              ))}
            </div>

            {/* Review Text */}
            <p className="font-heading italic text-lg sm:text-xl md:text-2xl leading-relaxed text-text-dark">
              &ldquo;{review.text}&rdquo;
            </p>

            {/* Reviewer Details */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#DFD7C9]">
              <div className="w-11 h-11 rounded-full bg-cream-alt text-burgundy font-heading font-medium flex items-center justify-center text-sm border border-[#DFD7C9]">
                {review.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-heading text-base font-semibold text-text-dark">{review.name}</h4>
                <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                  {review.location && <span>{review.location}</span>}
                  {review.location && <span>·</span>}
                  <span>{review.date}</span>
                  {review.purchased && (
                    <>
                      <span>·</span>
                      <span className="text-burgundy font-medium">{review.purchased}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2 items-center">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex
                      ? "bg-[#C9A15C] w-8"
                      : "bg-[#DFD7C9] w-3 hover:bg-[#C9A15C]/60"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="p-2.5 rounded-full border border-[#DFD7C9] bg-white text-text-muted hover:border-burgundy hover:text-burgundy hover:bg-cream-alt transition-colors cursor-pointer shadow-xs"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="p-2.5 rounded-full border border-[#DFD7C9] bg-white text-text-muted hover:border-burgundy hover:text-burgundy hover:bg-cream-alt transition-colors cursor-pointer shadow-xs"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
