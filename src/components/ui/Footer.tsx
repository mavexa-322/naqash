import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal text-text-muted pt-28 border-t border-[#3A332C]">
      <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-4">
          <Link href="/" className="inline-flex" aria-label="Naqash home">
            <Image
              src="/naqash-logo.svg"
              alt="Naqash"
              width={160}
              height={128}
              className="h-28 w-44 object-contain object-left brightness-0 invert opacity-95"
            />
          </Link>
          <p className="text-sm leading-relaxed max-w-xs text-text-muted">
            Heritage craftsmanship meets modern minimalism. We curate the finest handmade rugs from master artisans.
          </p>
          <div className="flex gap-6 pt-3 text-xs uppercase tracking-[0.14em]">
            <a href="#" className="hover:text-text-light transition-colors">Instagram</a>
            <a href="#" className="hover:text-text-light transition-colors">Facebook</a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-6">Shop</h4>
          <ul className="space-y-3.5 text-sm flex flex-col">
            <li><Link href="/shop" className="text-text-muted hover:text-text-light transition-colors">All Rugs</Link></li>
            <li><Link href="/collections" className="text-text-muted hover:text-text-light transition-colors">Collections</Link></li>
            <li><Link href="/about" className="text-text-muted hover:text-text-light transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-6">Customer Care</h4>
          <ul className="space-y-3.5 text-sm flex flex-col">
            <li><Link href="/faq" className="text-text-muted hover:text-text-light transition-colors">FAQ & Care Guide</Link></li>
            <li><Link href="/shipping" className="text-text-muted hover:text-text-light transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="text-text-muted hover:text-text-light transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold text-gold uppercase tracking-[0.16em] mb-6">Visit Us</h4>
          <ul className="space-y-4 text-sm flex flex-col">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span className="text-text-muted">Block 19, Main Agha Khan Road, Next to Kaspas, F-6 Market, Islamabad</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <span className="text-text-muted">+92 300 5549807</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <span className="text-text-muted">hello@naqashcarpets.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Subtle Divider Strip Bottom Bar */}
      <div className="w-full bg-charcoal-soft mt-20 py-6 border-t border-[#3A332C]">
        <div className="container px-4 md:px-8 text-xs flex flex-col md:flex-row justify-between items-center text-text-muted gap-4">
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
