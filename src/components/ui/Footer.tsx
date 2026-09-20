import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal text-text-muted pt-12 sm:pt-20 md:pt-28 border-t border-[#3A332C]">
      <div className="container px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-10 lg:gap-16">
        {/* Brand Column */}
        <div className="col-span-2 lg:col-span-1 space-y-3.5 sm:space-y-4 flex flex-col items-start">
          <Link href="/" className="inline-flex items-start justify-start" aria-label="Naqash home">
            <Image
              src="/naqash-logo-light.svg"
              alt="Naqash"
              width={140}
              height={100}
              className="h-14 sm:h-18 w-auto object-contain object-left"
            />
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed max-w-sm text-text-muted">
            Heritage craftsmanship meets modern minimalism. We curate the finest handmade rugs from master artisans.
          </p>
          <div className="flex gap-5 pt-1 text-xs uppercase tracking-[0.14em]">
            <a href="#" className="hover:text-text-light transition-colors">Instagram</a>
            <a href="#" className="hover:text-text-light transition-colors">Facebook</a>
          </div>
        </div>

        {/* Shop Column */}
        <div className="col-span-1">
          <h4 className="font-heading text-xs sm:text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-3.5 sm:mb-6">Shop</h4>
          <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm flex flex-col">
            <li><Link href="/shop" className="text-text-muted hover:text-text-light transition-colors">All Rugs</Link></li>
            <li><Link href="/collections" className="text-text-muted hover:text-text-light transition-colors">Collections</Link></li>
            <li><Link href="/about" className="text-text-muted hover:text-text-light transition-colors">Our Story</Link></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="col-span-1">
          <h4 className="font-heading text-xs sm:text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-3.5 sm:mb-6">Customer Care</h4>
          <ul className="space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm flex flex-col">
            <li><Link href="/faq" className="text-text-muted hover:text-text-light transition-colors">FAQ & Care Guide</Link></li>
            <li><Link href="/shipping" className="text-text-muted hover:text-text-light transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="text-text-muted hover:text-text-light transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Visit Us Column */}
        <div className="col-span-2 lg:col-span-1 pt-4 lg:pt-0 border-t border-[#3A332C]/60 lg:border-t-0">
          <h4 className="font-heading text-xs sm:text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-3 sm:mb-6">Visit Us</h4>
          <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm flex flex-col">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span className="text-text-muted leading-relaxed">Block 19, Main Agha Khan Road, Next to Kaspas, F-6 Market, Islamabad</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <span className="text-text-muted">+92 300 5549807</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span className="text-text-muted">hello@naqashcarpets.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Subtle Divider Strip Bottom Bar */}
      <div className="w-full bg-charcoal-soft mt-10 sm:mt-16 py-5 border-t border-[#3A332C]">
        <div className="container px-4 md:px-8 text-xs flex flex-col md:flex-row justify-between items-center text-text-muted gap-3">
          <p>&copy; {new Date().getFullYear()} Naqash Carpets Gallery. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-text-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-text-light transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
