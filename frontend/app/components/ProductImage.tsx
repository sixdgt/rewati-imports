'use client';
import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

interface ProductImageProps {
  images?: { id: number; image: string }[];
}

const ProductDetailImage: React.FC<ProductImageProps> = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const thumbsSwiperRef = useRef<SwiperType | null>(null);

  // If no images, use a placeholder
  const displayImages = images.length > 0 ? images : [{ id: 0, image: '/products/placeholder.jpg' }];

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
    mainSwiperRef.current?.slideTo(index);
    thumbsSwiperRef.current?.slideTo(index);
  };

  return (
    <div className="productImageGallery w-full">
      <div className="mainImageWrapper border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Swiper
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          className="mainSwiper"
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {displayImages.map((img, idx) => (
            <SwiperSlide key={img.id || idx}>
              <div className="flex justify-center items-center h-[500px]">
                <InnerImageZoom 
                  src={img.image} 
                  zoomType='hover' 
                  zoomScale={1}
                  className="max-h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {displayImages.length > 1 && (
        <div className="thumbnailWrapper mt-4">
          <Swiper
            onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
            className="thumbSwiper"
            slidesPerView={5}
            spaceBetween={10}
          >
            {displayImages.map((img, idx) => (
              <SwiperSlide key={img.id || idx}>
                <div
                  className={`thumbItem border rounded-md p-1 cursor-pointer transition-all h-20 flex items-center justify-center bg-white ${
                    activeIndex === idx
                      ? 'border-primary ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => handleThumbClick(idx)}
                >
                  <img
                    src={img.image}
                    className="max-w-full max-h-full object-contain"
                    alt={`Thumbnail ${idx}`}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductDetailImage;