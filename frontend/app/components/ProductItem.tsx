'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import Rating from '@mui/material/Rating';
import { Button } from '@mui/material';
import { useCartStore } from '../store/useCartStore';

type Props = {
    product: any;
};

const ProductItem: React.FC<Props> = ({ product }) => {
    const addItem = useCartStore((state) => state.addItem);

    const imageUrl = product.images?.[0]?.image || "/products/placeholder.jpg";
    const categoryName = product.category?.name || "Uncategorized";

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
    };

    return (
        <div className='productItem min-h-[400px] flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-gray-100 mb-4'>
            <Link href={`/product/${product.id}`} className='group block overflow-hidden shrink-0'>
                <div className='relative w-full h-48 bg-gray-50 flex items-center justify-center'>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className='max-w-full max-h-full object-contain p-2 transition duration-300 group-hover:scale-105'
                    />
                </div>
            </Link>
            <div className='p-4 flex flex-col gap-2 flex-grow'>
                <span className='text-[12px] text-gray-400 uppercase font-semibold tracking-wider'>
                    {categoryName}
                </span>
                <Link
                    href={`/product/${product.id}`}
                    className='text-[15px] font-semibold text-secondary hover:text-primary line-clamp-2 h-11'
                >
                    {product.name}
                </Link>
                <Rating value={4.5} readOnly size="small" precision={0.5} />
                <div className='mt-auto'>
                    <div className='flex items-center gap-2 mb-3'>
                        <span className='text-lg font-bold text-red-600'>
                            AUD {product.price}
                        </span>

                        {product.old_price && (
                            <span className='text-sm text-gray-400 line-through'>
                                Rs. {product.old_price}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleAddToCart}
                        sx={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                            '&:hover': { bgcolor: 'var(--color-primary)', color: 'white', borderColor: 'var(--color-primary)' }
                        }}
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;