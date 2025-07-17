import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartItem = { slug: string; qty: number };
type CartState = {
    cart: CartItem[];
    addToCart: (slug: string, qty: number) => void;
    setCartQty: (slug: string, qty: number) => void;
    removeFromCart: (slug: string) => void;
};

export const useCartStore = create<CartState>()(
    /*persist(
        (set, get) => ({
            cart: [],
            addToCart: (slug, qty) => {
                const existing = get().cart.find((item) => item.slug === slug);
                if (existing) {
                    set({
                        cart: get().cart.map((item) => (item.slug === slug ? { ...item, qty: item.qty + qty } : item)),
                    });
                } else {
                    set({ cart: [...get().cart, { slug, qty }] });
                }
            },
            setCartQty: (slug, qty) => {
                set({
                    cart: get().cart.map((item) => (item.slug === slug ? { ...item, qty } : item)),
                });
            },
        }),*/
    persist(
        (set) => ({
            cart: [],
            addToCart: (slug, qty) =>
                set((state) => {
                    const existingIndex = state.cart.findIndex((item) => item.slug === slug);

                    // Item exists: update quantity
                    if (existingIndex > -1) {
                        const updatedCart = [...state.cart];
                        updatedCart[existingIndex] = {
                            ...updatedCart[existingIndex],
                            qty: updatedCart[existingIndex].qty + qty,
                        };
                        return { cart: updatedCart };
                    }
                    // New item: add to cart
                    else {
                        return { cart: [...state.cart, { slug, qty }] };
                    }
                }),
            setCartQty: (slug, qty) =>
                set((state) => ({
                    cart: state.cart.map((item) => (item.slug === slug ? { ...item, qty } : item)),
                })),
            removeFromCart: (slug) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.slug !== slug),
                })),
        }),
        {
            name: 'cart',
            version: 1,
        },
    ),
);
