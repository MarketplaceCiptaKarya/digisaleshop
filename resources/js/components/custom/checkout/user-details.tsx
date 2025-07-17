import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { BillingForm, CheckoutForm, ShippingForm } from '@/types';
import { InertiaFormProps } from '@inertiajs/react';

type UserDetailsProps = {
    form: InertiaFormProps<CheckoutForm>;
    type: 'shipping' | 'billing';
};

export const UserDetails = ({ form, type }: UserDetailsProps) => {
    const { setData, data, errors } = form;
    const { t } = useTranslations();
    const userData = data[type];

    const getError = (field: string) => {
        const errorKey = `${type}.${field}` as keyof typeof errors;
        return errors[errorKey] as string | undefined;
    };
    const handleChange = (field: keyof ShippingForm | keyof BillingForm, value: string) => {
        setData(type, { ...userData, [field]: value });
    };

    return (
        <>
            <div className="flex w-full flex-col gap-4 md:flex-row">
                <Label className="grid w-full items-center gap-3">
                    {t('first_name', 'First Name')}
                    <div>
                        <Input
                            type="text"
                            placeholder={t('first_name', 'First Name')}
                            className="font-normal"
                            value={userData.first_name}
                            onChange={(e) => handleChange('first_name', e.target.value)}
                        />
                        {getError('first_name') && <p className="mt-2 text-sm font-normal text-red-500">{getError('first_name')}</p>}
                    </div>
                </Label>

                <Label className="grid w-full items-center gap-3">
                    {t('last_name', 'Last Name')}
                    <div>
                        <Input
                            type="text"
                            placeholder={t('last_name', 'Last Name')}
                            className="font-normal"
                            value={userData.last_name}
                            onChange={(e) => handleChange('last_name', e.target.value)}
                        />
                        {getError('last_name') && <p className="mt-2 text-sm font-normal text-red-500">{getError('last_name')}</p>}
                    </div>
                </Label>
            </div>

            <Label className="grid w-full items-center gap-3">
                {t('address', 'Address')}
                <div>
                    <Input
                        type="text"
                        placeholder={t('address', 'Address')}
                        className="font-normal"
                        value={userData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                    />
                    {getError('address') && <p className="mt-2 text-sm font-normal text-red-500">{getError('address')}</p>}
                </div>
            </Label>

            <Label className="grid w-full items-center gap-3">
                {t('apartment_suite_etc', 'Apartment, suite, etc. (optional)')}
                <div>
                    <Input
                        type="text"
                        placeholder={t('apartment_suite_etc', 'Apartment, suite, etc. (optional)')}
                        className="font-normal"
                        value={userData.detail_address}
                        onChange={(e) => handleChange('detail_address', e.target.value)}
                    />
                    {getError('detail_address') && <p className="mt-2 text-sm font-normal text-red-500">{getError('detail_address')}</p>}
                </div>
            </Label>

            <div className="flex w-full flex-col gap-4 md:flex-row">
                <Label className="grid w-full items-center gap-3">
                    {t('city', 'City')}
                    <div>
                        <Input
                            type="text"
                            placeholder={t('city', 'City')}
                            className="font-normal"
                            value={userData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        />
                        {getError('city') && <p className="mt-2 text-sm font-normal text-red-500">{getError('city')}</p>}
                    </div>
                </Label>

                <Label className="grid w-full items-center gap-3">
                    {t('province', 'Province')}

                    <div>
                        <Input
                            type="text"
                            placeholder={t('province', 'Province')}
                            className="font-normal"
                            value={userData.province}
                            onChange={(e) => handleChange('province', e.target.value)}
                        />
                        {getError('province') && <p className="mt-2 text-sm font-normal text-red-500">{getError('province')}</p>}
                    </div>
                </Label>

                <Label className="grid w-full items-center gap-3">
                    {t('postal_code', 'Postal Code')}
                    <div>
                        <Input
                            type="text"
                            placeholder={t('postal_code', 'Postal Code')}
                            className="font-normal"
                            value={userData.postal_code}
                            onChange={(e) => handleChange('postal_code', e.target.value)}
                        />
                        {getError('postal_code') && <p className="mt-2 text-sm font-normal text-red-500">{getError('postal_code')}</p>}
                    </div>
                </Label>
            </div>

            <Label className="grid w-full items-center gap-3">
                {t('country', 'Country')}
                <div>
                    <Input
                        type="text"
                        placeholder={t('country', 'Country')}
                        className="font-normal"
                        value={userData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                    />
                    {getError('country') && <p className="mt-2 text-sm font-normal text-red-500">{getError('country')}</p>}
                </div>
            </Label>
        </>
    );
};
