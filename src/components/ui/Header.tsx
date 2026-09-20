'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const hasSolidBg = !isHome || isScrolled;

  const isCollectionsActive = pathname.startsWith('/collections');
  const isShopActive = pathname.startsWith('/shop');
  const isSaleActive = pathname === '/sale';
  const isAboutActive = pathname.startsWith('/about');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        hasSolidBg
          ? 'bg-[#181411] shadow-xl border-b border-[#2E2822]'
          : 'bg-gradient-to-b from-black/80 via-black/35 to-transparent'
      }`}
    >
      <div
        className={`container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 flex items-center justify-between relative transition-all duration-300 ${
          hasSolidBg ? 'py-3 sm:py-3.5 md:py-4' : 'py-4 sm:py-6 md:py-7'
        }`}
      >
        
        {/* Left: Brand Logo with Emblem & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0" aria-label="Naqash home">
          <Image
            src="/naqash-emblem.svg"
            alt="Naqash Emblem"
            width={64}
            height={40}
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-2xl md:text-[25px] tracking-[0.22em] text-[#F7F2E9] font-normal group-hover:text-[#D4AF37] transition-colors leading-none">
              NAQASH
            </span>
            <span className="text-[7.5px] sm:text-[9px] tracking-[0.3em] text-[#C4B5A5] uppercase font-light mt-0.5 sm:mt-1">
              Handmade Carpets
            </span>
          </div>
        </Link>
        
        {/* Center: Exactly Centered Navigation Links with Delicate Separators */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.22em] font-normal text-[#C4B5A5]">
          <Link 
            href="/" 
            className={`transition-colors pb-0.5 ${
              isHome 
                ? 'text-[#F7F2E9] border-b border-[#C4B5A5]/80 font-medium' 
                : 'hover:text-white'
            }`}
          >
            Home
          </Link>
          <span className="text-[#8C7A68]/50 text-xs select-none">|</span>
          <Link 
            href="/shop" 
            className={`transition-colors pb-0.5 ${
              isShopActive 
                ? 'text-[#F7F2E9] border-b border-[#C4B5A5]/80 font-medium' 
                : 'hover:text-white'
            }`}
          >
            Shop
          </Link>
          <span className="text-[#8C7A68]/50 text-xs select-none">|</span>
          <Link 
            href="/collections" 
            className={`transition-colors pb-0.5 ${
              isCollectionsActive 
                ? 'text-[#F7F2E9] border-b border-[#C4B5A5]/80 font-medium' 
                : 'hover:text-white'
            }`}
          >
            Collections
          </Link>
          <span className="text-[#8C7A68]/50 text-xs select-none">|</span>
          <Link 
            href="/sale" 
            className={`transition-colors pb-0.5 ${
              isSaleActive 
                ? 'text-[#F7F2E9] border-b border-[#C4B5A5]/80 font-medium' 
                : 'text-[#D4AF37] hover:text-[#F3E5D8]'
            }`}
          >
            Sale
          </Link>
          <span className="text-[#8C7A68]/50 text-xs select-none">|</span>
          <Link 
            href="/about" 
            className={`transition-colors pb-0.5 ${
              isAboutActive 
                ? 'text-[#F7F2E9] border-b border-[#C4B5A5]/80 font-medium' 
                : 'hover:text-white'
            }`}
          >
            About
          </Link>
        </nav>

        {/* Right: Contact Bronze Button (Matching Reference) & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-[#644122]/70 hover:bg-[#784E2A]/90 text-[#F7F2E9] font-medium text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] px-4 sm:px-7 py-2 sm:py-3 border border-[#9A6D3F]/50 backdrop-blur-xs transition-all duration-300 shadow-sm whitespace-nowrap"
          >
            Contact
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#F7F2E9] hover:text-white p-1 sm:p-1.5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1C1815]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-5 text-sm uppercase tracking-[0.2em] font-medium text-[#D6C7B8]">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F7F2E9] font-semibold text-[#C9A15C]"
            >
              Home
            </Link>
            <div className="h-px bg-white/10" />
            <Link 
              href="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Shop
            </Link>
            <div className="h-px bg-white/10" />
            <Link 
              href="/collections" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              Collections
            </Link>
            <div className="h-px bg-white/10" />
            <Link 
              href="/sale" 
              onClick={() => setMobileMenuOpen(false)}
              className={isSaleActive ? "text-white font-semibold" : "text-[#C9A15C] font-semibold"}
            >
              Sale
            </Link>
            <div className="h-px bg-white/10" />
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white"
            >
              About
            </Link>
            <div className="pt-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center inline-block bg-gradient-to-b from-[#8C6239] to-[#614120] text-[#F7F2E9] font-medium text-xs uppercase tracking-[0.2em] py-3 border border-[#9E7345]/50"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
