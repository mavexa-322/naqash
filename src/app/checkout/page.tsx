'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUploadSuccess = (url: string) => {
    setScreenshotUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotUrl) {
      alert("Please upload a payment screenshot to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    
    // TODO: Send order details and screenshotUrl to Supabase
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container px-4 py-32 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-4xl font-heading font-bold text-foreground">Order Received!</h1>
        <p className="text-muted-foreground max-w-md">
          Thank you for shopping with Naqash Carpets Gallery. We are verifying your payment and will process your order shortly.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-4")}>
          Return to Homepage
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-3xl font-heading font-bold text-foreground">Checkout</h1>
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop" className={buttonVariants()}>
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Checkout Form */}
        <div>
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-12">
            {/* Customer Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold border-b pb-2">Customer Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input type="text" className="w-full border rounded-md p-3 bg-background" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full border rounded-md p-3 bg-background" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input type="email" className="w-full border rounded-md p-3 bg-background" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input type="tel" className="w-full border rounded-md p-3 bg-background" required />
              </div>
            </div>

            {/* Shipping Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold border-b pb-2">Shipping Address</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Street Address</label>
                <input type="text" className="w-full border rounded-md p-3 bg-background" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input type="text" className="w-full border rounded-md p-3 bg-background" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal Code</label>
                  <input type="text" className="w-full border rounded-md p-3 bg-background" required />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6 bg-muted/30 p-8 rounded-xl border">
              <h2 className="text-2xl font-heading font-bold">Payment</h2>
              <p className="text-sm text-muted-foreground">
                Please transfer the total amount to the bank account below and upload a screenshot of your receipt.
              </p>
              
              <div className="bg-background border rounded-lg p-6 space-y-2">
                <p><span className="font-semibold">Bank:</span> HBL (Habib Bank Limited)</p>
                <p><span className="font-semibold">Account Title:</span> Naqash Carpets Gallery</p>
                <p><span className="font-semibold">Account Number:</span> 0000 1234 5678 9000</p>
                <p><span className="font-semibold">IBAN:</span> PK34 HABB 0000 1234 5678 9000</p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <label className="text-sm font-medium">Upload Payment Receipt *</label>
                {!screenshotUrl ? (
                  <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
                ) : (
                  <div className="flex items-center gap-4 bg-primary/10 text-primary p-4 rounded-md font-medium text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Screenshot uploaded successfully.
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card border rounded-2xl p-8 sticky top-24 space-y-6">
            <h2 className="text-xl font-heading font-bold">Order Summary</h2>
            
            <div className="space-y-4 border-b pb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.title} (x{item.quantity})</span>
                  <span className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 text-sm border-b pb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">PKR {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">PKR {getCartTotal().toLocaleString()}</span>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              size="lg" 
              className="w-full text-lg mt-4" 
              disabled={isSubmitting || !screenshotUrl}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
