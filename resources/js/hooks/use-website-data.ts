import { useTranslations } from '@/hooks/use-translations';
import { localizedRouteName } from '@/lib/utils';
import { AvailabilityFilterOptions, SortOptions } from '@/pages/users/products-per-category';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const useWebsiteData = () => {
    const { categories, locale } = usePage<SharedData>().props;
    const { t } = useTranslations();

    const localeData = [
        { locale: 'en', name: 'English' },
        { locale: 'id', name: 'Bahasa Indonesia' },
        { locale: 'cn', name: '简体中文' },
    ];

    const carouselData = [
        {
            image: 'https://fls-9f67cb78-b612-4971-bb1b-61833e70f625.laravel.cloud/carousel/carousel-1.jpg',
            alt: 'Carousel Image 1',
        },
        {
            image: 'https://fls-9f67cb78-b612-4971-bb1b-61833e70f625.laravel.cloud/carousel/carousel-2.jpg',
            alt: 'Carousel Image 2',
        },
        {
            image: 'https://fls-9f67cb78-b612-4971-bb1b-61833e70f625.laravel.cloud/carousel/carousel-3.jpg',
            alt: 'Carousel Image 3',
        },
    ];

    const topBanner = t('free_international_shipping', 'Free International Shipping ⛟');

    const navbarData = {
        logo: {
            url: route(localizedRouteName('index', locale)),
            title: 'Digisaleshop',
            img: {
                src: '/assets/logo.webp',
                alt: 'Digisaleshop Logo',
            },
        },
        menu: [
            {
                title: t('home', 'Home'),
                url: route(localizedRouteName(`index`, locale)),
            },
            ...categories.map((category) => ({
                title: category.name,
                url: route(localizedRouteName('products.per-category', locale), category.slug),
            })),
        ],
    };
    const footerData = {
        logo: {
            title: 'Digisaleshop',
            url: route(localizedRouteName(`index`, locale)),
            img: {
                src: '/assets/logo.webp',
                alt: 'Digisaleshop Logo',
            },
        },
        menuItems: [
            {
                title: t('menu', 'Menu'),
                links: categories.map((category) => ({
                    text: category.name,
                    url: route(localizedRouteName(`products.per-category`, locale), category.slug),
                })),
            },
            {
                title: t('information', 'Information'),
                links: [
                    { text: t('faq', 'FAQ'), url: route(localizedRouteName(`pages.faq`, locale)) },
                    { text: t('payments', 'Payments'), url: route(localizedRouteName(`pages.payments`, locale)) },
                    { text: t('shipping', 'Shipping'), url: route(localizedRouteName(`pages.shipping`, locale)) },
                    { text: t('returns', 'Returns'), url: route(localizedRouteName(`pages.returns`, locale)) },
                    {
                        text: t('cancellations', 'Cancellations'),
                        url: route(localizedRouteName(`pages.cancellations`, locale)),
                    },
                    {
                        text: t('terms_and_conditions', 'Terms & Conditions'),
                        url: route(localizedRouteName(`pages.terms-and-conditions`, locale)),
                    },
                ],
            },
            {
                title: t('customer_care', 'Customer Care'),
                links: [
                    { text: t('contact_us', 'Contact Us'), url: route(localizedRouteName(`pages.contact-us`, locale)) },
                    { text: t('about_us', 'About Us'), url: route(localizedRouteName(`pages.about-us`, locale)) },
                ],
            },
            {
                title: t('policies', 'Policies'),
                links: [
                    {
                        text: t('privacy_policy', 'Privacy Policy'),
                        url: route(localizedRouteName(`pages.privacy-policy`, locale)),
                    },
                    {
                        text: t('cookie_policy', 'Cookie Policy'),
                        url: route(localizedRouteName(`pages.cookies-policy`, locale)),
                    },
                ],
            },
        ],
        copyright: `© ${new Date().getFullYear()} Digisaleshop. All rights reserved.`,
        bottomLinks: [
            // { text: 'Privacy Policy', url: '#' },
            // { text: 'Cookie Policy', url: '#' },
        ],
    };
    const sortOptions: { label: string; value: SortOptions }[] = [
        { value: 'default', label: t('default', 'Default') },
        { value: 'best-seller', label: t('best_seller', 'Best Seller') },
        { value: 'name-asc', label: t('name_asc', 'Name (A-Z)') },
        { value: 'name-desc', label: t('name_desc', 'Name (Z-A)') },
        { value: 'price-asc', label: t('price_asc', 'Price (Low to High)') },
        { value: 'price-desc', label: t('price_desc', 'Price (High to Low)') },
        { value: 'created-at-asc', label: t('oldest', 'Oldest') },
        { value: 'created-at-desc', label: t('newest', 'Newest') },
    ];
    const availabilityFilterOptions: { label: string; value: AvailabilityFilterOptions }[] = [
        { value: 'in-stock', label: t('available', 'Available') },
        { value: 'out-of-stock', label: t('out_of_stock', 'Out of Stock') },
    ];

    return { navbarData, footerData, topBanner, carouselData, localeData, sortOptions, availabilityFilterOptions };
};
