"use client";
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductSlider from './ProductSlider';

const PopularProducts: React.FC = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <section className='bg-white py-5'>
            <div className='container'>
                <div className='flex items-center justify-between'>
                    <div className='col1 w-[30%]'>
                        <h2 className='text-[20px] font-semibold text-secondary'>Popular Products</h2>
                        <p className='text-[14px] text-gray-500 text-left'>Check out our most popular products that customers love!</p>
                    </div>
                    <div className='col2 w-[70%] flex items-center justify-end'>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable auto tabs example"
                        >
                            <Tab label="Fruits & Vegetables" />
                            <Tab label="Meat & Seafood" />
                            <Tab label="Beverages" />
                            <Tab label="Snacks" />
                            <Tab label="Bakery" />
                            <Tab label="Dairy" />
                            <Tab label="Frozen Foods" />
                            <Tab label="Pantry Staples" />
                            <Tab label="Personal Care" />
                        </Tabs>
                    </div>
                </div>

                <ProductSlider />
            </div>
        </section>
    );
}

export default PopularProducts;