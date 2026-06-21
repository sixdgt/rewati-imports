'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Grid, MenuItem, Alert, CircularProgress } from '@mui/material';
import api from '@/app/lib/api-client';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    old_price: '',
    stock: '',
    is_featured: false,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, (formData as any)[key]);
    });

    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('uploaded_images', images[i]);
      }
    }

    try {
      await api.post('/products/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/dashboard/admin/products');
    } catch (err: any) {
      setError('Failed to add product. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Add New Product</Typography>
      
      <Paper sx={{ p: 4, mt: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                required fullWidth name="name" label="Product Name" 
                value={formData.name} onChange={handleChange} 
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select required fullWidth name="category_id" label="Category" 
                value={formData.category_id} onChange={handleChange}
              >
                {categories.map((cat) => (
                   <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
 
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField 
                required fullWidth name="price" label="Price (Rs.)" type="number" 
                value={formData.price} onChange={handleChange} 
              />
            </Grid>
 
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField 
                fullWidth name="stock" label="Stock" type="number" 
                value={formData.stock} onChange={handleChange} 
              />
            </Grid>
 
            <Grid size={{ xs: 12 }}>
              <TextField 
                required fullWidth name="description" label="Description" 
                multiline rows={4} value={formData.description} onChange={handleChange} 
              />
            </Grid>
 
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>Product Images</Typography>
              <input 
                type="file" multiple accept="image/*" 
                onChange={handleImageChange} 
              />
            </Grid>
 
            <Grid size={{ xs: 12 }}>
              <Button 
                type="submit" variant="contained" size="large" 
                disabled={loading} sx={{ bgcolor: '#233a95', py: 1.5, px: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Product'}
              </Button>
              <Button 
                variant="text" sx={{ ml: 2 }} 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
