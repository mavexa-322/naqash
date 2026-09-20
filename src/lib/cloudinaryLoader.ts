'use client';

/**
 * Cloudinary Custom Image Loader for Next.js
 * 
 * Ensures all image optimization, responsive scaling, format conversion (f_auto -> AVIF/WebP),
 * and compression (q_auto) are offloaded 100% to Cloudinary's global edge network.
 * 
 * Next.js and Vercel will NEVER process or re-encode these images, avoiding any Vercel
 * image transformation limits and charges.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If the source is already a Cloudinary CDN URL
  if (src.includes('res.cloudinary.com')) {
    const params = [
      'f_auto',
      'c_limit',
      `w_${width}`,
      `q_${quality || 'auto'}`,
    ].join(',');

    // Inject transformation params right after /image/upload/
    // Avoid duplicate parameter injection if already present
    if (src.includes('/image/upload/')) {
      // Check if there are already transformations applied
      const parts = src.split('/image/upload/');
      const rest = parts[1];
      
      // If the URL doesn't already have f_auto or w_, inject our optimization params
      if (!rest.startsWith('f_auto') && !rest.startsWith('w_') && !rest.startsWith('c_')) {
        return `${parts[0]}/image/upload/${params}/${rest}`;
      }
      return src;
    }

    return src;
  }

  // If a public_id is passed without domain (e.g. "naqash_products/rug123")
  if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/')) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'slqao1ue';
    const params = [
      'f_auto',
      'c_limit',
      `w_${width}`,
      `q_${quality || 'auto'}`,
    ].join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${src}`;
  }

  // Local static files in public/ (e.g., /why-choose-carpet-light.png, /naqash-emblem.svg)
  // return directly to browser without passing through Next.js /_next/image optimizer
  return src;
}
