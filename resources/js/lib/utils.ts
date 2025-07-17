import axios from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FetchCheckoutData = { slug: string; qty: number };

export function fetchCheckoutRedirectUrl(
    locale: string,
    data: FetchCheckoutData[] | FetchCheckoutData,
    {
        onSuccess,
        onError,
        onFinally,
    }: {
        onSuccess: (checkoutUrl: string, expiredAt: string) => void;
        onError?: (error: unknown) => void;
        onFinally?: () => void;
    },
) {
    type Response = {
        checkout: {
            path: string;
            expired_at: string;
        };
    };
    axios
        .post<Response>(route(localizedRouteName('products.checkout.create', locale)), {
            items: Array.isArray(data) ? data : [data],
        })
        .then((response) => {
            onSuccess(route(localizedRouteName('products.checkout', locale), response.data.checkout.path), response.data.checkout.expired_at);
        })
        .catch((error) => {
            onError?.(error);
        })
        .finally(() => {
            onFinally?.();
        });
}

export const localizedRouteName = (name: string, locale: string) => {
    return locale === 'en' ? name : `${locale}.${name}`;
};
