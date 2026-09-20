'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getCartTotal, getItemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const total = getCartTotal();
  const totalCount = getItemCount();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#181411] text-[#F7F2E9] border-l border-[#332A22] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2E261F] bg-[#14100D]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C9A15C]" />
            <h2 className="font-heading text-lg tracking-wide text-[#F7F2E9]">
              Shopping Cart
            </h2>
            <span className="text-xs bg-[#2E261F] text-[#C9A15C] px-2 py-0.5 rounded-full font-medium">
              {totalCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#BDB0A4] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#C9A15C]/60">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl text-[#F7F2E9] mb-2">Your Cart is Empty</h3>
            <p className="text-xs text-[#B8AAA0] max-w-xs leading-relaxed mb-6 font-light">
              Explore our curated selection of handmade luxury rugs, heritage kilims, and vintage carpets.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="inline-flex items-center gap-2 bg-[#C9A15C] text-[#181411] hover:bg-[#D4AF37] font-medium text-xs uppercase tracking-widest px-6 py-3 rounded-xs transition-colors shadow-md"
            >
              Explore Shop
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#2E261F] space-y-4">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded bg-[#241E18] border border-white/10 overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-heading text-sm text-[#F7F2E9] truncate font-medium">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#9E8E80] hover:text-red-400 p-1 transition-colors shrink-0"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.size && (
                        <p className="text-[11px] text-[#A69788] mt-0.5">
                          Size: <span className="text-[#E0C5A2] font-medium">{item.size}</span>
                        </p>
                      )}

                      <p className="text-xs text-[#C9A15C] font-semibold mt-1">
                        PKR {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#261E17]">
                      <div className="inline-flex items-center border border-[#3D332A] rounded bg-[#201A15]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#C4B5A5] hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-[#F7F2E9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#C4B5A5] hover:text-white hover:bg-white/10 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-[#D8CCC0] font-medium">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & Actions */}
            <div className="p-6 border-t border-[#2E261F] bg-[#14100D] space-y-4">
              <div className="flex items-center gap-2 text-[11px] text-[#A69788] bg-[#221C16] border border-[#332A20] px-3 py-2 rounded">
                <Truck className="w-4 h-4 text-[#C9A15C] shrink-0" />
                <span>Complimentary insured shipping across Pakistan</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#B8AAA0]">
                  <span>Subtotal</span>
                  <span className="text-sm font-semibold text-[#F7F2E9]">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8C7D70]">
                  <span>Shipping & Taxes</span>
                  <span className="text-[#C9A15C]">Calculated at checkout</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#C9A15C] hover:bg-[#D4AF37] text-[#181411] font-semibold text-xs uppercase tracking-widest py-3.5 rounded transition-all shadow-md active:scale-[0.99]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full block text-center border border-[#3D332A] hover:border-[#C9A15C]/60 text-[#D8CCC0] hover:text-white text-xs uppercase tracking-wider py-2.5 rounded transition-colors"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
