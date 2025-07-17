import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    categories: { id: string; name: string; slug: string }[];
    locale: string;
    translations: Record<string, string>;

    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
export type CursorPaginatedResponse<T> = {
    data: T[];
    path: string;
    per_page: number;
    next_cursor: string | null;
    next_page_url: string | null;
    prev_cursor: string | null;
    prev_page_url: string | null;
};

export type PaginatedResponse<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
export type ProductGallery = {
    id: string;
    product_id: string;
    media_url: string;
    type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type ProductCategory = {
    id: string;
    slug: string;
    name: string;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: string;
    slug: string;
    title: string;
    description: string;
    category_id: string;
    price: string;
    stock: number;
    weight: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    galleries: ProductGallery[];
    category: ProductCategory;
};

export type Transaction = {
    id: string;
    invoice_number: string;
    transaction_date: string;
    customer_contact: string;
    customer_shipping_first_name: string;
    customer_shipping_last_name: string;
    customer_shipping_address: string;
    customer_shipping_detail_address: string | null;
    customer_shipping_city: string;
    customer_shipping_province: string;
    customer_shipping_postal_code: string;
    customer_shipping_country: string;
    customer_billing_first_name: string;
    customer_billing_last_name: string;
    customer_billing_address: string;
    customer_billing_detail_address: string | null;
    customer_billing_city: string;
    customer_billing_province: string;
    customer_billing_postal_code: string;
    customer_billing_country: string;
    total_amount: string;
    total_weight: number;
    status: string;
    created_at: string;
    updated_at: string;
    detail_transactions: DetailTransaction[];
};

export type DetailTransaction = {
    product_id: string;
    transaction_id: string;
    snapshot_image: string;
    snapshot_title: string;
    snapshot_description: string;
    snapshot_category: string;
    snapshot_price: string;
    snapshot_weight: number;
    quantity: number;
    subtotal: string;
    created_at: string;
    updated_at: string;
};

export type AccordionState = 'open' | 'close';
export type BillingState = 'same' | 'different';

export type ShippingForm = {
    first_name: string;
    last_name: string;
    address: string;
    detail_address?: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
};

export type BillingForm = ShippingForm;

export type CheckoutForm = {
    contact: string;
    shipping: ShippingForm;
    billing: BillingForm;
    save_shipping: boolean;
};

export type CheckoutItem = Pick<Product, 'id' | 'title' | 'price' | 'galleries' | 'slug'> & {
    qty: number;
};
