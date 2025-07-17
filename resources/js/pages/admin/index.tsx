import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export default function AdminIndex() {
    const { submit, reset, data, setData, errors } = useForm<{ code: string }>({
        code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit('post', route('admin.index.post'), {
            onError: () => {
                reset('code');
            },
        });
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Admin Portal</CardTitle>
                        <CardDescription>Enter your code below to login to admin portal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    type="password"
                                    placeholder="Enter Your Code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                />
                                {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
