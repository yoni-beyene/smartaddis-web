import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mediaUrl } from '../api/parks.api';

interface Image {
  id: string;
  url: string;
  type: string;
}

interface ImageCarouselProps {
  images: Image[];
  title: string;
}

export default function ImageCarousel({ images, title }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const imageList = images.filter((m) => m.type === 'IMAGE');

  useEffect(() => {
    if (!isAutoPlay || imageList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, imageList.length]);

  if (!imageList.length) {
    return (
      <div className="h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center text-8xl">
        🌳
      </div>
    );
  }

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(idx);
  };

  return (
    <div className="mb-8">
      <div
        className="relative h-72 rounded-2xl overflow-hidden bg-gray-200 group"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Main image */}
        <img
          src={mediaUrl(imageList[currentIndex].url)}
          alt={`${title} ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Navigation buttons */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-900" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-900" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-medium">
              {currentIndex + 1} / {imageList.length}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 right-3 flex gap-1">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
