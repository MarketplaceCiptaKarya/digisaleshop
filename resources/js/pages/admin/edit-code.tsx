import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/custom/admin-layout';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function EditCodeAdmin() {
    const [show, setShow] = useState<boolean>(false);
    const { submit, setData, data, errors, reset } = useForm<{ code: string }>({
        code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit('post', route('admin.codes.store'), {
            onSuccess: () => {
                toast.success('Code changed successfully!');
                reset('code');
            },
        });
    };

    return (
        <>
            <AdminLayout>
                <div className="flex h-full w-full items-center justify-center">
                    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                        <Card className="w-full max-w-sm">
                            <CardHeader>
                                <CardTitle>Change Your Code</CardTitle>
                                <CardDescription>Enter your new code</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="new-code">New Code</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-code"
                                                type={show ? 'text' : 'password'}
                                                placeholder="Enter your new code"
                                                className="pr-10"
                                                value={data.code}
                                                onChange={(e) => setData('code', e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => setShow(!show)}
                                                size="icon"
                                                variant="link"
                                                className="absolute top-0 right-0 rounded-full"
                                            >
                                                {show ? <Eye /> : <EyeOff />}
                                            </Button>
                                        </div>
                                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" className="w-full">
                                    Change Code
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}
