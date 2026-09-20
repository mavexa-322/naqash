'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container px-4 pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-2 border-[#7A2331] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#7A6F64] uppercase tracking-widest">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 pt-32 pb-20 sm:pt-36 sm:pb-28 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#F5EFEB] border border-[#DFD7C9] flex items-center justify-center text-[#7A2331] shadow-2xs">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#1C1815]">Your Cart is Empty</h1>
        <p className="text-sm text-[#5A5046] font-normal leading-relaxed">
          Looks like you haven&apos;t added any rugs to your cart yet. Discover your heirloom piece in our curated collections.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#7A2331] hover:bg-[#5C1A24] text-white font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-sm"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 pt-28 pb-16 sm:pt-32 sm:pb-24 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#DFD7C9] pb-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#1C1815]">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-[#7A6F64] mt-1 font-normal">
            Review your selected handcrafted masterpieces
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs uppercase tracking-wider text-[#7A2331] font-semibold hover:underline"
        >
          ← Continue Browsing
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] p-0 sm:p-5 rounded-none sm:rounded-2xl shadow-none sm:shadow-xs border-b border-[#DFD7C9] pb-6 mb-2 sm:mb-0 sm:pb-5"
            >
              <div className="relative w-full sm:w-28 h-48 sm:h-36 rounded-xl overflow-hidden bg-[#F5EFEB] shrink-0 border border-[#DFD7C9]">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-[#8C8478]">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-heading font-medium text-base sm:text-lg text-[#1C1815]">
                      {item.title}
                    </h3>
                    <p className="font-bold text-base sm:text-lg text-[#1C1815] shrink-0">
                      PKR {item.price.toLocaleString()}
                    </p>
                  </div>
                  {item.size && (
                    <p className="text-xs text-[#7A6F64] mt-1">
                      Size: <span className="text-[#1C1815] font-medium">{item.size}</span>
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#F0EAE1]">
                  <div className="flex items-center border border-[#DFD7C9] rounded-lg bg-[#FDFBF7] shadow-2xs">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2.5 py-1.5 hover:bg-[#F5EFEB] text-[#4A423B] transition-colors cursor-pointer font-bold"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 text-xs font-bold text-[#1C1815]">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-[#F5EFEB] text-[#4A423B] transition-colors cursor-pointer font-bold"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[#8C8478] hover:text-red-700 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 mt-6 sm:mt-0">
          <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] rounded-none sm:rounded-2xl p-0 sm:p-7 space-y-6 shadow-none sm:shadow-xs sticky top-28">
            <h2 className="text-base font-heading font-semibold text-[#1C1815] border-b border-[#DFD7C9] pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3 text-xs border-b border-[#DFD7C9] pb-4">
              <div className="flex justify-between text-[#5A5046]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1815]">
                  PKR {getCartTotal().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#5A5046]">
                <span>Nationwide Shipping</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-[#5A5046]">
                <span>Certificate & Guarantee</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
            </div>
            
            <div className="flex justify-between items-baseline text-base font-semibold">
              <span className="text-[#1C1815]">Estimated Total</span>
              <span className="text-2xl font-bold text-[#7A2331]">
                PKR {getCartTotal().toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[#7A2331] hover:bg-[#5C1A24] text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-md active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="space-y-2 pt-2 text-[11px] text-[#7A6F64]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#7A2331] shrink-0" />
                <span>3-5 business days insured express delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7A2331] shrink-0" />
                <span>Authenticity certified with money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
