import React from 'react';

export const metadata = {
    title: 'Product Details',
    description: 'Detailed information about the product.'
};

export default function ProductPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    );
}