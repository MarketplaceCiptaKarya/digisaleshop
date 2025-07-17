import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export default function Combobox({
    list,
    value: val,
    onChange,
}: {
    list: { label: string; value: string }[];
    value?: string;
    onChange?: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(val);
    const handleChange = (newValue: string) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                    {value ? list.find((framework) => framework.value === value)?.label : 'Select category...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search category..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {list.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        handleChange(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {framework.label}
                                    <Check className={cn('ml-auto', value === framework.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
