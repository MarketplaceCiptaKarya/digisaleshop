import ProductCard from '@/components/custom/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/hooks/use-translations';
import { useWebsiteData } from '@/hooks/use-website-data';
import MainLayout from '@/layouts/custom/main-layout';
import { localizedRouteName } from '@/lib/utils';
import { Product, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';

export default function Welcome() {
    const { productsByCategory, locale } = usePage<
        SharedData & {
            productsByCategory: { category: { slug: string; name: string }; data: Product[] }[];
        }
    >().props;
    const { carouselData } = useWebsiteData();
    const { t } = useTranslations();

    if (!productsByCategory) {
        return <div>{t('loading', 'Loading')}</div>;
    }

    return (
        <>
            <Head />
            <MainLayout>
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2500,
                        }),
                    ]}
                    className="mx-auto mt-3 w-full"
                >
                    <CarouselContent>
                        {carouselData.map((carousel, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                    <Card className="min-h-96">
                                        <CardContent className="flex h-96 items-center justify-center">
                                            <img className="h-full w-full object-cover" src={carousel.image} alt={carousel.alt} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="top-1/2 left-12" />
                    <CarouselNext className="top-1/2 right-12" />
                </Carousel>
                {productsByCategory.map((product) => {
                    if (!product.data || product.data.length === 0) {
                        return null;
                    }
                    return (
                        <section key={product.category.slug} className="container mx-auto px-4 py-5">
                            <h1 className="text-center text-xl font-semibold">{product.category.name}</h1>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
                                {product.data.map((item) => (
                                    <ProductCard key={item.id} product={item} />
                                ))}
                            </div>
                            <div className="mt-5 flex w-full justify-center">
                                <Button size="lg" asChild variant="outline" className="px-10 py-6 shadow-lg">
                                    <Link href={route(localizedRouteName('products.per-category', locale), product.category.slug)}>
                                        {t('see_more', 'See More')}
                                    </Link>
                                </Button>
                            </div>
                        </section>
                    );
                })}
            </MainLayout>
        </>
    );
}
