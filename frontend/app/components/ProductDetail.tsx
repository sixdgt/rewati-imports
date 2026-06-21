'use client';
import React, { useState, useEffect } from 'react';
import ProductDetailImage from './ProductImage';
import Rating from '@mui/material/Rating';
import QuantityBox from './QuantityBox';
import Button from '@mui/material/Button';
import { IoCartOutline } from 'react-icons/io5';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import { TextField, Box, Typography, Divider, Avatar, Alert, CircularProgress, Grid, Paper } from '@mui/material';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import api from '@/app/lib/api-client';

interface ProductDetailProps {
    product: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
    const [isActiveTab, setActiveTab] = React.useState<'description' | 'reviews'>('description');
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReview, setLoadingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const addItem = useCartStore((state) => state.addItem);
    const { isAuthenticated } = useAuthStore();
    const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        if (product?.id) {
            fetchReviews();
        }
    }, [product?.id]);

    const fetchReviews = async () => {
        if (!product?.id) return;
        try {
            const res = await api.get(`/reviews/?product=${product.id}`);
            setReviews(res.data);
        } catch (err) { console.error(err); }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) return alert('Please login to add items to wishlist');
        try {
            if (isInWishlist(product.id)) {
                const item = wishlistItems.find((i: any) => i.product === product.id);
                if (item) await removeFromWishlist(item.id);
            } else {
                await addToWishlist(product);
            }
        } catch (err) { alert('Failed to update wishlist'); }
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingReview(true);
        setReviewError('');
        setReviewSuccess('');
        try {
            await api.post('/reviews/', {
                product: product.id,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setReviewSuccess('Review submitted successfully!');
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (err: any) {
            setReviewError(err.response?.data?.[0] || 'Failed to submit review. You must purchase the product first.');
        } finally {
            setLoadingReview(false);
        }
    };

    const isProductInWishlist = isInWishlist(product.id);

    return (
        <>
            <div className='flex flex-col md:flex-row gap-10'>
                <div className='w-full md:w-1/2'>
                    <ProductDetailImage images={product.images} />
                </div>
                <div className='content w-full md:w-1/2'>
                    <h1 className='text-3xl text-secondary font-bold mb-4'>
                        {product.name}
                    </h1>

                    <div className='flex items-center gap-4 my-3'>
                        <p className='text-[18px] text-secondary font-normal flex items-center gap-3'>
                            Category: <span className='text-primary font-bold'>{product.category?.name}</span>
                        </p>
                        <Rating value={4.5} precision={0.5} readOnly size="small" />
                        <span className='text-gray-400 text-sm'>({reviews.length} Reviews)</span>
                    </div>

                    <div className='flex items-center gap-4'>
                        <div className='flex items-center justify-between gap-3 my-3'>
                            <span className='text-2xl font-bold text-red-600'>$AUD {product.price}</span>
                            {product.old_price && <span className='text-lg font-bold text-gray-400 line-through'>$AUD {product.old_price}</span>}
                        </div>
                        <p className='text-sm text-gray-600'>
                            Stock: <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `${product.stock} Items` : 'Out of Stock'}</span>
                        </p>
                    </div>

                    <p className='text-base font-normal text-gray-600 my-6 leading-7'>{product.description}</p>

                    <div className='flex items-center gap-4'>
                        <QuantityBox value={quantity} onChange={(val) => setQuantity(val)} />
                        <Button
                            variant='contained'
                            disabled={product.stock <= 0}
                            onClick={handleAddToCart}
                            sx={{ bgcolor: 'var(--color-primary)', height: 44, px: 4, fontWeight: 'bold', '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}
                            startIcon={<IoCartOutline size={20} />}
                        >
                            Add to Cart
                        </Button>

                        <Tooltip title={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"} placement="top">
                            <Button
                                variant='outlined'
                                onClick={handleAddToWishlist}
                                sx={{ 
                                    borderColor: 'var(--color-primary)', color: 'var(--color-primary)', minWidth: 44, height: 44, borderRadius: '50%',
                                    '&:hover': { bgcolor: 'var(--color-primary)', color: 'white' }
                                }}
                            >
                                {isProductInWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <section className='py-10 mt-10 border-t border-gray-200'>
                <div className='flex items-center gap-8'>
                    <span
                        className={`text-xl font-bold cursor-pointer ${isActiveTab === 'description' ? 'text-primary border-primary' : 'text-secondary border-transparent'} border-b-2 pb-1 transition-all`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </span>

                    <span
                        className={`text-xl font-bold cursor-pointer ${isActiveTab === 'reviews' ? 'text-primary border-primary' : 'text-secondary border-transparent'} border-b-2 pb-1 transition-all`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews ({reviews.length})
                    </span>
                </div>

                <div className='mt-8'>
                    {isActiveTab === 'description' && (
                        <p className='text-gray-600 leading-8 text-justify w-full lg:w-[80%] whitespace-pre-line'>
                            {product.description}
                        </p>
                    )}

                    {isActiveTab === 'reviews' && (
                        <div className='reviewSection w-full lg:w-[80%]'>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, md: 7 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Customer Reviews</Typography>
                                    <Box sx={{ mt: 3 }}>
                                        {reviews.map((rev) => (
                                            <Box key={rev.id} sx={{ mb: 4 }}>
                                                <div className='flex items-center gap-3 mb-2'>
                                                    <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 32, height: 32, fontSize: 14 }}>{rev.user_name?.[0]}</Avatar>
                                                    <div>
                                                        <Typography variant="subtitle2" fontWeight="bold">{rev.user_name}</Typography>
                                                        <Rating value={rev.rating} readOnly size="small" />
                                                    </div>
                                                    <span className='ml-auto text-xs text-gray-400'>{new Date(rev.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <Typography variant="body2" color="textSecondary" className='pl-11'>{rev.comment}</Typography>
                                                <Divider sx={{ mt: 3 }} />
                                            </Box>
                                        ))}
                                        {reviews.length === 0 && <Typography color="textSecondary">No reviews yet for this product.</Typography>}
                                    </Box>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Paper sx={{ p: 3, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="h6" fontWeight="bold" gutterBottom>Write a Review</Typography>
                                        {!isAuthenticated ? (
                                            <Typography color="textSecondary" sx={{ mt: 2 }}>Please login to write a review.</Typography>
                                        ) : (
                                            <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 2 }}>
                                                {reviewError && <Alert severity="error" sx={{ mb: 2 }}>{reviewError}</Alert>}
                                                {reviewSuccess && <Alert severity="success" sx={{ mb: 2 }}>{reviewSuccess}</Alert>}
                                                <Typography variant="body2" gutterBottom>Your Rating</Typography>
                                                <Rating 
                                                    value={newReview.rating} 
                                                    onChange={(_, val) => setNewReview({...newReview, rating: val || 5})} 
                                                    sx={{ mb: 2 }}
                                                />
                                                <TextField 
                                                    fullWidth multiline rows={4} label="Your Review" 
                                                    value={newReview.comment}
                                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                                    sx={{ mb: 2, bgcolor: 'white' }}
                                                    required
                                                />
                                                <Button 
                                                    type="submit" variant="contained" disabled={loadingReview}
                                                    sx={{ bgcolor: 'var(--color-primary)', fontWeight: 'bold', '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}
                                                >
                                                    {loadingReview ? <CircularProgress size={20} color="inherit" /> : 'Submit Review'}
                                                </Button>
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ProductDetail;