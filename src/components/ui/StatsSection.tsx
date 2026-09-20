"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

function Counter({ end, suffix = "", label, duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return (
    <div ref={ref} className="text-center space-y-4">
      <div className="text-5xl md:text-7xl font-heading font-medium text-gold">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs md:text-sm text-[#A69C8C] font-medium uppercase tracking-[0.16em]">
        {label}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-32 md:py-40 bg-charcoal text-text-light border-y border-[#3A332C]">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-14 md:gap-20">
          <Counter end={25} suffix="+" label="Years of Heritage" />
          <Counter end={5000} suffix="+" label="Rugs Crafted" />
          <Counter end={3000} suffix="+" label="Happy Customers" />
          <Counter end={150} suffix="+" label="Artisan Partners" />
        </div>
      </div>
    </section>
  );
}
