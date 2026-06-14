'use client';

import ProductDetail from '@/app/components/ProductDetail';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/app/lib/api';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${productId}/`);
                setProduct(response.data);
            } catch (err) {
                setError('Product not found');
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5">{error || 'Product not found'}</Typography>
            </Container>
        );
    }

    return (
        <section className='py-10 bg-white'>
            <div className='container mx-auto px-4'>
                <ProductDetail product={product} />
            </div>
        </section>
    );
}

export default ProductDetailPage;