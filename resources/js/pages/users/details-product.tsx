import QuantityInput from '@/components/custom/qty-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import MainLayout from '@/layouts/custom/main-layout';
import { currencyFormatter } from '@/lib/global';
import { fetchCheckoutRedirectUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { Product, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function DetailsProduct() {
    const { product, locale } = usePage<SharedData & { product: Product }>().props;
    const [api, setApi] = useState<CarouselApi>();
    const addToCart = useCartStore((state) => state.addToCart);
    const { t } = useTranslations();

    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);
    return (
        <>
            <MainLayout>
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    className="mx-auto my-3 w-full px-4"
                >
                    <CarouselContent>
                        {product.galleries.length !== 0 ? (
                            product.galleries.map((gallery, index) => (
                                <CarouselItem key={gallery.id}>
                                    <div className="p-1">
                                        <Card className="min-h-96">
                                            <CardContent className="flex h-96 items-center justify-center p-6">
                                                <img
                                                    className="h-full object-contain"
                                                    src={gallery.media_url}
                                                    alt={product.title + '-' + (index + 1)}
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                <div className="p-1">
                                    <Card className="min-h-96">
                                        <CardContent className="flex h-96 items-center justify-center p-6">
                                            <img
                                                className="h-full object-contain"
                                                src={'https://placehold.jp/c7c7c7/ffffff/900x900.jpg?text=Coming%20Soon'}
                                                alt={product.title}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                    <div className="flex w-full flex-row items-center justify-center gap-3">
                        <CarouselPrevious
                            style={{
                                position: 'initial',
                            }}
                            className="bottom-10 left-[calc(50%-2rem-1rem)] translate-y-0"
                        />
                        <div className="py-2 text-center text-sm text-muted-foreground">
                            {current}/{count}
                        </div>
                        <CarouselNext
                            style={{
                                position: 'initial',
                            }}
                            className="right-[calc(50%-2rem-1rem)] bottom-2.5 translate-y-0"
                        />
                    </div>
                </Carousel>
                <section className={`container mx-auto my-3 space-y-3 px-4`}>
                    <div className="space-y-5 lg:flex lg:flex-row-reverse lg:gap-3 lg:space-y-0">
                        <Card className="lg:h-fit lg:min-w-96">
                            <CardHeader className="flex flex-col md:flex-row lg:flex-col">
                                <div className="mb-2 grow">
                                    <h3 className="text-sm text-muted-foreground">{product.category.name}</h3>
                                    <CardTitle className="max-w-full text-3xl">{product.title}</CardTitle>
                                    <CardDescription className="text-black">
                                        <div className="flex flex-col">
                                            <h2 className="text-xl">{currencyFormatter.format(parseFloat(product.price))} </h2>
                                        </div>
                                    </CardDescription>
                                </div>
                                <div className="flex flex-col items-start gap-2 md:min-w-52">
                                    <div className="grid w-full max-w-lg items-center gap-3">
                                        <Label htmlFor="quantity-input">{t('quantity', 'Quantity')}</Label>
                                        <QuantityInput
                                            value={quantity}
                                            max={product.stock}
                                            disabled={product.stock <= 0}
                                            onChange={(value) => setQuantity(value)}
                                        />
                                    </div>
                                    <div className="flex w-full flex-col justify-start gap-2">
                                        <Button
                                            onClick={() => {
                                                addToCart(product.slug, quantity);
                                            }}
                                            disabled={product.stock <= 0}
                                            variant="outline"
                                        >
                                            {t('add_to_cart', 'Add to Cart')}
                                        </Button>
                                        <Button
                                            disabled={isLoading || product.stock <= 0}
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
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="lg:grow">
                            <CardHeader>
                                <CardTitle>{t('description', 'Description')}</CardTitle>
                                <CardDescription>{t('product_details_and_specifications', 'Product details and specifications')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            </CardContent>
                        </Card>
                    </div>
                    {/*todo: prepare for recommendation*/}
                    {/*<Card>
                        <CardHeader>
                            <CardTitle>Others product you may like</CardTitle>
                            <CardDescription>Product details and specifications</CardDescription>
                        </CardHeader>
                        <CardContent>adas</CardContent>
                    </Card>*/}
                </section>
            </MainLayout>
        </>
    );
}
