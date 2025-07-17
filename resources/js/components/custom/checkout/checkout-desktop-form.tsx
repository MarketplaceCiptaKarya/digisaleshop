import { BillingState, CheckoutForm, CheckoutItem } from '@/types';

import { AccordionDisc } from '@/components/custom/checkout/accordion-disc';
import { OrderItem } from '@/components/custom/checkout/order-item';
import { UserDetails } from '@/components/custom/checkout/user-details';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { currencyFormatter } from '@/lib/global';
import { InertiaFormProps } from '@inertiajs/react';

const BILLING_OPTIONS: BillingState[] = ['same', 'different'];

type DesktopFormProps = {
    form: InertiaFormProps<CheckoutForm>;
    billingState: BillingState;
    setBillingState: (state: BillingState) => void;
    checkoutItems: CheckoutItem[];
    total: number;
    onSubmit: (e: React.FormEvent) => void;
};

export const CheckoutDesktopForm = ({ form, billingState, setBillingState, checkoutItems, total, onSubmit }: DesktopFormProps) => {
    const { data, setData, errors } = form;
    const { t } = useTranslations();
    return (
        <form onSubmit={onSubmit} className="hidden lg:block">
            <div className="flex flex-row gap-6 pb-12">
                <div className="max-w-xl space-y-5">
                    {/* Contact Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">{t('contact', 'Contact')}</CardTitle>
                            <CardDescription>
                                {t('please_provide_your_contact_information', 'Please provide your contact information.')}
                            </CardDescription>
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
                            <CardDescription>
                                {t('please_provide_your_delivery_information', 'Please provide your shipping information.')}
                            </CardDescription>
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
                                            className="flex flex-1 cursor-default items-start justify-between gap-4 rounded-md px-3 py-4 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"
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
                            <Button size="lg" className="w-full" type="submit">
                                {t('pay', 'Pay')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="grow space-y-5">
                    {/* Order Summary Card */}
                    <Card className="gap-0">
                        <CardHeader className="gap-6">
                            <CardTitle className="inline-flex w-full flex-row items-center justify-between">
                                <span>{t('order_summary', 'Order Summary')}</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="px-4">
                            <div className="flex w-full flex-col gap-4 p-2 pt-6">
                                {checkoutItems.map((item) => (
                                    <OrderItem key={item.id} product={item} quantity={item.qty} />
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-row items-center justify-between">
                            <span className="font-bold">{t('total', 'Total')}:</span>
                            <span className="text-xl font-black">{currencyFormatter.format(total)}</span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </form>
    );
};
