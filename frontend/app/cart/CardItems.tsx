'use client';
import Link from 'next/link';
import Button from '@mui/material/Button';
import React from 'react';
import { IoMdClose, IoIosAdd, IoIosRemove } from 'react-icons/io';
import { useCartStore } from '../store/useCartStore';

interface CartItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    };
}

const CartItems: React.FC<CartItemProps> = ({ item }) => {
    const { updateQuantity, removeItem } = useCartStore();

    return (
        <div className='productRow flex items-center gap-5 p-5 border-b border-gray-200'>
            <Link href={`/product/${item.id}`} className='img w-[20%] group'>
                <img 
                    src={item.image || "/products/placeholder.jpg"} 
                    alt={item.name} 
                    className='w-full h-20 object-contain rounded-md transition group-hover:scale-105' 
                />
            </Link>
            <div className='info flex flex-col gap-2 w-[80%]'>
                <Link href={`/product/${item.id}`} className='text-lg font-semibold text-gray-800 hover:text-primary transition'>
                    {item.name}
                </Link>

                <div className='flex items-center gap-5 mt-2'>
                    <div className='flex items-center gap-2 border border-gray-300 rounded-md p-1 bg-gray-100'>
                        <button 
                            className={`w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-gray-200 text-gray-700 transition ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => { if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1) }}
                            disabled={item.quantity <= 1}
                        >
                            <IoIosRemove size={18} />
                        </button>
                        <span className='font-semibold text-gray-800 w-6 text-center text-sm'>{item.quantity}</span>
                        <button 
                            className='w-7 h-7 flex items-center justify-center rounded-md bg-white hover:bg-gray-200 text-gray-700 transition cursor-pointer'
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <IoIosAdd size={18} />
                        </button>
                    </div>

                    <div className='flex items-center gap-3'>
                        <span className='text-lg font-bold text-red-800'>Rs. {item.price}</span>
                        <span className='text-md font-semibold text-gray-500'>Subtotal: Rs. {item.price * item.quantity}</span>
                    </div>
                </div>
            </div>

            <IoMdClose 
                size={30} 
                className='cursor-pointer hover:text-primary ml-auto text-gray-400' 
                onClick={() => removeItem(item.id)}
            />
        </div>
    );
}

export default CartItems;