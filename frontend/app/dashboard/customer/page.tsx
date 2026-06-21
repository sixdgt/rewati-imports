'use client';

import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, Tabs, Tab, TextField, Alert, Chip, Divider, 
  IconButton, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, 
  DialogActions, Card, CardContent, CardActions, CircularProgress, 
  InputAdornment, LinearProgress, Skeleton, TablePagination
} from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import api from '@/app/lib/api-client';
import { 
  IoHeartOutline, IoTrashOutline, IoLocationOutline, IoPersonOutline, 
  IoBagHandleOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline,
  IoAddCircleOutline, IoCloseOutline
} from 'react-icons/io5';

// --- Interfaces ---
interface IProduct {
  id: number;
  name: string;
  price: number;
  images: { image: string }[];
}

interface IOrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
}

interface IOrder {
  id: number;
  created_at: string;
  status: string;
  total_amount: string;
  shipping_cost: string;
  address: string;
  city: string;
  zip_code: string;
  items: IOrderItem[];
}

interface IAddress {
  id: number;
  title: string;
  address: string;
  city: string;
  zip_code: string;
  is_default: boolean;
}

// --- Main Component ---
export default function CustomerDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, fetchProfile } = useAuthStore();
  
  // Tabs State
  const [activeTab, setActiveTab] = useState(0);
  
  // Data States
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  
  // Loading States
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms State
  const [profileData, setProfileData] = useState({ full_name: '', phone: '', username: '', address: '' });
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Orders Pagination State
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  
  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<IAddress>>({ title: '', address: '', city: '', zip_code: '', is_default: false });

  // Feedback State
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Initialize tab from URL query param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        const tabIndex = parseInt(tabParam, 10);
        if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 4) {
          setActiveTab(tabIndex);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        username: user.username || '',
        address: user.address || ''
      });
    }
    fetchOrders();
    fetchWishlist();
    fetchAddresses();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/');
      setOrders(res.data);
    } catch (err) { console.error("Error fetching orders:", err); }
    finally { setLoadingOrders(false); }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist/');
      setWishlist(res.data);
    } catch (err) { console.error("Error fetching wishlist:", err); }
    finally { setLoadingWishlist(false); }
  };

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/auth/addresses/');
      setAddresses(res.data);
    } catch (err) { console.error("Error fetching addresses:", err); }
    finally { setLoadingAddresses(false); }
  };

  // --- Handlers ---
  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
    setSuccess(''); setError('');
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setSuccess(''); setError('');
    try {
      await api.patch('/auth/profile/', profileData);
      await fetchProfile();
      setSuccess('Profile updated successfully!');
    } catch (err) { setError('Failed to update profile'); } 
    finally { setActionLoading(false); }
  };

  // --- Security Helpers ---
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { text: '', color: 'transparent', progress: 0 };
    let score = 0;
    if (pw.length > 7) score += 1;
    if (pw.length > 10) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    if (score <= 2) return { text: 'Weak', color: 'error.main', progress: 30 };
    if (score <= 4) return { text: 'Medium', color: 'warning.main', progress: 60 };
    return { text: 'Strong', color: 'success.main', progress: 100 };
  };
  const pwStrength = getPasswordStrength(passwordData.new_password);
  const pwMatch = passwordData.new_password && passwordData.confirm_password && passwordData.new_password === passwordData.confirm_password;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwMatch) {
      setError('New passwords do not match');
      return;
    }
    setActionLoading(true); setSuccess(''); setError('');
    try {
      await api.post('/auth/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) { setError(err.response?.data?.error || 'Failed to change password'); } 
    finally { setActionLoading(false); }
  };

  // --- Wishlist Handlers ---
  const removeFromWishlist = async (id: number) => {
    try {
      await api.delete(`/wishlist/${id}/`);
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (err) { alert('Failed to remove item'); }
  };

  // --- Address Handlers ---
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true); setSuccess(''); setError('');
    try {
      if (currentAddress.id) {
        await api.patch(`/auth/addresses/${currentAddress.id}/`, currentAddress);
        setSuccess('Address updated!');
      } else {
        await api.post('/auth/addresses/', currentAddress);
        setSuccess('New address added!');
      }
      fetchAddresses();
      setAddressModalOpen(false);
    } catch (err) { setError('Failed to save address.'); }
    finally { setActionLoading(false); }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/auth/addresses/${id}/`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) { alert('Failed to delete address'); }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await api.patch(`/auth/addresses/${id}/`, { is_default: true });
      fetchAddresses();
    } catch (err) { alert('Failed to update default address'); }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        My Account
      </Typography>

      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mt: 1 }}>
        {/* --- SIDEBAR TABS --- */}
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Tabs
              orientation={isMobile ? 'horizontal' : 'vertical'}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              value={activeTab}
              onChange={handleTabChange}
              sx={{ 
                borderRight: isMobile ? 0 : 1, 
                borderBottom: isMobile ? 1 : 0,
                borderColor: 'divider', 
                minHeight: isMobile ? 'auto' : 500,
                '& .MuiTab-root': { py: 2.5, px: 3, justifyContent: 'flex-start', alignItems: 'center', transition: 'all 0.2s' }
              }}
            >
              <Tab icon={<IoPersonOutline size={20} />} iconPosition="start" label="Profile Info" />
              <Tab icon={<IoBagHandleOutline size={20} />} iconPosition="start" label="My Orders" />
              <Tab icon={<IoHeartOutline size={20} />} iconPosition="start" label="Wishlist" />
              <Tab icon={<IoLocationOutline size={20} />} iconPosition="start" label="Addresses" />
              <Tab icon={<IoLockClosedOutline size={20} />} iconPosition="start" label="Security" />
            </Tabs>
          </Paper>
        </Grid>
 
        {/* --- MAIN CONTENT PANELS --- */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Paper sx={{ p: { xs: 2, md: 4 }, minHeight: 500, transition: 'opacity 0.3s ease' }}>
            
            {/* 0. PROFILE TAB */}
            {activeTab === 0 && (
              <Box component="form" onSubmit={handleProfileUpdate}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Personal Information</Typography>
                <Divider sx={{ mb: 3 }} />
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Full Name" value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Username" value={profileData.username} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} required />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Phone Number" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email Address" value={user?.email || ''} InputProps={{ readOnly: true }} disabled helperText="Email address cannot be changed." />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Primary Address" value={profileData.address} onChange={(e) => setProfileData({ ...profileData, address: e.target.value })} multiline rows={2} helperText="Your primary profile address." />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" disabled={actionLoading} sx={{ bgcolor: 'var(--color-primary)', px: 4, py: 1.2, '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}>
                      {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* 1. ORDERS TAB */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Order History</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {loadingOrders ? (
                  <Box sx={{ mt: 2 }}>{[1,2,3].map(i => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)}</Box>
                ) : orders.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <IoBagHandleOutline size={60} color="#ccc" />
                    <Typography variant="h6" color="textSecondary" mt={2}>You haven't placed any orders yet.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ overflowX: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Order ID</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.slice(ordersPage * ordersPerPage, ordersPage * ordersPerPage + ordersPerPage).map((order) => (
                          <TableRow key={order.id} hover>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Chip label={order.status} size="small" 
                                color={order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'primary'} />
                            </TableCell>
                            <TableCell>$AUD {order.total_amount}</TableCell>
                            <TableCell align="right">
                              <Button size="small" variant="outlined" onClick={() => setSelectedOrder(order)}>View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 20]}
                      component="div"
                      count={orders.length}
                      rowsPerPage={ordersPerPage}
                      page={ordersPage}
                      onPageChange={(_, newPage) => setOrdersPage(newPage)}
                      onRowsPerPageChange={(event) => {
                        setOrdersPerPage(parseInt(event.target.value, 10));
                        setOrdersPage(0);
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {/* 2. WISHLIST TAB */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>My Wishlist</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {loadingWishlist ? (
                  <Box sx={{ mt: 2 }}>{[1,2].map(i => <Skeleton key={i} height={100} sx={{ mb: 2 }} />)}</Box>
                ) : wishlist.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <IoHeartOutline size={60} color="#ccc" />
                    <Typography variant="h6" color="textSecondary" mt={2}>Your wishlist is empty.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {wishlist.map((item) => (
                      <Grid size={{ xs: 12 }} key={item.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: '1px solid #eee', borderRadius: 2, transition: '0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                          <img src={item.product_details.images?.[0]?.image || '/products/placeholder.jpg'} alt="" style={{ width: 60, height: 60, objectFit: 'contain' }} />
                          <Box sx={{ ml: 2, flexGrow: 1 }}>
                            <Typography fontWeight="bold">{item.product_details.name}</Typography>
                            <Typography color="primary">$AUD {item.product_details.price}</Typography>
                          </Box>
                          <IconButton onClick={() => removeFromWishlist(item.id)} color="error"><IoTrashOutline /></IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* 3. ADDRESSES TAB */}
            {activeTab === 3 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">Saved Addresses</Typography>
                  <Button startIcon={<IoAddCircleOutline />} variant="contained" sx={{ bgcolor: 'var(--color-primary)' }} onClick={() => { setCurrentAddress({ title: '', address: '', city: '', zip_code: '', is_default: false }); setAddressModalOpen(true); }}>Add New</Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {loadingAddresses ? (
                  <Grid container spacing={2}>{[1,2].map(i => <Grid size={{ xs: 12, sm: 6 }} key={i}><Skeleton height={150} /></Grid>)}</Grid>
                ) : addresses.length === 0 ? (
                  <Box textAlign="center" py={5}>
                    <IoLocationOutline size={60} color="#ccc" />
                    <Typography variant="h6" color="textSecondary" mt={2}>You haven't saved any addresses yet.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {addresses.map(addr => (
                      <Grid size={{ xs: 12, sm: 6 }} key={addr.id}>
                        <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.2s', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' } }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography fontWeight="bold">{addr.title}</Typography>
                              {addr.is_default && <Chip label="Default" size="small" color="primary" />}
                            </Box>
                            <Typography variant="body2" color="textSecondary">{addr.address}</Typography>
                            <Typography variant="body2" color="textSecondary">{addr.city}, {addr.zip_code}</Typography>
                          </CardContent>
                          <CardActions sx={{ borderTop: '1px solid #eee', px: 2, pb: 1 }}>
                            <Button size="small" onClick={() => { setCurrentAddress(addr); setAddressModalOpen(true); }}>Edit</Button>
                            <Button size="small" color="error" onClick={() => handleDeleteAddress(addr.id)}>Delete</Button>
                            {!addr.is_default && (
                              <Button size="small" sx={{ ml: 'auto' }} onClick={() => handleSetDefaultAddress(addr.id)}>Set Default</Button>
                            )}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* 4. SECURITY TAB */}
            {activeTab === 4 && (
              <Box component="form" onSubmit={handleChangePassword}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Security & Password</Typography>
                <Divider sx={{ mb: 3 }} />
                
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Current Password" type={showPassword ? 'text' : 'password'} value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} required 
                      InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}</IconButton></InputAdornment> }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="New Password" type={showPassword ? 'text' : 'password'} value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} required />
                    {passwordData.new_password && (
                      <Box mt={1}>
                        <LinearProgress variant="determinate" value={pwStrength.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: pwStrength.color } }} />
                        <Typography variant="caption" sx={{ color: pwStrength.color, fontWeight: 'bold' }}>Strength: {pwStrength.text}</Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Confirm New Password" type={showPassword ? 'text' : 'password'} value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} required 
                      error={Boolean(passwordData.confirm_password && !pwMatch)} helperText={passwordData.confirm_password && !pwMatch ? 'Passwords do not match' : ''} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" disabled={actionLoading || !pwMatch} sx={{ bgcolor: 'var(--color-primary)', px: 4, py: 1.2, '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}>
                      {actionLoading ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

          </Paper>
        </Grid>
      </Grid>

      {/* --- ORDER DETAILS MODAL --- */}
      <Dialog open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8f9fa' }}>
              <Typography variant="h6" fontWeight="bold" component="span">Order Details #{selectedOrder.id}</Typography>
              <IconButton onClick={() => setSelectedOrder(null)}><IoCloseOutline /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Order Date</Typography>
                  <Typography mb={2}>{new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                  <Chip label={selectedOrder.status} size="small" color={selectedOrder.status === 'Delivered' ? 'success' : 'primary'} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" color="textSecondary">Shipping Address</Typography>
                  <Typography>{selectedOrder.address}</Typography>
                  <Typography>{selectedOrder.city}, {selectedOrder.zip_code}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>Items Purchased</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">$AUD {item.price}</TableCell>
                      <TableCell align="right">$AUD {(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right"><strong>Shipping</strong></TableCell>
                    <TableCell align="right">$AUD {selectedOrder.shipping_cost}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right"><Typography variant="h6">Total</Typography></TableCell>
                    <TableCell align="right"><Typography variant="h6" color="primary">$AUD {selectedOrder.total_amount}</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
              <Button onClick={() => setSelectedOrder(null)} variant="outlined">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* --- ADDRESS MODAL --- */}
      <Dialog open={addressModalOpen} onClose={() => setAddressModalOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddressSubmit}>
          <DialogTitle>{currentAddress.id ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Address Title (e.g., Home, Office)" value={currentAddress.title} onChange={e => setCurrentAddress({...currentAddress, title: e.target.value})} required />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Street Address" multiline rows={2} value={currentAddress.address} onChange={e => setCurrentAddress({...currentAddress, address: e.target.value})} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="City" value={currentAddress.city} onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Zip Code" value={currentAddress.zip_code} onChange={e => setCurrentAddress({...currentAddress, zip_code: e.target.value})} required />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAddressModalOpen(false)} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Address'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </Container>
  );
}
