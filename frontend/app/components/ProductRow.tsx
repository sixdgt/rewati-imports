import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import ProductSlider from "./ProductSlider";
import Link from "next/link";

type ProductRowProps = {
    title: string;
    subtitle: string;
}
const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle }) => {
    return (
        <section className="bg-white py-3">
          <div className="container">
            <div className="flex items-center justify-between mb-5">
              <div className="col1 w-[30%]">
                <h3 className="text-2xl text-secondary font-semibold">{title}</h3>
                <p className='text-[14px] text-gray-500 text-left'>{subtitle}</p>
              </div>
              <div className="col2 w-[70%] flex items-center justify-end">
                <Link href="/categories" className='text-secondary font-medium hover:text-primary transition-colors duration-200 flex items-center gap-1 group-hover:mt-2'>
                        View All <FaArrowRightLong size={18} className="inline-block ml-1" />
                    </Link> 
              </div>
            </div>
             <ProductSlider />
          </div>
        </section>
    );
}

export default ProductRow;