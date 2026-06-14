import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface WishlistState {
  items: any[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (product: any) => Promise<void>;
  removeItem: (wishlistId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchWishlist: async () => {
        set({ loading: true });
        try {
          const res = await api.get('/wishlist/');
          set({ items: res.data });
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        } finally {
          set({ loading: false });
        }
      },

      addItem: async (product: any) => {
        try {
          const res = await api.post('/wishlist/', { product: product.id });
          const newItems = [...get().items, res.data];
          set({ items: newItems });
        } catch (err) {
          console.error('Failed to add to wishlist', err);
        }
      },

      removeItem: async (wishlistId: number) => {
        try {
          await api.delete(`/wishlist/${wishlistId}/`);
          const newItems = get().items.filter((item) => item.id !== wishlistId);
          set({ items: newItems });
        } catch (err) {
          console.error('Failed to remove from wishlist', err);
        }
      },

      isInWishlist: (productId: number) => {
        return get().items.some((item) => item.product === productId);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
