// Define types for component props
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { Check, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AddToCartButtonProps {
    onAddToCart?: () => void;
    productName?: string;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'premium';
    size?: 'sm' | 'default' | 'lg' | 'icon';
    disabled?: boolean;
}

const AddToCartButton = ({ onAddToCart, productName = 'Item', size = 'default', variant = 'default', disabled = false }: AddToCartButtonProps) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const resetTimer = useRef<NodeJS.Timeout | null>(null);
    const successTimer = useRef<NodeJS.Timeout | null>(null);

    type SizeClasses = {
        [key in NonNullable<AddToCartButtonProps['size']>]: {
            button: string;
            icon: number;
        };
    };

    const sizeClasses: SizeClasses = {
        sm: {
            button: 'h-8 w-8',
            icon: 16,
        },
        default: {
            button: 'h-9 w-9',
            icon: 18,
        },
        lg: {
            button: 'h-10 w-10',
            icon: 20,
        },
        icon: {
            button: 'h-9 w-9',
            icon: 18,
        },
    };

    // Define variants
    const variantClasses = {
        default: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        premium: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90',
    };

    const handleClick = () => {
        if (disabled) return;

        // Clear any existing timers
        if (resetTimer.current) clearTimeout(resetTimer.current);
        if (successTimer.current) clearTimeout(successTimer.current);

        // Trigger animations
        setIsAnimating(true);

        // Call the provided callback
        if (onAddToCart) {
            onAddToCart();
        }

        // Reset animations after 300ms
        resetTimer.current = setTimeout(() => {
            setIsAnimating(false);
        }, 300);

        // Show success state
        setIsAdded(true);

        // Reset success state after 1 second
        successTimer.current = setTimeout(() => {
            setIsAdded(false);
        }, 1000);
    };

    // Cleanup timers on component unmount
    useEffect(() => {
        return () => {
            if (resetTimer.current) clearTimeout(resetTimer.current);
            if (successTimer.current) clearTimeout(successTimer.current);
        };
    }, []);

    return (
        <div className="relative">
            <Head>
                <style>{`
                    @keyframes bounce {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                    }

                    .animate-bounce-click {
                        animation: bounce 0.3s ease-out;
                    }
                `}</style>
            </Head>

            <Button
                variant={variant === 'premium' ? 'default' : variant}
                size="icon"
                className={`group relative transition-all duration-300 hover:shadow-lg ${sizeClasses[size].button} ${variantClasses[variant]} ${isAnimating ? 'animate-bounce-click' : ''} ${
                    isAdded ? '!bg-green-400 !text-green-50 hover:!bg-green-500' : ''
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
                onClick={handleClick}
                aria-label={`Add ${productName} to cart`}
                disabled={disabled}
            >
                {isAdded ? (
                    <Check size={sizeClasses[size].icon} className="transition-all" />
                ) : (
                    <>
                        <ShoppingCart size={sizeClasses[size].icon} className="transition-all" />
                    </>
                )}
            </Button>
        </div>
    );
};

AddToCartButton.displayName = 'AddToCartButton';
export default AddToCartButton;
