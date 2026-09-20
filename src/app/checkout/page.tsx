'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Truck, ArrowRight, AlertCircle, Copy, Check, Lock } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedIban, setCopiedIban] = useState(false);

  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    order_number: string;
    total_amount: number;
    customer_name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUploadSuccess = (url: string) => {
    setScreenshotUrl(url);
    setErrorMessage(null);
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText('PK34HABB0000123456789000');
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!screenshotUrl) {
      setErrorMessage("Please upload your payment screenshot before placing the order.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_first_name: formData.firstName,
          customer_last_name: formData.lastName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          street_address: formData.streetAddress,
          city: formData.city,
          postal_code: formData.postalCode,
          notes: formData.notes,
          total_amount: getCartTotal(),
          payment_method: 'bank_transfer',
          payment_screenshot_url: screenshotUrl,
          items: items.map(item => ({
            productId: item.productId,
            title: item.title,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create order.');
      }

      setConfirmedOrder(data.order);
      setIsSuccess(true);
      clearCart();
    } catch (err: any) {
      console.error('Checkout submission error:', err);
      setErrorMessage(err.message || 'An error occurred while submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && confirmedOrder) {
    return (
      <div className="container px-4 pt-28 pb-16 sm:pt-32 sm:pb-24 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#7A2331] font-bold">
            Order Confirmation
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#1C1815]">
            Order Received!
          </h1>
          <p className="text-xs sm:text-sm text-[#4A423B] max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-[#1C1815] font-semibold">{confirmedOrder.customer_name}</strong>. Your order has been registered and is pending payment verification.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] rounded-none sm:rounded-2xl p-0 sm:p-8 text-left space-y-4 shadow-none sm:shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DFD7C9] pb-3 text-xs">
            <span className="text-[#7A6F64] font-medium">Order Number</span>
            <span className="font-mono text-sm font-bold text-[#7A2331] tracking-wider">
              {confirmedOrder.order_number}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#DFD7C9] pb-3 text-xs">
            <span className="text-[#7A6F64] font-medium">Total Amount</span>
            <span className="font-bold text-base text-[#1C1815]">
              PKR {confirmedOrder.total_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#DFD7C9] pb-3 text-xs">
            <span className="text-[#7A6F64] font-medium">Payment Status</span>
            <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              Pending Verification
            </span>
          </div>
          <p className="text-xs text-[#5A5046] leading-relaxed pt-1">
            Our gallery concierge team will inspect your payment receipt and contact you via WhatsApp / phone with tracking details once dispatched.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#7A2331] hover:bg-[#5C1A24] text-white font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-sm"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[#DFD7C9] hover:border-[#7A2331] bg-white text-[#231F1C] hover:text-[#7A2331] text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-colors font-medium shadow-2xs"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="container px-4 pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-2 border-[#7A2331] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#7A6F64] uppercase tracking-widest">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 pt-32 pb-20 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
        <h1 className="text-3xl font-heading font-medium text-[#1C1815]">Checkout</h1>
        <p className="text-sm text-[#5A5046]">Your cart is empty. Add a piece from our shop to checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#7A2331] hover:bg-[#5C1A24] text-white font-medium text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-colors shadow-sm"
        >
          <span>Go to Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 pt-28 pb-16 sm:pt-32 sm:pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#DFD7C9] pb-6 mb-10">
        <div className="flex items-center gap-2 mb-1.5">
          <Lock className="w-3.5 h-3.5 text-[#7A2331]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A2331] font-bold">
            Finalize Acquisition
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-medium text-[#1C1815] tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6F64] mt-1 font-normal">
          Bank transfer payment with complimentary insured nationwide delivery
        </p>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Checkout Form (7 cols) */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Customer Details */}
            <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] p-0 sm:p-7 rounded-none sm:rounded-2xl space-y-4 shadow-none sm:shadow-xs mt-6 sm:mt-0">
              <h2 className="text-base font-heading font-semibold text-[#1C1815] border-b border-[#DFD7C9] pb-3">
                1. Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="e.g. Abdul"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="e.g. Moez"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="abdul@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Details */}
            <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] p-0 sm:p-7 rounded-none sm:rounded-2xl space-y-4 shadow-none sm:shadow-xs mt-8 sm:mt-0">
              <h2 className="text-base font-heading font-semibold text-[#1C1815] border-b border-[#DFD7C9] pb-3">
                2. Shipping Destination
              </h2>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A423B]">Street Address *</label>
                <input
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                  placeholder="House / Apartment #, Street Name, Area"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="Islamabad / Lahore / Karachi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#4A423B]">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                    placeholder="44000"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#4A423B]">Special Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-[#DFD7C9] rounded-xl p-3 bg-[#FDFBF7] text-xs text-[#1C1815] placeholder:text-[#8C8478] focus:border-[#7A2331] focus:ring-1 focus:ring-[#7A2331] focus:outline-none transition-all"
                  placeholder="Gate code, delivery timing, etc."
                />
              </div>
            </div>

            {/* 3. Payment Section */}
            <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] p-0 sm:p-7 rounded-none sm:rounded-2xl space-y-5 shadow-none sm:shadow-xs mt-8 sm:mt-0">
              <div>
                <h2 className="text-base font-heading font-semibold text-[#1C1815] border-b border-[#DFD7C9] pb-3">
                  3. Bank Transfer & Payment Receipt
                </h2>
                <p className="text-xs text-[#5A5046] mt-2 leading-relaxed">
                  Please transfer the total acquisition amount to our official Habib Bank Limited gallery account, then upload a screenshot of your payment receipt below.
                </p>
              </div>
              
              <div className="bg-[#F7F2E9] border border-[#DFD7C9] rounded-xl p-5 space-y-2.5 text-xs text-[#231F1C]">
                <div className="flex justify-between">
                  <span className="text-[#7A6F64] font-medium">Bank:</span>
                  <span className="font-semibold text-[#1C1815]">HBL (Habib Bank Limited)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64] font-medium">Account Title:</span>
                  <span className="font-semibold text-[#1C1815]">Naqash Carpets Gallery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A6F64] font-medium">Account Number:</span>
                  <span className="font-mono text-[#7A2331] font-bold">0000 1234 5678 9000</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#DFD7C9]">
                  <span className="text-[#7A6F64] font-medium">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#7A2331] font-bold">PK34 HABB 0000 1234 5678 9000</span>
                    <button
                      type="button"
                      onClick={handleCopyIban}
                      className="p-1 hover:text-[#7A2331] transition-colors text-[#7A6F64]"
                      title="Copy IBAN"
                    >
                      {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-[#1C1815] block">
                  Upload Payment Receipt Screenshot *
                </label>
                {!screenshotUrl ? (
                  <div className="space-y-2">
                    <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
                    <p className="text-[11px] text-[#7A6F64]">
                      Supported formats: JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="truncate font-medium">Payment receipt screenshot attached</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScreenshotUrl(null)}
                      className="text-xs text-[#7A2331] hover:underline shrink-0 ml-2 font-semibold"
                    >
                      Replace
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Submit button trigger */}
            <div className="lg:hidden">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#7A2331] hover:bg-[#5C1A24] disabled:opacity-60 text-white font-semibold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 mt-4 sm:mt-0">
          <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] rounded-none sm:rounded-2xl p-0 sm:p-7 sticky top-28 space-y-6 shadow-none sm:shadow-xs">
            <h2 className="text-base font-heading font-semibold text-[#1C1815] border-b border-[#DFD7C9] pb-4">
              Acquisition Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>
            
            {/* Items List */}
            <div className="space-y-4 max-h-72 overflow-y-auto divide-y divide-[#EFE6D8]">
              {items.map(item => (
                <div key={item.id} className="pt-3.5 first:pt-0 flex gap-3.5 text-xs">
                  <div className="relative w-14 h-18 rounded-lg bg-[#F5EFEB] overflow-hidden shrink-0 border border-[#DFD7C9]">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-[#8C8478]">No image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="font-heading text-xs text-[#1C1815] truncate font-medium">{item.title}</h4>
                      {item.size && <p className="text-[11px] text-[#7A6F64] mt-0.5">Size: <span className="text-[#1C1815] font-medium">{item.size}</span></p>}
                      <p className="text-[11px] text-[#7A6F64]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-xs text-[#1C1815]">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-2.5 text-xs border-t border-[#DFD7C9] pt-4">
              <div className="flex justify-between text-[#5A5046]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1815]">PKR {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#5A5046]">
                <span>Insured Nationwide Delivery</span>
                <span className="text-emerald-700 font-semibold">Complimentary</span>
              </div>
              <div className="flex justify-between text-[#5A5046]">
                <span>Certificate of Authenticity</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
            </div>
            
            <div className="flex justify-between items-baseline border-t border-[#DFD7C9] pt-4">
              <span className="text-sm font-semibold text-[#1C1815]">Total Due</span>
              <span className="text-2xl font-bold text-[#7A2331]">
                PKR {getCartTotal().toLocaleString()}
              </span>
            </div>

            {/* Desktop Submit Button */}
            <div className="hidden lg:block pt-2">
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#7A2331] hover:bg-[#5C1A24] disabled:opacity-60 text-white font-semibold text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 text-[11px] text-[#7A6F64] pt-2 border-t border-[#DFD7C9]">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#7A2331] shrink-0" />
                <span>3-5 business days express insured delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7A2331] shrink-0" />
                <span>Verified authentic master weaver craftsmanship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
