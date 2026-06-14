"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import Link from 'next/link';
import { useSettingsStore } from '../store/useSettingsStore';

const Banners = () => {
    const { ads } = useSettingsStore();
    
    // Filter ads for home sections
    const homeAds = ads.filter(ad => ad.position.startsWith('home'));

    if (homeAds.length === 0) {
        // Fallback to static if no ads are defined
        return (
            <section className="py-5 pt-5">
                <div className="container">
                    <h3 className="text-2xl text-secondary font-semibold mb-4">Checkout the latest deals</h3>
                    <Swiper slidesPerView={3} spaceBetween={5} navigation={true} modules={[Navigation]} className="mySwiper">
                        {[1, 2, 3].map(i => (
                            <SwiperSlide key={i} className='py-3 px-2'>
                                <Link href="/products" className='item group rounded-md overflow-hidden w-full h-[20vh]'>
                                    <img src={`/banners/${i === 1 ? 'one' : i === 2 ? 'two' : 'three'}.jpg`} alt="" className='w-full h-full transition object-cover group-hover:scale-105' />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5 pt-5">
            <div className="container">
                <h3 className="text-2xl text-secondary font-semibold mb-4">Latest Offers</h3>
                <Swiper
                    slidesPerView={Math.min(homeAds.length, 3)}
                    spaceBetween={15}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    {homeAds.map((ad) => (
                        <SwiperSlide key={ad.id} className='py-3 px-2'>
                            <Link href={ad.link || "/products"} className='item group rounded-md overflow-hidden block w-full h-[25vh]'>
                                <img 
                                    src={ad.image} 
                                    alt={ad.title} 
                                    className='w-full h-full transition object-cover group-hover:scale-105' 
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

export default Banners;