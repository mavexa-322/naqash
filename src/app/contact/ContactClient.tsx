'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'General Curation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-ivory pb-28 pt-24 md:pt-32">
      {/* ── 1. Hero Header ──────────────────────────────────────── */}
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cream-alt/90 via-ivory to-cream-alt/40 border border-[#DFD7C9] py-14 sm:py-20 px-6 sm:px-12 text-center shadow-xs">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Ornamental Palmette Crest */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 md:w-12 h-px bg-gold/50" />
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-burgundy opacity-90"
              >
                <path
                  d="M20 3C20 3 13 11 13 18C13 23 16 27 20 27C24 27 27 23 27 18C27 11 20 3 20 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 27V37M15 33C15 33 17 31 20 31C23 31 25 33 25 33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 21C8 18 8 13 12 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M30 21C32 18 32 13 28 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="w-8 md:w-12 h-px bg-gold/50" />
            </div>

            {/* Eyebrow */}
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy block mb-2">
              Concierge & Atelier Consultations
            </span>

            {/* Title */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium text-text-dark tracking-tight mb-4">
              Contact Us
            </h1>

            {/* Subtitle */}
            <p className="text-text-muted text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Whether you need guidance selecting the ideal heritage piece, wish to book a private viewing in Islamabad, or require custom sizing, our curators are at your service.
            </p>

            {/* Micro Badge */}
            <div className="inline-flex items-center gap-3 mt-6 px-5 py-2 rounded-full bg-white/90 border border-[#DFD7C9] text-xs uppercase tracking-wider text-text-muted shadow-xs">
              <span className="text-burgundy font-semibold">Open Daily in F-6 Market</span>
              <span className="w-1 h-1 rounded-full bg-gold" />
              <span>Worldwide White-Glove Shipping</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        {/* ── 2. Grid: Contact Details & Inquiry Form ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (5 Cols): Boutique Info & Direct Concierge */}
          <div className="lg:col-span-5 space-y-6">
            {/* Gallery Boutique Card */}
            <div className="bg-white rounded-3xl border border-[#DFD7C9] p-7 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-3 border-b border-[#F0EAE1] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-cream-alt text-burgundy flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-medium text-text-dark">Visit Our Gallery</h2>
                  <p className="text-[11px] uppercase tracking-wider text-text-muted">Flagship Boutique</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-text-muted font-light leading-relaxed">
                <p className="font-medium text-text-dark text-base">Naqash Carpets Gallery</p>
                <p>Block 19, Main Agha Khan Road,</p>
                <p>Next to Kaspas, F-6 Market,</p>
                <p>Islamabad, 44000, Pakistan</p>
              </div>

              <div className="pt-2 border-t border-[#F0EAE1] flex items-center gap-3 text-xs text-text-muted font-light">
                <Clock className="w-4 h-4 text-burgundy shrink-0" />
                <div>
                  <p className="font-medium text-text-dark">Mon – Sat: 11:00 AM – 9:00 PM</p>
                  <p>Sunday: 2:00 PM – 9:00 PM</p>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Block+19,+Main+Agha+Khan+Road,+F-6+Market,+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-burgundy hover:underline pt-2"
              >
                Get Directions on Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Communication Channels */}
            <div className="bg-white rounded-3xl border border-[#DFD7C9] p-7 sm:p-8 shadow-xs space-y-5">
              <h3 className="font-heading text-lg font-medium text-text-dark border-b border-[#F0EAE1] pb-3">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <a
                  href="tel:+923005549807"
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-cream-alt/60 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-cream-alt text-burgundy flex items-center justify-center shrink-0 group-hover:bg-burgundy group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-muted block">Direct Line</span>
                    <span className="text-sm font-medium text-text-dark group-hover:text-burgundy transition-colors">
                      +92 300 5549807
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:hello@naqashcarpets.com"
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-cream-alt/60 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-cream-alt text-burgundy flex items-center justify-center shrink-0 group-hover:bg-burgundy group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-muted block">Email Inquiries</span>
                    <span className="text-sm font-medium text-text-dark group-hover:text-burgundy transition-colors">
                      hello@naqashcarpets.com
                    </span>
                  </div>
                </a>
              </div>

              {/* WhatsApp VIP Concierge Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/923005549807?text=Hello%20Naqash%20Carpets%20Gallery,%20I%20would%20like%20to%20inquire%20about%20your%20rug%20collection."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-full bg-[#1E3A2F] hover:bg-[#162B23] text-white flex items-center justify-center gap-2.5 text-xs uppercase tracking-widest font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Message Us on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Luxury Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#DFD7C9] p-8 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="py-16 text-center space-y-5 my-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark">
                  Inquiry Received
                </h3>
                <p className="text-text-muted text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to Naqash Carpets Gallery. A dedicated curator will review your details and connect with you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 border border-[#DFD7C9] hover:border-burgundy rounded-full text-xs uppercase tracking-wider text-text-dark font-medium transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-8">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-burgundy block mb-1">
                    Private Consultation
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark">
                    Send an Inquiry
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted font-light mt-1">
                    Tell us about your room dimensions, preferred weave, or order inquiries.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                        First Name <span className="text-burgundy">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tariq"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/60 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                        Last Name <span className="text-burgundy">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mehmood"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/60 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                        Email Address <span className="text-burgundy">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tariq@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/60 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/60 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                      Area of Interest
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark focus:outline-none focus:border-burgundy transition-all"
                    >
                      <option value="General Curation">General Curation & Collection Inquiry</option>
                      <option value="Private Viewing">Book an In-Person Gallery Consultation (F-6)</option>
                      <option value="In-Home Trial">In-Home Rug Trial (Islamabad / Rawalpindi)</option>
                      <option value="Custom Sizing">Custom Architectural Sizing & Weaving</option>
                      <option value="Order Assistance">Existing Order or Worldwide Shipping</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                      Your Message <span className="text-burgundy">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please share details about your space, dimensions, design preferences, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/60 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10 transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 px-8 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Consultation Request
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Google Maps Interactive Showcase ─────────────────── */}
        <section className="bg-white rounded-3xl border border-[#DFD7C9] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EAE1] pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-semibold text-burgundy block mb-1">
                Atelier Location
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark">
                Find Our Gallery in F-6 Market
              </h2>
              <p className="text-xs sm:text-sm text-text-muted font-light mt-1">
                Located on Main Agha Khan Road in the heart of Islamabad, with convenient front parking.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Block+19,+Main+Agha+Khan+Road,+F-6+Market,+Islamabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cream-alt text-burgundy hover:bg-burgundy hover:text-white border border-[#DFD7C9] text-xs uppercase tracking-wider font-semibold transition-all shadow-xs shrink-0"
            >
              Open in Google Maps App
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Map Embed Container */}
          <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-[#DFD7C9] shadow-inner bg-cream-alt">
            <iframe
              title="Naqash Carpets Gallery Google Map"
              src="https://maps.google.com/maps?q=Block+19,+Main+Agha+Khan+Road,+F-6+Market,+Islamabad,+Pakistan&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            {/* Floating Location Badge */}
            <div className="absolute top-4 left-4 z-10 max-w-xs bg-white/95 backdrop-blur-md border border-[#DFD7C9] p-4 rounded-2xl shadow-lg hidden sm:block">
              <div className="flex items-center gap-2 text-burgundy mb-1 font-semibold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Naqash Carpets Gallery</span>
              </div>
              <p className="text-xs text-text-muted font-light leading-snug">
                Block 19, Main Agha Khan Road, Next to Kaspas, F-6 Market, Islamabad
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
