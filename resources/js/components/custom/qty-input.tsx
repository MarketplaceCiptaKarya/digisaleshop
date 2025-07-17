import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type QuantityInputProps = {
    value?: number;
    onChange?: (value: number) => void;
    buttonClassName?: string;
    inputClassName?: string;
    disabled?: boolean;
    max?: number;
};
const QuantityInput = ({ value: val = 1, onChange, buttonClassName, inputClassName, disabled = false, max = Infinity }: QuantityInputProps) => {
    const [value, setValue] = useState<number>(val);

    // Sync internal state when parent changes prop
    useEffect(() => {
        setValue(val);
    }, [val]);

    const setAndEmit = (newValue: number) => {
        setValue(newValue);
        onChange?.(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numeric = e.target.value.replace(/\D/g, '');
        let newValue = numeric ? parseInt(numeric) : 1;

        if (max !== undefined) {
            newValue = Math.min(newValue, max);
        }

        setAndEmit(newValue);
    };

    const handleMinus = () => setAndEmit(Math.max(value - 1, 1));
    const handlePlus = () => {
        const newValue = max !== undefined ? Math.min(value + 1, max) : value + 1;
        setAndEmit(newValue);
    };

    return (
        <div className="inline-flex flex-row gap-1">
            <Button disabled={disabled} className={cn(buttonClassName)} variant="default" size="icon" onClick={() => handleMinus()}>
                <Minus />
            </Button>
            <Input
                disabled={disabled}
                id="quantity-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                className={cn('w-full max-w-20 text-center', inputClassName)}
                inputMode="numeric"
                pattern="\d*"
                value={value}
                onChange={handleChange}
            />
            <Button disabled={disabled} className={cn(buttonClassName)} variant="default" size="icon" onClick={() => handlePlus()}>
                <Plus />
            </Button>
        </div>
    );
};

QuantityInput.displayName = 'QuantityInput';
export default QuantityInput;
