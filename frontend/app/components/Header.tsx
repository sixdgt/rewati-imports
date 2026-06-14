'use client';
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import { BsCart } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useSettingsStore } from "../store/useSettingsStore";
import Navbar from "./Navbar";
import { Avatar, IconButton, Menu, MenuItem, Box, Tooltip } from '@mui/material';

const Header: React.FC = () => {
    const { getTotalItems: getCartTotal } = useCartStore();
    const { getTotalItems: getWishlistTotal, fetchWishlist } = useWishlistStore();
    const { settings, fetchSettings, fetchAds } = useSettingsStore();
    const { user, isAuthenticated, fetchProfile, logout } = useAuthStore();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
        fetchSettings();
        fetchAds();
        if (isAuthenticated) {
            if (!user) fetchProfile();
            fetchWishlist();
        }
    }, [isAuthenticated]);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div className="headerWrapper sticky top-0 z-50 bg-white shadow-sm">
                <header className="py-3 border-b border-gray-100">
                    <div className="container mx-auto px-4 flex items-center justify-between">
                        <div className="logo flex items-center gap-2">
                            <Link href="/">
                                <img
                                    src={settings?.logo || "/logo.svg"}
                                    alt={settings?.site_name || "Rewati Imports"}
                                    width={60}
                                    height={60}
                                    style={{ objectFit: 'contain', maxHeight: '100px' }}
                                />
                            </Link>
                            {settings?.site_name && (
                                <span className="text-2xl font-bold text-primary">{settings.site_name}</span>
                            )}
                        </div>

                        <div className="hidden md:block grow max-w-xl mx-8">
                            <Search />
                        </div>

                        <div className="flex items-center gap-6">
                            {isAuthenticated && user ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Tooltip title="Account">
                                        <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                                            <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 35, height: 35 }}>
                                                {user.full_name?.[0] || user.username?.[0]}
                                            </Avatar>
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        keepMounted
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={() => { handleClose(); window.location.href = user.is_staff ? '/dashboard/admin' : '/dashboard/customer'; }}>
                                            Dashboard
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleClose(); logout(); }}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <div className="flex items-center gap-3 text-sm font-medium">
                                    <Link href={"/login"} className="text-secondary hover:text-primary transition-colors">
                                        Login
                                    </Link>
                                    <span className="text-gray-300">|</span>
                                    <Link href={"/register"} className="text-secondary hover:text-primary transition-colors">
                                        Register
                                    </Link>
                                </div>
                            )}

                            <div className="flex items-center gap-6">
                                <Link href={"/wishlist"} className="relative flex">
                                    <FaRegHeart size={24} className="text-secondary hover:text-primary transition-colors" />
                                    <span className="bg-secondary w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center absolute -top-2 -right-2">
                                        {getWishlistTotal()}
                                    </span>
                                </Link>
                                <Link href={"/cart"} className="relative flex">
                                    <BsCart size={24} className="text-secondary hover:text-primary transition-colors" />
                                    <span className="bg-secondary w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center absolute -top-2 -right-2">
                                        {getCartTotal()}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>
                <Navbar />
            </div>
        </>
    );
}

export default Header;