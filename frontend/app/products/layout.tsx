import { title } from "process";
import React from "react";

export const metadata = {
    title: "Products Page",
    description: "This is the products page",
}
const ProductsPageLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default ProductsPageLayout;