const PHOTOS = [
  { src: '/images/grand-opening/carousel-1.jpg', offset: 'up' as const },
  { src: '/images/grand-opening/carousel-2.jpg', offset: 'down' as const },
  { src: '/images/grand-opening/carousel-3.jpg', offset: 'up' as const },
  { src: '/images/grand-opening/carousel-4.jpg', offset: 'down' as const },
]

export default function PhotoGallery() {
  return (
    <section className="bg-[var(--color-cream)] py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="flex items-end justify-center gap-4 md:gap-8 overflow-x-auto md:overflow-visible">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`shrink-0 w-[220px] md:w-[300px] lg:w-[400px] aspect-[2/3] rounded-[20px] bg-[var(--color-purple-soft)] ${
                photo.offset === 'up' ? 'mb-10' : ''
              }`}
              style={{
                backgroundImage: `url(${photo.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
