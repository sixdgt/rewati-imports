'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaArrowRightLong } from "react-icons/fa6";
import api from '../lib/api';
import { Box, CircularProgress } from '@mui/material';

const CatSlider: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories/');
                setCategories(Array.isArray(response.data) ? response.data : []);
                console.log(response.data);
            } catch (err) {
                console.error('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress size={30} />
            </Box>
        );
    }

    return (
        <div className='py-5'>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-5">
                    <h2 className='text-[22px] font-semibold text-secondary'>Shop by Category</h2>
                    <Link href="/products" className='text-secondary font-medium hover:text-primary transition-colors duration-200 flex items-center gap-1'>
                        View All <FaArrowRightLong size={18} className="inline-block ml-1" />
                    </Link>
                </div>
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    spaceBetween={20}
                    className='mySwiper'
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 5 },
                        1024: { slidesPerView: 8 },
                        1280: { slidesPerView: 10 },
                    }}
                    >
                    {categories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <Link href={`/products?category=${category.slug}`} className='group block'>
                                <div className="bg-white p-4 w-full aspect-square rounded-md shadow-sm border border-gray-100 flex items-center justify-center transition group-hover:border-primary group-hover:shadow-md">
                                    <img 
                                        src={category.image || "/categories/placeholder.png"} 
                                        alt={category.name} 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h4 className='text-[14px] font-semibold text-center mt-3 text-secondary group-hover:text-primary transition-colors truncate'>
                                    {category.name}
                                </h4>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default CatSlider;