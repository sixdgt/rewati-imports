import React from "react";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa6";

const Navbar: React.FC = () => {
    return (
        <nav className="py-3">
            <div className="container flex items-center justify-between gap-5">
                <Link href={"/"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200"> 
                    Home
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200">
                    Fruits & Vegetables
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200">
                    Meats & Seafood
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200">
                    Breakfast & Dairy
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200"> 
                    Breads & Bakery
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200">
                    Frozen Foods
                </Link>
                <Link href={"/products"} className="text-secondary text-[18px] font-semibold hover:text-primary transition-colors duration-200">
                    Biscuits & Snacks
                </Link>
                <div className="relative group">
                    <span className="text-secondary text-[18px] font-semibold flex items-center gap-1 hover:text-primary transition-colors duration-200 cursor-pointer">More <FaAngleDown size={22} /></span>
                    <div className="dropdown-menu flex flex-col absolute top-full right-0 bg-white shadow-md rounded-md overflow-hidden opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 z-10 cursor-pointer">
                        <Link href={"/products"} className="text-secondary text-[14px] font-medium hover:text-primary transition-colors duration-200 px-4 py-2 whitespace-nowrap">
                            Beverages
                        </Link>
                        <Link href={"/products"} className="text-secondary text-[14px] font-medium hover:text-primary transition-colors duration-200 px-4 py-2 whitespace-nowrap">
                            Household & Cleaning
                        </Link>
                        <Link href={"/products"} className="text-secondary text-[14px] font-medium hover:text-primary transition-colors duration-200 px-4 py-2 whitespace-nowrap">
                            Personal Care
                        </Link>
                        <Link href={"/products"} className="text-secondary text-[14px] font-medium hover:text-primary transition-colors duration-200 px-4 py-2 whitespace-nowrap">
                            Baby Care
                        </Link>
                        <Link href={"/products"} className="text-secondary text-[14px] font-medium hover:text-primary transition-colors duration-200 px-4 py-2 whitespace-nowrap">
                            Pet Care
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;