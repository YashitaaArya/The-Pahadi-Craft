import { motion } from 'framer-motion';
import { useMemo, useState, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDriveImage } from '../utils/driveImage';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  showThumbnails?: boolean;
  onImageClick?: () => void;
}

const ProductImageCarousel = ({
  images,
  alt,
  className,
  showThumbnails = true,
  onImageClick,
}: ProductImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedImages = useMemo(
    () => images.map(img => getDriveImage(img)),
    [images],
  );

  const total = normalizedImages.length;
  const activeImage = normalizedImages[activeIndex] || normalizedImages[0] || '';

  const handlePrev = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveIndex(index => (index - 1 + total) % total);
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActiveIndex(index => (index + 1) % total);
  };

  if (!total) {
    return <div className={`bg-gray-100 ${className || ''}`} />;
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className || ''}`} onClick={onImageClick}>
      <motion.img
        key={`${activeImage}-${activeIndex}`}
        src={activeImage}
        alt={alt}
        className="w-full h-full object-cover transition duration-300"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white shadow-lg"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white shadow-lg"
          >
            <ChevronRight size={18} />
          </button>

          {showThumbnails && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-2 py-1">
              {normalizedImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`h-2 w-2 rounded-full transition ${idx === activeIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductImageCarousel;
