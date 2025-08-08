import { CheckoutDesktopForm } from '@/components/custom/checkout/checkout-desktop-form';
import { CheckoutMobileForm } from '@/components/custom/checkout/checkout-mobile-form';
import { CheckoutNavbar } from '@/components/custom/checkout/checkout-navbar';
import { localizedRouteName } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { useShippingInformationStore } from '@/stores/user-info';
import { AccordionState, BillingState, CheckoutForm, CheckoutItem, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Checkout() {
    const { checkoutItems, path, locale } = usePage<
        SharedData & {
            checkoutItems: CheckoutItem[];
            path: string;
        }
    >().props;
    const removeCart = useCartStore((state) => state.removeFromCart);
    const saveUserInfo = useShippingInformationStore((state) => state.setShippingInformation);
    const userInfo = useShippingInformationStore((state) => state.shippingInformation);
    const [orderAccordion, setOrderAccordion] = useState<AccordionState>('close');
    const [billingState, setBillingState] = useState<BillingState>('same');

    const form = useForm<CheckoutForm>({
        contact: '',
        shipping: userInfo
            ? userInfo
            : {
                  first_name: '',
                  last_name: '',
                  address: '',
                  detail_address: '',
                  city: '',
                  province: '',
                  postal_code: '',
                  country: '',
              },
        billing: {
            first_name: '',
            last_name: '',
            address: '',
            detail_address: '',
            city: '',
            province: '',
            postal_code: '',
            country: '',
        },
        save_shipping: false,
    });

    useEffect(() => {
        if (billingState === 'same') {
            form.setData('billing', { ...form.data.shipping });
        } else if (billingState === 'different') {
            form.reset('billing');
        }
    }, [billingState, form.data.shipping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        checkoutItems.forEach((item) => removeCart(item.slug));
        if (form.data.save_shipping) {
            saveUserInfo(form.data.shipping);
        }
        form.post(route(localizedRouteName('products.checkout.session', locale), path), {
            onSuccess: () => {},
            onError: (errors) => console.error(errors),
            preserveScroll: true,
            preserveState: true,
        });
    };

    const total = checkoutItems.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);

    return (
        <>
            <CheckoutNavbar />

            <div className="container mx-auto px-4 py-4 md:px-32 lg:px-4">
                <CheckoutMobileForm
                    form={form}
                    orderAccordion={orderAccordion}
                    setOrderAccordion={setOrderAccordion}
                    billingState={billingState}
                    setBillingState={setBillingState}
                    checkoutItems={checkoutItems}
                    total={total}
                    onSubmit={handleSubmit}
                />

                {/* Desktop View*/}

                <CheckoutDesktopForm
                    form={form}
                    billingState={billingState}
                    setBillingState={setBillingState}
                    checkoutItems={checkoutItems}
                    total={total}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}
