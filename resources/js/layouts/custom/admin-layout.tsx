import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebar } from '@/layouts/custom/admin-layout-component/app-sidebar';
import { router } from '@inertiajs/react';
import { User } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b">
                        <div className="flex items-center px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                        </div>
                        <div className="px-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full bg-gray-200 p-2">
                                    <User className="size-6" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Welcome!</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => {
                                            router.get(route('admin.codes'));
                                        }}
                                    >
                                        Change Code
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            router.post(route('admin.logout'));
                                        }}
                                        className="text-destructive data-[highlighted]:bg-destructive/80 data-[highlighted]:text-destructive-foreground"
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
                </SidebarInset>
            </SidebarProvider>
            <Toaster position="bottom-right" />
        </>
    );
}
