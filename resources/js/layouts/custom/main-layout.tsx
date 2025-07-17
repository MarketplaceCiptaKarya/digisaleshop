import { Footer } from '@/components/custom/footer';
import { Navbar } from '@/components/custom/navbar';
import { useWebsiteData } from '@/hooks/use-website-data';

type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    const data = useWebsiteData();

    return (
        <>
            <div className="w-full bg-black py-1 text-center text-white">{data.topBanner}</div>
            <Navbar logo={data.navbarData.logo} menu={data.navbarData.menu} />
            <main>{children}</main>
            <Footer
                logo={data.footerData.logo}
                menuItems={data.footerData.menuItems}
                copyright={data.footerData.copyright}
                bottomLinks={data.footerData.bottomLinks}
            />
        </>
    );
}
