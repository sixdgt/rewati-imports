'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, CircularProgress, IconButton, Paper } from '@mui/material';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { IoTrashOutline, IoCartOutline } from 'react-icons/io5';
import Link from 'next/link';

export default function WishlistPage() {
  const { items: wishlist, loading, fetchWishlist, removeItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
  };

  if (loading && wishlist.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>My Wishlist</Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        {wishlist.length} items in your wishlist
      </Typography>

      {wishlist.length === 0 ? (
        <Paper sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Your wishlist is empty!</Typography>
          <Button component={Link} href="/products" variant="contained" sx={{ mt: 2, bgcolor: '#233a95' }}>
            Browse Products
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlist.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Paper sx={{ p: 2, position: 'relative' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 200, mb: 2 }}>
                  <img 
                    src={item.product_details.images?.[0]?.image || '/products/placeholder.jpg'} 
                    alt={item.product_details.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" noWrap>
                  {item.product_details.name}
                </Typography>
                <Typography color="primary" fontWeight="bold" variant="h6" sx={{ mt: 1 }}>
                  Rs. {item.product_details.price}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button 
                    fullWidth variant="contained" size="small"
                    startIcon={<IoCartOutline />}
                    onClick={() => handleAddToCart(item.product_details)}
                    sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton color="error" onClick={() => removeItem(item.id)}>
                    <IoTrashOutline />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
