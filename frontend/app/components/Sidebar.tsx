'use client';
import { Button, CircularProgress, Box } from '@mui/material';
import React, { Suspense, useState, useEffect } from 'react';
import { LiaAngleDownSolid } from 'react-icons/lia';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Collapse } from 'react-collapse';
import { TfiAngleUp } from 'react-icons/tfi';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { IoIosStar } from 'react-icons/io';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
    { name: "Fruits & Vegetables", slug: "fruits-vegetables" },
    { name: "Meat & Seafood", slug: "meat-seafood" },
    { name: "Breakfast & Cereal", slug: "breakfast-cereal" },
    { name: "Bakery & Breads", slug: "bakery-breads" },
    { name: "Beverages", slug: "beverages" },
    { name: "Frozen Foods", slug: "frozen-foods" },
    { name: "Grocery & Staples", slug: "grocery-staples" },
    { name: "Biscuits & Cookies", slug: "biscuits-cookies" },
    { name: "Dairy Products", slug: "dairy-products" }
];

const SidebarInner: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isOpenCatFilter, setIsOpenCatFilter] = useState(true);
    const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);

    // Filter states
    const currentCategory = searchParams.get('category') || '';
    const currentMinPrice = Number(searchParams.get('min_price')) || 0;
    const currentMaxPrice = Number(searchParams.get('max_price')) || 30000;
    const currentRating = searchParams.get('rating') || '';

    const [price, setPrice] = useState<[number, number]>([currentMinPrice, currentMaxPrice]);

    // Sync price state when URL changes externally
    useEffect(() => {
        setPrice([currentMinPrice, currentMaxPrice]);
    }, [currentMinPrice, currentMaxPrice]);

    const updateParams = (key: string, value: string | null) => {
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        if (value) {
            currentParams.set(key, value);
        } else {
            currentParams.delete(key);
        }
        router.push(`/products?${currentParams.toString()}`);
    };

    const handleCategoryChange = (slug: string) => {
        updateParams('category', currentCategory === slug ? null : slug);
    };

    const handleRatingChange = (ratingStr: string) => {
        updateParams('rating', currentRating === ratingStr ? null : ratingStr);
    };

    const handlePriceChange = (newPrice: [number, number]) => {
        setPrice(newPrice);
    };

    // Debounce price updates to URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Only update if changed
            if (price[0] !== currentMinPrice || price[1] !== currentMaxPrice) {
                const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
                currentParams.set('min_price', price[0].toString());
                currentParams.set('max_price', price[1].toString());
                router.push(`/products?${currentParams.toString()}`);
            }
        }, 800);
        return () => clearTimeout(timeoutId);
    }, [price, currentMinPrice, currentMaxPrice, router, searchParams]);


    return (
        <aside className='sticky top-38 flex flex-col gap-5'>
            <div className='box mb-2'>
                <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-[18px] font-semibold text-secondary'>
                        Shop By Category
                    </h3>
                    <Button className='min-w-7! w-7! h-7! rounded-full! hover:bg-primary! hover:text-white! text-primary! border! border-primary!' onClick={() => setIsOpenCatFilter(!isOpenCatFilter)}>
                       { isOpenCatFilter ? <TfiAngleUp size={20} /> : <LiaAngleDownSolid size={20} /> }
                    </Button>
                </div>
                <Collapse isOpened={isOpenCatFilter}>
                    <div className="scroll overflow-scroll max-h-70 text-secondary">
                        <FormGroup>
                            {CATEGORIES.map(cat => (
                                <FormControlLabel 
                                    key={cat.slug}
                                    control={<Checkbox checked={currentCategory === cat.slug} onChange={() => handleCategoryChange(cat.slug)} />} 
                                    label={cat.name} 
                                />
                            ))}
                        </FormGroup>
                    </div>
                </Collapse>
            </div>

            <div className='box'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-[18px] font-semibold text-secondary'>
                        Filter By Price
                    </h3>
                </div>

                <RangeSlider
                    value={price}
                    onInput={handlePriceChange}
                    min={0}
                    max={60000}
                    step={100} 
                />

                <div className='flex items-center justify-between mt-4'>
                    <span className='text-secondary font-medium'>Rs. {price[0]}</span>
                    <span className='text-secondary font-medium'>Rs. {price[1]}</span>
                </div>
            </div>

            <div className='box mb-2'>
                <div className='flex items-center justify-between mb-2'>
                    <h3 className='text-[18px] font-semibold text-secondary'>
                        Filter By Rating
                    </h3>
                    <Button className='min-w-7! w-7! h-7! rounded-full! hover:bg-primary! hover:text-white! text-primary! border! border-primary!' onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}>
                       { isOpenRatingFilter ? <TfiAngleUp size={20} /> : <LiaAngleDownSolid size={20} /> }
                    </Button>
                </div>
                <Collapse isOpened={isOpenRatingFilter}>
                    <div className="scroll overflow-scroll max-h-70 text-secondary ratingFilter">
                        <div className='flex flex-col items-center'>
                            {[5, 4, 3, 2, 1].map(starCount => (
                                <div key={starCount} className='item flex items-center w-full'>
                                    <Checkbox 
                                        checked={currentRating === starCount.toString()} 
                                        onChange={() => handleRatingChange(starCount.toString())} 
                                    />
                                    <div className='flex items-center gap-1'>
                                        {Array.from({ length: starCount }).map((_, i) => (
                                            <IoIosStar key={i} size={18} className='text-[#ffc107]'/>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Collapse>
            </div>
        </aside>
    );
}

const Sidebar: React.FC = () => (
    <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
        </Box>
    }>
        <SidebarInner />
    </Suspense>
);

export default Sidebar;