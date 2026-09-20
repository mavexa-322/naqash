"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-burgundy">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,161,92,0.2),transparent_45%)]" />
      {/* Decorative pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10 container px-4 md:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-6xl font-heading font-medium text-text-light">
            Stay Connected with Heritage
          </h2>
          <p className="text-lg text-text-light/85 leading-relaxed">
            Be the first to discover new arrivals, exclusive collections, and artisan stories. 
            Join our community of rug enthusiasts.
          </p>
          
          {submitted ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 animate-in fade-in duration-500">
              <p className="flex items-center justify-center gap-2 text-text-light font-semibold text-lg">
                <Check className="w-5 h-5 text-gold" /> Thank you for subscribing!
              </p>
              <p className="text-text-light/80 text-sm mt-1">
                You&apos;ll receive our curated updates soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mt-8">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-3.5 rounded-full bg-ivory text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-gold text-sm shadow-xs"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-charcoal text-text-light hover:bg-charcoal-soft font-semibold text-sm uppercase tracking-[0.12em] whitespace-nowrap transition-colors rounded-full shadow-md hover:-translate-y-0.5 transform"
              >
                Subscribe
              </button>
            </form>
          )}
          
          <p className="text-xs text-text-light/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
