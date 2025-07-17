import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { currencyFormatter } from '@/lib/global';
import { fetchCheckoutRedirectUrl, localizedRouteName } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { Product, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { forwardRef, useEffect, useState } from 'react';

type ProductCardProps = {
    product: Product;
    disabled?: boolean;
};

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({ product, disabled = false }, ref) => {
    const addToCart = useCartStore((state) => state.addToCart);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const { locale } = usePage<SharedData>().props;
    const { t } = useTranslations();

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    return (
        <>
            <div
                ref={ref}
                className="group flex max-w-60 shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.03)]"
            >
                <Link href={route(localizedRouteName('products.show', locale), product.slug)} className="grow">
                    {/* Image with badge */}
                    <div className="relative h-52 overflow-hidden">
                        <img
                            src={
                                product.galleries.length !== 0
                                    ? product.galleries[0].media_url
                                    : 'https://placehold.jp/c7c7c7/ffffff/900x900.jpg?text=Coming%20Soon'
                            }
                            loading="lazy"
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/*todo: if sale remove hidden*/}
                        <div className="absolute top-3 right-3 hidden rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                            SALE
                        </div>
                    </div>
                    {/* Content */}
                    <div className="flex h-[calc(100%-13rem)] flex-col p-4 pb-0">
                        <div className="mb-3 flex w-full grow items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>
                            </div>
                        </div>

                        <div className="mb-5 flex h-fit items-center justify-between">
                            <div className="flex flex-col gap-1">
                                {/*todo: if sale remove hidden*/}
                                <span className="hidden text-sm text-gray-400 line-through">
                                    {currencyFormatter.format(parseFloat(product.price))}
                                </span>
                                <span className="text-xl font-semibold text-gray-900">{currencyFormatter.format(parseFloat(product.price))}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 p-4 pt-0">
                    <div className="flex space-x-3">
                        <Button
                            className="grow"
                            disabled={isLoading || disabled}
                            onClick={() => {
                                setIsLoading(true);
                                fetchCheckoutRedirectUrl(
                                    locale,
                                    {
                                        slug: product.slug,
                                        qty: 1,
                                    },
                                    {
                                        onSuccess: (checkoutUrl) => {
                                            router.get(checkoutUrl);
                                        },
                                        onError: (error) => {
                                            console.error('Error fetching checkout URL:', error);
                                        },
                                        onFinally: () => {
                                            setIsLoading(false);
                                        },
                                    },
                                );
                            }}
                        >
                            {t('buy_it_now', 'Buy It Now')}
                        </Button>
                        {/*<AddToCartButton*/}
                        {/*    productName={product.title}*/}
                        {/*    variant="default"*/}
                        {/*    size="default"*/}
                        {/*    onAddToCart={() => {*/}
                        {/*        addToCart(product.slug, 1);*/}
                        {/*        setIsAnimating(true);*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </div>
                    <Button
                        onClick={() => {
                            addToCart(product.slug, 1);
                            setIsAnimating(true);
                        }}
                        className={`grow ${isAnimating ? 'animate-pulse' : ''}`}
                        variant="outline"
                        disabled={isLoading || disabled}
                    >
                        {t('add_to_cart', 'Add to Cart')}
                    </Button>
                </div>
            </div>
        </>
    );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
