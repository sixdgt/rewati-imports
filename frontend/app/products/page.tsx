'use client';
import React, { Suspense, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
import ProductItem from '../components/ProductItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import api from '../lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

const ProductPageInner: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const rating = searchParams.get('rating');
    const sort = searchParams.get('sort') || 'newest';

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = '/products/?';
                if (query) url += `search=${query}&`;
                if (category) url += `category=${category}&`;
                if (min_price) url += `min_price=${min_price}&`;
                if (max_price) url += `max_price=${max_price}&`;
                if (rating) url += `rating=${rating}&`;
                if (sort) url += `sort=${sort}&`;
                
                const response = await api.get(url);
                setProducts(response.data);
            } catch (err) {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query, category, min_price, max_price, rating, sort]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (sortValue?: string) => {
        if (sortValue) {
            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            currentParams.set('sort', sortValue);
            router.push(`/products?${currentParams.toString()}`);
        }
        setAnchorEl(null);
    };

    const getSortLabel = () => {
        if (sort === 'price_asc') return 'Price: Low to High';
        if (sort === 'price_desc') return 'Price: High to Low';
        return 'Newest';
    };

    return (
        <div className='py-5 bg-white'>
            <div className='container mx-auto px-4 flex flex-col lg:flex-row gap-8'>
                <div className='lg:w-1/4'>
                    <Sidebar />
                </div>
                <div className='lg:w-3/4'>
                    <div className='top-strip w-full bg-[#f1f1f1] p-3 rounded-md flex items-center justify-between border border-gray-200'>
                        <span className='text-secondary text-sm font-semibold'>
                            {loading ? 'Searching...' : `Found ${products.length} results ${query ? `for "${query}"` : ''}`}
                        </span>
                        <div className='flex items-center gap-3'>
                            <span className='text-secondary text-sm font-semibold'>Sort By:</span>
                            <div className='relative'>
                                <Button 
                                    className='bg-white! border! border-gray-300! capitalize! text-secondary! py-1! px-4! h-9' 
                                    onClick={handleClick}
                                >
                                    {getSortLabel()}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={() => handleClose()}
                                >
                                    <MenuItem onClick={() => handleClose('newest')}>Newest</MenuItem>
                                    <MenuItem onClick={() => handleClose('price_asc')}>Price: Low to High</MenuItem>
                                    <MenuItem onClick={() => handleClose('price_desc')}>Price: High to Low</MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                            <CircularProgress />
                        </Box>
                    ) : products.length === 0 ? (
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary">No products found matching your search.</Typography>
                        </Box>
                    ) : (
                        <div className='productWrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6'>
                            {products.map((product) => (
                                <ProductItem key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    
                    {!loading && products.length > 0 && (
                        <div className='paginationWrapper w-full flex items-center justify-center mt-10'>
                            <Stack spacing={2}>
                                <Pagination count={1} showFirstButton showLastButton color="primary" />
                            </Stack>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ProductPage: React.FC = () => (
    <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
        </Box>
    }>
        <ProductPageInner />
    </Suspense>
);

export default ProductPage;