'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl font-heading font-bold text-foreground">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md">Looks like you haven't added any rugs to your cart yet. Discover your perfect piece in our shop.</p>
        <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "mt-4")}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 py-12 lg:py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl font-heading font-bold text-foreground mb-12">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 border-b pb-8">
              <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading font-bold text-lg">{item.title}</h3>
                    <p className="font-medium">PKR {item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Size: {item.size}</p>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-muted text-muted-foreground transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-muted/30 border rounded-2xl p-8 h-fit space-y-6">
          <h2 className="text-xl font-heading font-bold">Order Summary</h2>
          
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
            <span>PKR {getCartTotal().toLocaleString()}</span>
          </div>

          <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "w-full text-lg mt-4")}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
