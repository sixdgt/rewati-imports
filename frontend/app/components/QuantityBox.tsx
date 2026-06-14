'use client';
import React from 'react';
import { LiaAngleDownSolid } from "react-icons/lia";
import { LiaAngleUpSolid } from "react-icons/lia";
import Button from '@mui/material/Button';

interface QuantityBoxProps {
    value?: number;
    onChange?: (val: number) => void;
}

const QuantityBox: React.FC<QuantityBoxProps> = ({ value = 1, onChange }) => {
    
    const handleIncrement = () => {
        if (onChange) onChange(value + 1);
    };

    const handleDecrement = () => {
        if (onChange) onChange(Math.max(1, value - 1));
    };

    return (
        <div className='qtybox flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 w-25 h-11 relative'>
            <input 
                type='number' 
                className='text-gray-700 border-0 outline-none w-full h-full px-2 font-normal text-sm'
                value={value}
                onChange={(e) => onChange && onChange(parseInt(e.target.value) || 1)}
            />
            <div className='flex flex-col absolute top-0 right-0 h-full'>
                <Button className='text-gray-800! w-5! h-5! min-w-6!' onClick={handleIncrement}>
                    <LiaAngleUpSolid size={25} />
                </Button>
                <Button className='text-gray-800! w-5! h-5! min-w-6!' onClick={handleDecrement}>
                    <LiaAngleDownSolid size={25} />
                </Button>
            </div>
        </div>
    );
}

export default QuantityBox;