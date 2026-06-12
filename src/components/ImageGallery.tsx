'use client'

import { useState } from 'react'
import Image from 'next/image'

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive]   = useState(0)
  const [lightbox, setLightbox] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Ana görsel */}
        <div
          className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#1c1008] cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[active]}
            alt={name}
            fill
            className="object-cover transition-opacity duration-200"
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-full p-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </div>

        {/* Küçük görseller */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-20 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  i === active ? 'border-[#06b6d4]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px"/>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-xl hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + images.length) % images.length) }}
              >
                ‹
              </button>
              <button
                className="absolute right-16 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % images.length) }}
              >
                ›
              </button>
            </>
          )}
          <div className="relative w-full max-w-3xl aspect-[4/3]" onClick={e => e.stopPropagation()}>
            <Image src={images[active]} alt={name} fill className="object-contain" sizes="100vw"/>
          </div>
        </div>
      )}
    </>
  )
}
