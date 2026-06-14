"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Navigation, Autoplay } from 'swiper/modules';
import { useSettingsStore } from '../store/useSettingsStore';
import Link from 'next/link';

const HomeSlider: React.FC = () => {
    const { ads } = useSettingsStore();
    const safeAds = Array.isArray(ads) ? ads : [];
    const topAds = safeAds.filter(ad => ad.position === 'home_top');

    if (topAds.length === 0) {
        return (
            <div className='homeSlider'>
                <div className="container">
                    <Swiper navigation={true} autoplay={{ delay: 3000 }} modules={[Navigation, Autoplay]} className='mySwiper'>
                        {[1, 2, 3, 4, 5].map(i => (
                            <SwiperSlide key={i}>
                                <div className="item w-full h-[60vh] rounded-xl overflow-hidden">
                                    <img src={`/sliders/${i === 1 ? 'one' : i === 2 ? 'two' : i === 3 ? 'three' : i === 4 ? 'four' : 'five'}.jpg`} alt="" className="w-full h-full object-cover" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        );
    }

    return (
        <div className='homeSlider'>
            <div className="container">
                <Swiper
                    navigation={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    modules={[Navigation, Autoplay]}
                    className='mySwiper'
                >
                    {topAds.map((ad) => (
                        <SwiperSlide key={ad.id}>
                            <Link href={ad.link || "/products"} className="item block w-full h-[60vh] rounded-xl overflow-hidden">
                                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default HomeSlider;