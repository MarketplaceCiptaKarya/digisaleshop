import { Link } from '@inertiajs/react';

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        title: string;
        img?: {
            src: string;
            alt: string;
        };
    };
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        title: 'Shadcnblocks.com',
        url: 'https://www.shadcnblocks.com',
        img: {
            src: 'https://www.shadcnblocks.com/logo.png',
            alt: 'Shadcnblocks Logo',
        },
    },
    menuItems = [
        {
            title: 'Product',
            links: [
                { text: 'Overview', url: '#' },
                { text: 'Pricing', url: '#' },
                { text: 'Marketplace', url: '#' },
                { text: 'Features', url: '#' },
                { text: 'Integrations', url: '#' },
                { text: 'Pricing', url: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { text: 'About', url: '#' },
                { text: 'Team', url: '#' },
                { text: 'Blog', url: '#' },
                { text: 'Careers', url: '#' },
                { text: 'Contact', url: '#' },
                { text: 'Privacy', url: '#' },
            ],
        },
        {
            title: 'Resources',
            links: [
                { text: 'Help', url: '#' },
                { text: 'Sales', url: '#' },
                { text: 'Advertise', url: '#' },
            ],
        },
        {
            title: 'Social',
            links: [
                { text: 'Twitter', url: '#' },
                { text: 'Instagram', url: '#' },
                { text: 'LinkedIn', url: '#' },
            ],
        },
    ],
    copyright = '© 2024 Shadcnblocks.com. All rights reserved.',
    bottomLinks = [
        // { text: 'Terms and Conditions', url: '#' },
        // { text: 'Privacy Policy', url: '#' },
    ],
}: FooterProps) => {
    return (
        <section className="bg-gray-100 px-4 pt-5 pb-5">
            <div className="container mx-auto">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                {/*<p className="text-xl font-semibold">{logo.title}</p>*/}
                                <Link href={logo?.url} className={'flex items-center gap-2'}>
                                    <span className="rounded bg-black p-1">
                                        <img src={logo?.img?.src} className="max-h-8" alt={logo?.img?.alt} />
                                    </span>
                                </Link>
                            </div>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li key={linkIdx} className="font-medium hover:text-primary">
                                            <Link href={link.url}>{link.text}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>{copyright}</p>
                        <ul className="flex gap-4">
                            {bottomLinks.map((link, linkIdx) => (
                                <li key={linkIdx} className="underline hover:text-primary">
                                    <Link href={link.url}>{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
