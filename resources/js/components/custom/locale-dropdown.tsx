import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWebsiteData } from '@/hooks/use-website-data';
import { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';

const LocaleDropdown = () => {
    const { locale } = usePage<SharedData>().props;
    const { localeData } = useWebsiteData();
    const supportedLocales = localeData.map((item) => item.locale);

    const handleChange = (value: string) => {
        const currentRouteName = route().current();
        const currentParams = route().params;

        const parts = currentRouteName?.split('.') ?? [];
        const isPrefixed = supportedLocales.includes(parts[0]);

        const baseRouteName = isPrefixed ? parts.slice(1).join('.') : currentRouteName;
        const newRouteName = value === 'en' ? baseRouteName : `${value}.${baseRouteName}`;

        router.visit(route(newRouteName!, { ...currentParams }));
    };

    return (
        <div>
            <Select onValueChange={handleChange} defaultValue={locale}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="English" />
                </SelectTrigger>
                <SelectContent>
                    {localeData.map((item) => (
                        <SelectItem key={item.locale} value={item.locale}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
LocaleDropdown.displayName = 'LocaleDropdown';
export default LocaleDropdown;
