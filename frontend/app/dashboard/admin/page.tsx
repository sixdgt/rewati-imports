'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({ total_orders: 0, total_revenue: 0, total_products: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || (user && !user.is_staff)) {
      // For now, if we don't have user yet, we wait. If user exists and not staff, redirect.
      if (user && !user.is_staff) router.push('/');
    }
    fetchDashboardData();
  }, [user, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await api.get('/orders/'); // In a real app, use a dedicated stats endpoint
      setRecentOrders(ordersRes.data.slice(0, 5));
      const productsRes = await api.get('/products/');
      
      const totalRevenue = ordersRes.data.reduce((acc: number, curr: any) => acc + parseFloat(curr.total_amount), 0);
      setStats({
        total_orders: ordersRes.data.length,
        total_revenue: totalRevenue,
        total_products: productsRes.data.length
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data');
    }
  };

  if (!user || !user.is_staff) return <Typography sx={{ p: 4 }}>Access Denied or Loading...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Admin Overview</Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => router.push('/dashboard/admin/products')}>Manage Products</Button>
        <Button variant="outlined" onClick={() => router.push('/dashboard/admin/orders')}>Manage Orders</Button>
        <Button variant="outlined" onClick={() => router.push('/dashboard/admin/users')}>Manage Users</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#233a95', color: 'white' }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h3">{stats.total_orders}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#4caf50', color: 'white' }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h3">Rs. {stats.total_revenue}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#ff9800', color: 'white' }}>
            <Typography variant="h6">Products</Typography>
            <Typography variant="h3">{stats.total_products}</Typography>
          </Paper>
        </Grid>
      </Grid>
 
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Recent Orders</Typography>
              <Button variant="outlined" size="small">View All Orders</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.full_name}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>Rs. {order.total_amount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">
                      <Button size="small">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
