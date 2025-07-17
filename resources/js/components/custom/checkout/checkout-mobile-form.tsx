import { AccordionState, BillingState, CheckoutForm, CheckoutItem } from '@/types';

import { AccordionDisc } from '@/components/custom/checkout/accordion-disc';
import { OrderItem } from '@/components/custom/checkout/order-item';
import { UserDetails } from '@/components/custom/checkout/user-details';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { currencyFormatter } from '@/lib/global';
import { InertiaFormProps } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';

const BILLING_OPTIONS: BillingState[] = ['same', 'different'];

type MobileFormProps = {
    form: InertiaFormProps<CheckoutForm>;
    orderAccordion: AccordionState;
    setOrderAccordion: (state: AccordionState) => void;
    billingState: BillingState;
    setBillingState: (state: BillingState) => void;
    checkoutItems: CheckoutItem[];
    total: number;
    onSubmit: (e: React.FormEvent) => void;
};

export const CheckoutMobileForm = ({
    form,
    orderAccordion,
    setOrderAccordion,
    billingState,
    setBillingState,
    checkoutItems,
    total,
    onSubmit,
}: MobileFormProps) => {
    const { data, setData, errors } = form;
    const { t } = useTranslations();

    const toggleOrderAccordion = () => setOrderAccordion(orderAccordion === 'close' ? 'open' : 'close');

    return (
        <form onSubmit={onSubmit} className="block space-y-5 lg:hidden">
            {/* Order Summary Card */}
            <Card className="gap-0">
                <a role="button" onClick={toggleOrderAccordion}>
                    <CardHeader className="gap-6">
                        <CardTitle className="inline-flex w-full flex-row items-center justify-between">
                            <span>{t('order_summary', 'Order Summary')}</span>
                            <span className="text-lg font-bold">{currencyFormatter.format(total)}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-row items-center justify-center gap-2">
                            <span className="pointer-events-none">{t('order_summary', 'Order Summary')}</span>
                            <ChevronDownIcon
                                className={`pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200 ${
                                    orderAccordion === 'close' ? '-rotate-180' : 'rotate-0'
                                }`}
                            />
                        </CardDescription>
                    </CardHeader>
                </a>
                <CardContent className="px-4">
                    <Accordion type="single" collapsible value={orderAccordion} onValueChange={(value) => setOrderAccordion(value as AccordionState)}>
                        <AccordionItem value="open">
                            <AccordionContent className="flex flex-col gap-4 p-0 pt-4 text-balance">
                                <div className="flex w-full flex-col gap-4 p-2">
                                    {checkoutItems.map((item) => (
                                        <OrderItem key={item.id} product={item} quantity={item.qty} />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{t('contact', 'Contact')}</CardTitle>
                    <CardDescription>{t('please_provide_your_contact_information', 'Please provide your contact information.')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="contact" className="grid w-full items-center gap-3">
                        {t('email_or_phone_number', 'Email or Phone Number')}
                        <Input
                            type="text"
                            inputMode="email"
                            id="contact"
                            className={'font-normal'}
                            placeholder={t('email_or_phone_number', 'Email or Phone Number')}
                            value={data.contact}
                            onChange={(e) => setData('contact', e.target.value)}
                        />
                    </Label>
                    {errors.contact && <p className="mt-2 text-sm text-red-500">{errors.contact}</p>}
                </CardContent>
            </Card>

            {/* Delivery Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{t('delivery', 'Delivery')}</CardTitle>
                    <CardDescription>{t('please_provide_your_delivery_information', 'Please provide your shipping information.')}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <UserDetails form={form} type="shipping" />
                    <Label className="flex items-center gap-3">
                        <Checkbox
                            checked={data.save_shipping}
                            onCheckedChange={(checked) => {
                                setData('save_shipping', !!checked);
                            }}
                        />
                        {t('save_this_information_for_next_time', 'Save this information for next time')}
                    </Label>
                </CardContent>
            </Card>

            {/* Billing Address Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{t('billing_address', 'Billing Address')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Accordion
                        type="single"
                        collapsible
                        className="rounded border"
                        value={billingState}
                        onValueChange={(value) => setBillingState(value as BillingState)}
                    >
                        {BILLING_OPTIONS.map((option) => (
                            <AccordionItem key={option} value={option}>
                                <a
                                    role="button"
                                    onClick={() => setBillingState(option)}
                                    className="flex flex-1 items-start justify-between gap-4 rounded-md px-3 py-4 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <AccordionDisc checked={billingState === option} />
                                        {option === 'same'
                                            ? t('same_as_delivery_address', 'Same as shipping address')
                                            : t('use_different_billing_address', 'Use a different billing address')}
                                    </span>
                                </a>
                                {option === 'different' && (
                                    <AccordionContent className="flex flex-col gap-4 px-3 text-balance">
                                        <UserDetails form={form} type="billing" />
                                    </AccordionContent>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Total Card */}
            <Card>
                <CardContent className="space-y-4">
                    <div className="inline-flex w-full items-center justify-between">
                        <span className="font-bold">{t('total', 'Total')}:</span>
                        <span className="text-xl font-black">{currencyFormatter.format(total)}</span>
                    </div>
                    <Button size="lg" className="w-full" type="submit">
                        {t('pay', 'Pay')}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
};
