'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab, Chip, CircularProgress, Alert } from '@mui/material';
import api from '../../../lib/api';

export default function AdminUserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const fetchUsers = async (role?: string) => {
    setLoading(true);
    try {
      const url = role ? `/auth/users/?role=${role}` : '/auth/users/';
      const response = await api.get(url);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = activeTab === 1 ? 'staff' : activeTab === 2 ? 'customer' : undefined;
    fetchUsers(role);
  }, [activeTab]);

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>User Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="All Users" />
          <Tab label="Staff" />
          <Tab label="Customers" />
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f1f1' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email / Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>#{u.id}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{u.full_name || 'N/A'}</TableCell>
                <TableCell>
                  <Typography variant="body2">{u.email}</Typography>
                  <Typography variant="caption" color="textSecondary">@{u.username}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={u.is_staff ? 'Staff' : 'Customer'} 
                    color={u.is_staff ? 'secondary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{new Date().toLocaleDateString()} {/* Placeholder for join date */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
