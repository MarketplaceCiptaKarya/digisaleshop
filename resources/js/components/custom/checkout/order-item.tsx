import { useTranslations } from '@/hooks/use-translations';
import { currencyFormatter } from '@/lib/global';
import { CheckoutItem } from '@/types';

export const OrderItem = ({ product, quantity }: { product: CheckoutItem; quantity: number }) => {
    const { t } = useTranslations();
    return (
        <div className="flex w-full gap-2 border-b pb-4 last:border-b-0">
            <div className="inline-flex size-16 shrink-0 items-center justify-center rounded border-1 p-0.5 md:size-24">
                <img src={product.galleries[0].media_url} loading="lazy" alt={product.title} className="w-full object-contain" />
            </div>
            <div className="flex grow flex-col gap-2">
                <span className="font-semibold">{product.title}</span>
                <span className="text-sm text-muted-foreground">
                    {t('quantity', 'Quantity')}: {quantity}
                </span>
            </div>
            <div className="flex items-center justify-end">
                <span className="text-lg font-semibold">{currencyFormatter.format(parseFloat(product.price) * quantity)}</span>
            </div>
        </div>
    );
};
