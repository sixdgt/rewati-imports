"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { BiSolidLocationPlus, BiSupport } from 'react-icons/bi';
import { BsMailbox2, BsPhone, BsWallet2 } from 'react-icons/bs';
import { IoChatboxOutline } from 'react-icons/io5';
import { LiaGiftSolid, LiaShippingFastSolid } from 'react-icons/lia';
import { PiKeyReturnLight } from 'react-icons/pi';
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const features = [
    {
        icon: <LiaShippingFastSolid />,
        title: "Free Shipping",
        desc: "On all orders over NPR 5000"
    },
    {
        icon: <PiKeyReturnLight />,
        title: "30 Days Returns",
        desc: "30 days to return your purchase"
    },
    {
        icon: <BsWallet2 />,
        title: "Secure Payment",
        desc: "Your payment information is secure"
    },
    {
        icon: <LiaGiftSolid />,
        title: "Special Vouchers",
        desc: "Get exclusive deals and discounts"
    },
    {
        icon: <BiSupport />,
        title: "24/7 Support",
        desc: "Get help whenever you need it"
    }
];

const Footer: React.FC = () => {
    return (
        <footer className='bg-[#f1f1f1] text-sm text-secondary'>
            <div className='container'>
                <div className='
                    flex overflow-x-auto gap-4 py-6 scrollbar-custom
                    md:grid md:grid-cols-3 md:gap-6 md:overflow-visible
                    lg:grid-cols-5
                '>
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className='group flex flex-col items-center justify-center min-w-38 md:min-w-0'
                        >
                            <div className='text-[40px] transition duration-300 group-hover:text-primary group-hover:-translate-y-1'>
                                {item.icon}
                            </div>
                            <h3 className='text-sm font-semibold mt-3'>
                                {item.title}
                            </h3>
                            <p className='text-xs text-gray-500 text-center'>
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
                <hr className='border-gray-300' />
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 py-3 text-left'>

                    {/* Company Info */}
                    <div>
                        <h3 className='text-lg font-semibold mb-3'>Rewati Imports</h3>

                        <p className='flex items-start gap-2 text-sm mb-2'>
                            <BiSolidLocationPlus className='mt-1' />
                            123 Main Street, Kathmandu, Nepal
                        </p>

                        <a
                            href="mailto:info@rewatiimports.com"
                            className='flex items-center gap-2 text-primary hover:underline mb-2'
                        >
                            <BsMailbox2 />
                            info@rewatiimports.com
                        </a>

                        <a
                            href="tel:+977983456789"
                            className='flex items-center gap-2 text-primary hover:underline mb-3'
                        >
                            <BsPhone />
                            (+977) 98-3456-789
                        </a>

                        <div className='flex items-center gap-3'>
                            <IoChatboxOutline className='text-3xl text-primary' />
                            <span className='text-sm'>
                                Chat with us <br />
                                <span className='text-xs text-gray-500'>We’re here to help!</span>
                            </span>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h3 className='text-lg font-semibold mb-3'>Quick Links</h3>
                        <ul className='flex flex-col gap-2 text-sm'>
                            <li><Link href="#" className='hover:text-primary'>Home</Link></li>
                            <li><Link href="#" className='hover:text-primary'>Shop</Link></li>
                            <li><Link href="#" className='hover:text-primary'>About</Link></li>
                            <li><Link href="#" className='hover:text-primary'>Contact</Link></li>
                        </ul>
                    </div>

                    {/* Customer */}
                    <div>
                        <h3 className='text-lg font-semibold mb-3'>Customer</h3>
                        <ul className='flex flex-col gap-2 text-sm'>
                            <li><Link href="#" className='hover:text-primary'>My Account</Link></li>
                            <li><Link href="#" className='hover:text-primary'>Orders</Link></li>
                            <li><Link href="#" className='hover:text-primary'>Wishlist</Link></li>
                            <li><Link href="#" className='hover:text-primary'>Returns</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className='text-lg font-semibold mb-3'>Newsletter</h3>
                        <p className='text-sm mb-3'>
                            Subscribe to get latest offers
                        </p>

                        <div className='flex'>
                            <input
                                type="email"
                                placeholder="Your email"
                                className='flex-1 px-3 py-2 border border-gray-300 rounded-l-md outline-none'
                            />
                            <button className='bg-primary text-white px-4 rounded-r-md'>
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottomStrip border-t py-3'>
                <div className='container flex items-center justify-between flex-wrap gap-4'>
                    <div className='socials flex items-center gap-2'>
                        <Link href="/" className='flex items-center justify-center bg-white rounded-full border border-[rgba(0,0,0,0.1)] w-8 h-8 text-sm hover:bg-primary group transition '><FaFacebookF size={20} className='text-secondary group-hover:text-white' /></Link>
                        <Link href="/" className='flex items-center justify-center bg-white rounded-full border border-[rgba(0,0,0,0.1)] w-8 h-8 text-sm hover:bg-primary group transition'><FaInstagram size={20} className='text-secondary group-hover:text-white' /></Link>
                        <Link href="/" className='flex items-center justify-center bg-white rounded-full border border-[rgba(0,0,0,0.1)] w-8 h-8 text-sm hover:bg-primary group transition'><FaTiktok size={20} className='text-secondary group-hover:text-white' /></Link>
                        <Link href="/" className='flex items-center justify-center bg-white rounded-full border border-[rgba(0,0,0,0.1)] w-8 h-8 text-sm hover:bg-primary group transition'><FaYoutube size={20} className='text-secondary group-hover:text-white' /></Link>
                    </div>
                    <p className='text-center font-semibold py-4 text-xs text-gray-500'>
                        &copy; {new Date().getFullYear()} Rewati Imports. All rights reserved.
                    </p>
                    <div className='flex items-center gap-1'>
                        <Image src="/payments/visa.png" alt="Visa" width={40} height={20} className='object-contain' />
                        <Image src="/payments/card.png" alt="MasterCard" width={40} height={20} className='object-contain' />
                        <Image src="/payments/paypal.png" alt="PayPal" width={40} height={20} className='object-contain' />
                    </div>
                </div>
            </div>            
        </footer>
    );
};

export default Footer;