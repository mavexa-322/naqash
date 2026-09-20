'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, ChevronRight, Check, ShoppingCart, ArrowRight, Heart, Sparkles } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopData';
import { useCartStore } from '@/store/useCartStore';

interface ProductDetailClientProps {
  product: ShopProduct;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCartStore();

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).filter(img => img !== product.image)
  ];

  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);

  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    const cartItemId = `${product.id}-${selectedSize}`;
    addItem({
      id: cartItemId,
      productId: product.id,
      title: product.title,
      size: selectedSize,
      price: displayPrice,
      image: selectedImage || product.image || '',
      quantity: quantity,
    }, true);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2500);
  };

  const handleBuyNow = () => {
    const cartItemId = `${product.id}-${selectedSize}`;
    addItem({
      id: cartItemId,
      productId: product.id,
      title: product.title,
      size: selectedSize,
      price: displayPrice,
      image: selectedImage || product.image || '',
      quantity: quantity,
    }, false);

    router.push('/checkout');
  };

  return (
    <div className="container px-4 md:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-[#7A6F64] mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#7A2331] transition-colors font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A69C8C] shrink-0" />
        <Link href="/shop" className="hover:text-[#7A2331] transition-colors font-medium">Shop</Link>
        {product.collection && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#A69C8C] shrink-0" />
            <Link href={`/collections/${product.collectionSlug || ''}`} className="hover:text-[#7A2331] transition-colors font-medium">
              {product.collection}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#A69C8C] shrink-0" />
        <span className="text-[#231F1C] font-semibold truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Image Gallery (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] bg-[#F5EFEB] rounded-2xl overflow-hidden border border-[#DFD7C9] shadow-sm group">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#8C8478] text-sm">
                No image available
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {hasDiscount && (
                <span className="bg-[#7A2331] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}
              {product.badge && (
                <span className="bg-[#C9A15C] text-[#1C1815] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-[#231F1C] transition-all shadow-md cursor-pointer z-10"
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[#7A2331] text-[#7A2331]" : "text-[#231F1C]"}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-1">
              {allImages.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#F5EFEB] ${
                    selectedImage === image
                      ? 'border-[#7A2331] ring-2 ring-[#7A2331]/20 scale-[1.02]'
                      : 'border-[#DFD7C9] hover:border-[#7A2331]/60 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details, Selection & Add to Cart (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Collection & Heading */}
            <div className="border-b border-[#DFD7C9] pb-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7A2331]">
                  {product.collection || 'Heritage Collection'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#A69C8C]" />
                <span className="text-xs text-[#7A6F64] font-medium">100% Hand-Knotted</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-medium text-[#1C1815] mb-3 leading-tight tracking-tight">
                {product.title}
              </h1>

              {/* Price section */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-semibold text-[#1C1815]">
                  PKR {displayPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-[#8C8478] line-through font-normal">
                      PKR {product.basePrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Save PKR {(product.basePrice - product.salePrice!).toLocaleString()}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#4A423B] leading-relaxed mt-4 font-normal">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1C1815]">
                    Select Dimension / Size
                  </h3>
                  <span className="text-xs text-[#7A2331] font-medium">Selected: {selectedSize}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(product.sizes && product.sizes.length > 0 ? product.sizes : ['Standard']).map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                          isSelected
                            ? 'border-[#7A2331] bg-[#7A2331] text-white shadow-xs font-semibold'
                            : 'border-[#DFD7C9] bg-white text-[#231F1C] hover:border-[#7A2331] hover:text-[#7A2331]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1C1815] mb-3">
                  Quantity
                </h3>
                <div className="inline-flex items-center border border-[#DFD7C9] rounded-lg bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-[#4A423B] hover:text-[#1C1815] hover:bg-[#F5EFEB] rounded transition-colors font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-[#1C1815]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-[#4A423B] hover:text-[#1C1815] hover:bg-[#F5EFEB] rounded transition-colors font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy It Now */}
            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2.5 cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#7A2331] hover:bg-[#5C1A24] text-white active:scale-[0.99]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold border-2 border-[#7A2331] hover:bg-[#7A2331]/5 text-[#7A2331] transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
              >
                <span>Buy It Now</span>
                <ArrowRight className="w-4 h-4 text-[#7A2331]" />
              </button>
            </div>

            {/* Trust Guarantees */}
            <div className="border-t border-b border-[#DFD7C9] py-4 my-2 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#4A423B]">
                <Truck className="w-4 h-4 text-[#7A2331] shrink-0" />
                <span>Complimentary insured shipping across Pakistan (3-5 days delivery)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#4A423B]">
                <ShieldCheck className="w-4 h-4 text-[#7A2331] shrink-0" />
                <span>Certificate of Authenticity & Master Weaver Guarantee included</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#4A423B]">
                <Sparkles className="w-4 h-4 text-[#7A2331] shrink-0" />
                <span>100% sustainably sourced organic natural materials</span>
              </div>
            </div>
          </div>

          {/* Details & Care Cards */}
          <div className="mt-6 space-y-4 sm:space-y-3.5 text-xs">
            <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] rounded-none sm:rounded-xl p-0 sm:p-4 space-y-1 shadow-none sm:shadow-2xs">
              <h4 className="font-semibold text-[#1C1815] uppercase tracking-wider text-[11px]">
                Material & Craftsmanship
              </h4>
              <p className="text-[#5A5046] leading-relaxed font-normal">
                {product.materials?.length ? product.materials.join(', ') : '100% Hand-spun New Zealand wool & pure silk on organic cotton warp.'}
              </p>
            </div>

            <div className="bg-transparent sm:bg-white border-0 sm:border sm:border-[#DFD7C9] rounded-none sm:rounded-xl p-0 sm:p-4 space-y-1 shadow-none sm:shadow-2xs mt-4 sm:mt-0">
              <h4 className="font-semibold text-[#1C1815] uppercase tracking-wider text-[11px]">
                Care & Maintenance
              </h4>
              <p className="text-[#5A5046] leading-relaxed font-normal">
                Vacuum regularly on low power without a beater bar. Rotate every 6 months. For spills, blot immediately with a clean dry towel; do not rub. Professional rug cleaning recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
