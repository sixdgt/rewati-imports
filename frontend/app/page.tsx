import HomeSlider from "./components/HomeSlider";
import CatSlider from "./components/CatSlider";
import PopularProducts from "./components/PopularProducts";
import Banners from "./components/Banners";
import ProductRow from "./components/ProductRow";

export default function Home() {
  return (
    <>
      <div className="sliderWrapper bg-[#f1f1f1] py-5">
        <HomeSlider />
        <CatSlider />
        <PopularProducts />
        <Banners />
        <ProductRow title="New Arrivals" subtitle="Check out our latest products with exclusive offers" />
        <ProductRow title="Best Sellers" subtitle="Explore our most popular products loved by customers" />
        <ProductRow title="On Sale" subtitle="Don't miss out on our special discounts and deals" />
        <ProductRow title="Featured Products" subtitle="Discover our handpicked selection of top-rated products" />
      </div>
    </>
  );
}
