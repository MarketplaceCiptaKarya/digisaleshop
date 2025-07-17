import { InfiniteScroll } from '@/components/custom/infinite-scroll';
import ProductCard from '@/components/custom/product-card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/hooks/use-translations';
import { useWebsiteData } from '@/hooks/use-website-data';
import MainLayout from '@/layouts/custom/main-layout';
import { localizedRouteName } from '@/lib/utils';
import { PaginatedResponse, Product, SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { CheckedState } from '@radix-ui/react-checkbox';
import axios from 'axios';
import { ChevronsUpDown, Minus, X } from 'lucide-react';
import { forwardRef, useEffect, useRef, useState } from 'react';

export type SortOptions = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'created-at-asc' | 'created-at-desc' | 'default' | 'best-seller';
export type AvailabilityFilterOptions = 'in-stock' | 'out-of-stock';

type PriceRange = {
    min: number;
    max: number;
};
const initialPriceRange = { min: 0, max: 0 };
const initialAvailability: Record<AvailabilityFilterOptions, CheckedState> = {
    'in-stock': false,
    'out-of-stock': false,
};
const initialSort = 'default';

type FilterBadgeProps = {
    label: string;
    onClear: () => void;
};

function FilterBadge({ label, onClear }: FilterBadgeProps) {
    return (
        <Button variant="default" className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs" onClick={onClear}>
            {label}
            <X className="h-3 w-3" />
        </Button>
    );
}

const ProductCardSkeleton = forwardRef<HTMLDivElement, unknown>((_, ref) => {
    return (
        <div
            ref={ref}
            className="max-w-60 shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]"
        >
            {/* Image skeleton */}
            <div className="relative h-52 w-full animate-pulse overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Content skeleton */}
            <div className="p-4">
                <div className="mb-3 flex items-start justify-between">
                    <div className="w-full">
                        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <div className="flex w-full flex-col gap-1">
                        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
                        <div className="mt-1 h-6 w-1/2 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                {/* Buttons skeleton */}
                <div className="flex flex-col gap-3">
                    <div className="flex space-x-3">
                        <div className="h-10 grow animate-pulse rounded bg-gray-200" />
                        <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
                    </div>
                    <div className="h-10 grow animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        </div>
    );
});

export default function ProductsPerCategory() {
    const {
        products: ssgProducts,
        category,
        parameter,
        locale,
    } = usePage<
        SharedData & {
            products: PaginatedResponse<Product>;
            parameter: {
                availability?: AvailabilityFilterOptions[];
                price_min?: number;
                price_max?: number;
                sort_by?: SortOptions;
            } | null;
            category: { name: string; slug: string; description: string };
        }
    >().props;
    const { availabilityFilterOptions, sortOptions } = useWebsiteData();
    const { t } = useTranslations();

    const [availability, setAvailability] = useState<Record<AvailabilityFilterOptions, CheckedState>>(initialAvailability);
    const [sortBy, setSortBy] = useState<SortOptions>(initialSort);
    const [priceRange, setPriceRange] = useState<PriceRange>(initialPriceRange);

    const filtersChanged = useRef(false);

    function generateQueryParams() {
        const queryParams: Record<string, string | string[]> = {};
        const availabilityParams: string[] = [];

        if (availability['in-stock']) {
            availabilityParams.push('in-stock');
        }
        if (availability['out-of-stock']) {
            availabilityParams.push('out-of-stock');
        }
        if (availabilityParams.length > 0) {
            queryParams['availability'] = availabilityParams;
        }

        if (priceRange.min > 0) {
            queryParams['price_min'] = priceRange.min.toString();
        }
        if (priceRange.max > 0) {
            queryParams['price_max'] = priceRange.max.toString();
        }
        if (sortBy !== initialSort) {
            queryParams['sort_by'] = sortBy;
        }
        return queryParams;
    }

    function resetAllFilters() {
        setPriceRange(initialPriceRange);
        setAvailability(initialAvailability);
        setSortBy(initialSort);
        filtersChanged.current = true;
    }

    const fetchNextPage = async (cursor: string) => {
        const response = await axios.get<{ products: PaginatedResponse<Product>; parameters: unknown }>(cursor, {
            params: generateQueryParams(),
            headers: { Accept: 'application/json' },
        });

        return {
            data: response.data.products.data as Product[],
            nextCursor: response.data.products.next_page_url ?? null,
        };
    };

    useEffect(() => {
        if (parameter) {
            setAvailability({
                'in-stock': parameter.availability?.includes('in-stock') ?? false,
                'out-of-stock': parameter.availability?.includes('out-of-stock') ?? false,
            });
            setPriceRange({
                min: parameter.price_min ?? 0,
                max: parameter.price_max ?? 0,
            });
            setSortBy(parameter.sort_by ?? initialSort);
        }
    }, [parameter]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filtersChanged.current) {
                const queryParams = generateQueryParams();

                router.get(
                    route(localizedRouteName(`products.per-category`, locale), category.slug),
                    { ...queryParams },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                        onFinish: () => {
                            filtersChanged.current = false;
                        },
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [availability, sortBy, priceRange]);

    /*useEffect(() => {
        if (inView && productCursor) {
            axios
                .get(productCursor, {
                    params: {
                        ...generateQueryParams(),
                    },
                    headers: {
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    const newProducts = res.data.products.data as Product[];
                    const newCursor = res.data.products.next_page_url ?? '';

                    setProducts([...products, ...newProducts]);
                    setProductCursor(newCursor);
                });
        }
    }, [inView, productCursor]);

    useEffect(() => {
        if (!hasMounted.current) {
            if (parameter) {
                setAvailability({
                    'in-stock': parameter.availability?.includes('in-stock') ?? false,
                    'out-of-stock': parameter.availability?.includes('out-of-stock') ?? false,
                });
                setPriceRange({
                    min: parameter.price_min ?? 0,
                    max: parameter.price_max ?? 0,
                });
                setSortBy(parameter.sort_by ?? initialSort);
            }
            hasMounted.current = true;
            return;
        }

        const timeoutId = setTimeout(() => {
            const queryParams = generateQueryParams();

            router.get(
                route('products.per-category', category.slug),
                {
                    ...queryParams,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [availability, sortBy, priceRange]);*/

    const hasFilters = Boolean(availability['in-stock'] || availability['out-of-stock'] || priceRange.min > 0 || priceRange.max > 0);

    return (
        <>
            <MainLayout>
                <section className="container mx-auto px-4 py-5">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold">{category.name}</h1>
                        <h1 className="text-xl text-gray-500">{category.description}</h1>
                    </div>
                    <Separator className="my-4" />
                    <div className="my-4 flex flex-col justify-between gap-3 md:flex-row">
                        <div className="inline-flex flex-row items-center gap-2">
                            <span className="text-sm font-semibold">{t('filter_by', 'Filter by')}:</span>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="inline-flex items-center gap-2">
                                        {t('availability', 'Availability')}
                                        <ChevronsUpDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {availabilityFilterOptions.map((option) => (
                                        <DropdownMenuCheckboxItem
                                            key={option.value}
                                            checked={availability?.[option.value]}
                                            onCheckedChange={(checked) => {
                                                setAvailability((prev) => ({
                                                    ...prev,
                                                    [option.value]: checked,
                                                }));
                                                filtersChanged.current = true;
                                            }}
                                        >
                                            {option.label}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="inline-flex items-center gap-2">
                                        {t('price', 'Price')}
                                        <ChevronsUpDown />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start">
                                    <div className="flex flex-col">
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Label className="text-sm font-semibold">
                                                    {t('min_price', 'Min Price')}:
                                                    <Input
                                                        type="number"
                                                        value={priceRange.min === 0 ? '' : priceRange.min}
                                                        onChange={(e) => {
                                                            setPriceRange((prev) => ({
                                                                ...prev,
                                                                min: parseFloat(e.target.value) || 0,
                                                            }));
                                                            filtersChanged.current = true;
                                                        }}
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                        className="w-24 rounded border p-1"
                                                    />
                                                </Label>
                                            </div>
                                            <span>
                                                <Label className="text-sm font-semibold">
                                                    <span className="invisible">{t('to', 'to')}</span>
                                                    <Minus />
                                                </Label>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Label className="text-sm font-semibold">
                                                    {t('max_price', 'Max Price')}:
                                                    <Input
                                                        type="number"
                                                        value={priceRange.max === 0 ? '' : priceRange.max}
                                                        onChange={(e) => {
                                                            setPriceRange((prev) => ({
                                                                ...prev,
                                                                max: parseFloat(e.target.value) || 0,
                                                            }));
                                                            filtersChanged.current = true;
                                                        }}
                                                        inputMode="numeric"
                                                        placeholder="1000"
                                                        className="w-24 rounded border p-1"
                                                    />
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="inline-flex flex-row items-center gap-2">
                            <span className="text-sm font-semibold">{t('sort_by', 'Sort by')}:</span>
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="inline-flex min-w-48 items-center justify-between gap-2">
                                        {sortOptions.find((options) => options.value === sortBy)?.label}
                                        <ChevronsUpDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuRadioGroup
                                        value={sortBy}
                                        onValueChange={(val) => {
                                            setSortBy(val as SortOptions);
                                            filtersChanged.current = true;
                                        }}
                                    >
                                        {sortOptions.map((option) => (
                                            <DropdownMenuRadioItem key={option.value} value={option.value}>
                                                {option.label}
                                            </DropdownMenuRadioItem>
                                        ))}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    {hasFilters ? (
                        <div className="mb-4 flex flex-row flex-wrap items-center gap-3 border-y py-3">
                            {availability['in-stock'] && (
                                <FilterBadge
                                    label={t('available', 'Available')}
                                    onClear={() => {
                                        setAvailability((prev) => ({
                                            ...prev,
                                            ['in-stock']: false,
                                        }));
                                        filtersChanged.current = true;
                                    }}
                                />
                            )}
                            {availability['out-of-stock'] && (
                                <FilterBadge
                                    label={t('out_of_stock', 'Out of Stock')}
                                    onClear={() => {
                                        setAvailability((prev) => ({
                                            ...prev,
                                            ['out-of-stock']: false,
                                        }));
                                        filtersChanged.current = true;
                                    }}
                                />
                            )}
                            {priceRange.min > 0 && (
                                <FilterBadge
                                    label={`${t('min_price', 'Min Price')}: ${priceRange.min}`}
                                    onClear={() => {
                                        setPriceRange((prev) => ({ ...prev, min: 0 }));
                                        filtersChanged.current = true;
                                    }}
                                />
                            )}
                            {priceRange.max > 0 && (
                                <FilterBadge
                                    label={`${t('max_price', 'Max Price')}: ${priceRange.max}`}
                                    onClear={() => {
                                        setPriceRange((prev) => ({ ...prev, max: 0 }));
                                        filtersChanged.current = true;
                                    }}
                                />
                            )}
                            <Button onClick={() => resetAllFilters()} variant="outline" className="inline-flex items-center gap-2">
                                <span className="text-sm font-semibold">{t('reset_all_filters', 'Reset All Filters')}</span>
                            </Button>
                        </div>
                    ) : null}

                    <InfiniteScroll
                        initialData={ssgProducts.data}
                        initialCursor={ssgProducts.next_page_url}
                        fetchNextPage={fetchNextPage}
                        loading={<ProductCardSkeleton />}
                        parent={({ children }) => <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">{children}</div>}
                        emptyMessage={
                            <div className="col-span-full flex min-h-52 items-center justify-center text-center text-gray-500">
                                <p>{t('no_products_found', 'No products found')}</p>
                            </div>
                        }
                        renderItem={(product: Product, ref) => (
                            <ProductCard disabled={product.stock <= 0} ref={ref} key={product.id} product={product} />
                        )}
                    />

                    {/*<div className="mt-5 flex w-full justify-center">*/}
                    {/*    <Button size="lg" asChild variant="outline" className="px-10 py-6 shadow-lg">*/}
                    {/*        <Link href={route('products.per-category', product.category.slug)}>See More</Link>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </section>
            </MainLayout>
        </>
    );
}
