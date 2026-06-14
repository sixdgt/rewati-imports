'use client';

import React from 'react';
import CardItems from './CardItems';
import { useCartStore } from '../store/useCartStore';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

const Cart: React.FC = () => {
  const { items, getSubtotal, getTotalItems } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <Box className='bg-gray-200 py-20 text-center'>
        <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
        <Button variant="contained" sx={{ bgcolor: 'var(--color-primary)', '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }} onClick={() => router.push('/')}>
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <section className='bg-gray-200 py-12'>
        <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row w-full lg:w-[90%] m-auto gap-10'>
                <div className='col1 bg-white p-5 rounded-md shadow-md flex-grow'>
                    <div className='p-5 border-b border-gray-400'>
                        <h2 className='text-xl font-semibold mb-4'>Shopping Cart</h2>
                        <p className='text-gray-600 text-[15px] font-normal'>There are 
                        <span className='text-primary font-bold'> {getTotalItems()}</span> items in your cart.</p>
                    </div>

                    <div className='cartList py-4'>
                        {items.map((item) => (
                            <CardItems key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <div className='col2 bg-white p-5 rounded-md shadow-md w-full md:w-[350px] h-fit'>
                    <div className='p-5 border-b border-gray-400'>
                        <h2 className='text-xl font-semibold mb-4'>Cart Totals</h2>
                        <p className='text-gray-600 text-[15px] font-normal'>Total Items: {getTotalItems()}</p>
                    </div>
                    <div className='info p-5 border-b border-gray-300 flex flex-col items-start justify-between w-full'>
                        <div className='flex items-center justify-between gap-3 w-full mb-3'>
                            <span className='text-lg font-bold text-gray-800'>Subtotal</span>
                            <span className='text-lg font-bold text-red-500'>$AUD {getSubtotal()}</span>
                        </div>
                        <div className='flex items-center border-t border-gray-300 justify-between gap-3 w-full mt-5 pt-5'>
                            <span className='text-2xl font-bold text-gray-800'>Total</span>
                            <span className='text-2xl font-bold text-red-500'>$AUD {getSubtotal()}</span>
                        </div>  
                        
                        <Button 
                          variant="contained" 
                          fullWidth 
                          sx={{ mt: 4, py: 1.5, bgcolor: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { bgcolor: 'var(--color-primary)', opacity: 0.9 } }}
                          onClick={() => router.push('/checkout')}
                        >
                          Checkout
                        </Button>
                    </div>   
                </div>
            </div>
        </div>
    </section>
    );
};

export default Cart;