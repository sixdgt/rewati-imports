'use client';

import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, TextField, Button, Divider, Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem } from '@mui/material';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip_code: '',
    payment_method: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number>('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
      
      // Fetch addresses
      setLoadingAddresses(true);
      api.get('/auth/addresses/').then(res => {
        setAddresses(res.data);
        const defaultAddress = res.data.find((a: any) => a.is_default);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setFormData(prev => ({
            ...prev,
            address: defaultAddress.address || '',
            city: defaultAddress.city || '',
            zip_code: defaultAddress.zip_code || '',
          }));
        } else if (res.data.length > 0) {
          // Fallback to first address if no default
          setSelectedAddressId(res.data[0].id);
          setFormData(prev => ({
            ...prev,
            address: res.data[0].address || '',
            city: res.data[0].city || '',
            zip_code: res.data[0].zip_code || '',
          }));
        }
      }).catch(err => {
        console.error("Failed to fetch address", err);
      }).finally(() => {
        setLoadingAddresses(false);
      });
    }
  }, [user, isAuthenticated, router]);

  const handleAddressSelectChange = (e: any) => {
    const addrId = e.target.value;
    setSelectedAddressId(addrId);
    const selected = addresses.find(a => a.id === addrId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        address: selected.address || '',
        city: selected.city || '',
        zip_code: selected.zip_code || '',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        ...formData,
        order_items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };
      
      const response = await api.post('/orders/', orderData);
      clearCart();
      router.push(`/dashboard/customer?order_success=true&id=${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty.</Typography>
        <Button variant="contained" sx={{ mt: 2, bgcolor: '#233a95' }} onClick={() => router.push('/')}>Go Shopping</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Checkout</Typography>
      <Box component="form" onSubmit={handlePlaceOrder}>
        <Grid container spacing={4}>
          {/* Shipping Info */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Shipping Information</Typography>
              
              {addresses.length === 0 && !loadingAddresses && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  You do not have any saved shipping addresses in your profile. You must add at least one shipping address in your profile dashboard before you can place an order.
                  <Box sx={{ mt: 1.5 }}>
                    <Button variant="contained" color="warning" size="small" onClick={() => router.push('/dashboard/customer?tab=3')}>
                      Add Address in Dashboard
                    </Button>
                  </Box>
                </Alert>
              )}

              {addresses.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="saved-address-label">Select Saved Address</InputLabel>
                    <Select
                      labelId="saved-address-label"
                      value={selectedAddressId}
                      onChange={handleAddressSelectChange}
                      label="Select Saved Address"
                      required
                    >
                      {addresses.map((addr) => (
                        <MenuItem key={addr.id} value={addr.id}>
                          {addr.title} ({addr.address}, {addr.city})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth name="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} disabled={addresses.length === 0} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth name="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={addresses.length === 0} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} disabled={addresses.length === 0} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField required fullWidth name="address" label="Shipping Address" multiline rows={2} value={formData.address} onChange={handleChange} slotProps={{ htmlInput: { readOnly: addresses.length > 0 } }} disabled={addresses.length === 0} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth name="city" label="City" value={formData.city} onChange={handleChange} slotProps={{ htmlInput: { readOnly: addresses.length > 0 } }} disabled={addresses.length === 0} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField required fullWidth name="zip_code" label="Zip / Postal Code" value={formData.zip_code} onChange={handleChange} slotProps={{ htmlInput: { readOnly: addresses.length > 0 } }} disabled={addresses.length === 0} />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', color: 'black' }}>Payment Method</FormLabel>
                  <RadioGroup name="payment_method" value={formData.payment_method} onChange={handleChange}>
                    <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery (COD)" />
                    <FormControlLabel value="Online" control={<Radio disabled />} label="Online Payment (Coming Soon)" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">Order Summary</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                {items.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.name} x {item.quantity}</Typography>
                    <Typography variant="body2">Rs. {item.price * item.quantity}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">Rs. {getSubtotal()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="error">Rs. {getSubtotal()}</Typography>
              </Box>

              {/* Note about minimum order amount */}
              <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 1, border: '1px dashed #ccc' }}>
                <Typography variant="caption" color="textSecondary" display="block">
                  <strong>Note:</strong> The minimum order total must be Rs. 13,300 ($100 USD) to place an order.
                </Typography>
              </Box>

              {getSubtotal() < 13300 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Your order total is Rs. {getSubtotal()}, which is less than the minimum required total of Rs. 13,300 ($100 USD). Please add more items to your cart.
                </Alert>
              )}
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5, bgcolor: '#233a95', '&:hover': { bgcolor: '#1a2b70' } }} disabled={loading || getSubtotal() < 13300 || addresses.length === 0 || loadingAddresses}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
