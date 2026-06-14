'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton, CircularProgress, Alert } from '@mui/material';
import { IoAddOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';
import api from '../../../lib/api';
import Link from 'next/link';

export default function AdminProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}/`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Product Management</Typography>
        <Button 
          component={Link} 
          href="/dashboard/admin/products/add" 
          variant="contained" 
          startIcon={<IoAddOutline />}
          sx={{ bgcolor: '#233a95' }}
        >
          Add Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f1f1' }}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <img 
                    src={product.images?.[0]?.image || '/products/placeholder.jpg'} 
                    alt="" 
                    style={{ width: 40, height: 40, objectFit: 'contain' }} 
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{product.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>Rs. {product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell align="right">
                  <IconButton component={Link} href={`/dashboard/admin/products/edit/${product.id}`} color="primary">
                    <IoPencilOutline />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <IoTrashOutline />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
