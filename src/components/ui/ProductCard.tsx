"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import type { ShopProduct } from "@/lib/shopData";

interface ProductCardProps {
  product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white border border-[#DFD7C9] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-lg sm:rounded-xl bg-[#F5EFEB] mb-2.5 sm:mb-4">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover image-grade transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm text-text-muted">
              No image available
            </div>
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Prominent Discount & Status Badge */}
          {hasDiscount ? (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider shadow-sm bg-burgundy text-white flex items-center gap-1">
              <span>-{discountPercent}%</span>
            </div>
          ) : product.badge ? (
            <div
              className={`absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider shadow-xs ${
                product.badge === "new"
                  ? "bg-[#243746] text-white"
                  : "bg-gold text-[#1C1815]"
              }`}
            >
              {product.badge === "new" ? "New" : "Bestseller"}
            </div>
          ) : null}

          {/* Quick Action Buttons */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-1.5 sm:p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer ${
                isWishlisted
                  ? "bg-burgundy text-white"
                  : "bg-white/90 text-text-dark hover:bg-white hover:text-burgundy"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
            <Link
              href={`/shop/${product.slug}`}
              className="p-1.5 sm:p-2.5 rounded-full bg-white/90 text-text-dark hover:bg-white hover:text-burgundy backdrop-blur-md shadow-sm transition-all duration-200 hidden sm:flex items-center justify-center"
              aria-label="Quick view"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>

          {/* View Product Button (Bottom Hover Bar) */}
          <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-white/95 backdrop-blur-md text-text-dark hover:bg-burgundy hover:text-white transition-colors text-center py-2.5 rounded-xl text-xs uppercase tracking-widest font-medium shadow-md">
              View Piece
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-1.5 px-0.5 sm:px-1 pb-1">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-text-muted">
          <span className="uppercase tracking-wider font-medium text-burgundy/80 truncate">
            {product.collection || "Heritage"}
          </span>
          {product.sizes?.[0] && (
            <span className="shrink-0 text-[9px] sm:text-[11px]">{product.sizes[0]}–{product.sizes[product.sizes.length - 1]}</span>
          )}
        </div>

        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-heading font-medium text-xs sm:text-base text-text-dark group-hover:text-burgundy transition-colors duration-200 line-clamp-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-[10px] sm:text-xs text-text-muted line-clamp-1 font-light">
          {product.materials.join(", ")}
        </p>

        <div className="flex items-baseline gap-1.5 sm:gap-2 pt-0.5 sm:pt-1 flex-wrap">
          <span className={`font-semibold text-xs sm:text-base ${hasDiscount ? "text-burgundy" : "text-text-dark"}`}>
            PKR {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[10px] sm:text-xs text-text-muted line-through">
                PKR {product.basePrice.toLocaleString()}
              </span>
              <span className="text-[8px] sm:text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-1 sm:px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 pt-1 sm:pt-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-[#DFD7C9]"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[8px] sm:text-[9px] text-text-muted">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getColorHex(color: string): string {
  const map: Record<string, string> = {
    "Red & Burgundy": "#8B1A1A",
    "Ivory & Cream": "#F5F0E1",
    "Blue & Navy": "#1B3A5C",
    "Charcoal & Grey": "#4A4A4A",
    "Jewel Tones": "#2E8B57",
    "Terracotta & Rust": "#C1440E",
  };
  return map[color] ?? "#CCC";
}
