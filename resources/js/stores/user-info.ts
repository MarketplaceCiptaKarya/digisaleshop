import { ShippingForm } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ShippingInformation = {
    shippingInformation: ShippingForm;
    setShippingInformation: (value: ShippingForm) => void;
    updateShipping: (field: keyof ShippingForm, value: string) => void;
    deleteShippingInformation: () => void;
};

export const useShippingInformationStore = create<ShippingInformation>()(
    persist(
        (set) => ({
            shippingInformation: {} as ShippingForm,
            setShippingInformation: (value) => set({ shippingInformation: value }),
            updateShipping: (field, value) =>
                set((state) => ({
                    shippingInformation: {
                        ...state.shippingInformation,
                        [field]: value,
                    },
                })),
            deleteShippingInformation: () => set({ shippingInformation: {} as ShippingForm }),
        }),
        {
            name: 'shipping-information',
            version: 1,
        },
    ),
);
