import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const useTranslations = () => {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string, fallback?: string) => translations[key] || fallback || key;

    return { t };
};
