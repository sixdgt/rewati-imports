'use client';
import React, { Suspense, useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

const SearchInner: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        // Sync state if URL changes externally
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        const currentQ = searchParams.get('q') || '';
        if (query === currentQ) return;
        
        const delayDebounceFn = setTimeout(() => {
            const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
            if (query.trim()) {
                currentParams.set('q', query.trim());
            } else {
                currentParams.delete('q');
            }
            router.push(`/products?${currentParams.toString()}`);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query, router, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
        if (query.trim()) {
            currentParams.set('q', query.trim());
        } else {
            currentParams.delete('q');
        }
        router.push(`/products?${currentParams.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="search bg-[#E6E6E6] w-full max-w-150 h-12 rounded-md px-4 flex items-center border border-gray-300 hover:border-primary focus-within:border-primary transition-all duration-200">
            <input
                type="text"
                className="w-full h-full bg-transparent outline-none border-0 text-secondary placeholder-secondary focus:outline-none "
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="h-9 w-9 rounded-full text-primary 
                flex items-center justify-center shrink-0 cursor-pointer 
                transition-all duration-200 hover:bg-primary hover:text-white ml-2"
                aria-label="Search"
                style={{ color: 'var(--color-primary)' }}
                >
                <IoSearchOutline size={22} />
            </button>
        </form>
    );
}

const Search: React.FC = () => (
    <Suspense fallback={
        <div className="search bg-[#E6E6E6] w-full max-w-150 h-12 rounded-md px-4 flex items-center border border-gray-300">
            <span className="text-secondary placeholder-secondary">Search for products...</span>
        </div>
    }>
        <SearchInner />
    </Suspense>
);

export default Search;