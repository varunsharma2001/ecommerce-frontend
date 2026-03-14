'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types/product.types';

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // useCallback: prev/next handlers have stable references.
  // Thumbnail buttons won't re-render just because activeIndex changed.
  const prev = useCallback(
    () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length]
  );

  if (!images.length) {
    return <div className="h-96 rounded-2xl bg-gray-100" />;
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-96 overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={images[activeIndex].url}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          // priority: this is the LCP (Largest Contentful Paint) image on PDP.
          // Marking it priority tells Next.js to preload it, improving Core Web Vitals.
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.public_id}
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === activeIndex ? 'border-gray-900' : 'border-transparent'
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
