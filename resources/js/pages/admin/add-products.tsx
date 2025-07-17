import Combobox from '@/components/custom/combobox';
import PreviewMedia from '@/components/custom/preview-media';
import RichTextEditor from '@/components/custom/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/custom/admin-layout';
import { SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';

export default function AddProducts() {
    const { categories } = usePage<SharedData & { categories: { id: string; slug: string; name: string }[] }>().props;
    const { submit, setData, data, errors, reset } = useForm<{
        title: string;
        description: string;
        media: File[];
        category: string;
        price: number;
        stock: number;
        weight: number;
        status: string;
    }>({
        title: '',
        description: '',
        media: [],
        category: '',
        price: 0,
        stock: 0,
        weight: 0,
        status: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit('post', route('admin.products.store'), {
            onSuccess: () => {
                reset();
                router.visit(route('admin.products'));
            },
        });
    };

    return (
        <>
            <AdminLayout>
                <form onSubmit={handleSubmit} className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Product</CardTitle>
                            <CardDescription>Fill this form to add a product</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Label className="grid w-full max-w-lg items-center gap-3">
                                    Title
                                    <Input type="text" placeholder="Title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </Label>
                                <div className="grid w-full items-center gap-3">
                                    <Label>Description</Label>
                                    <RichTextEditor defaultHtmlValue={data.description} onChangeResult={(html) => setData('description', html)} />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                                <div className="grid w-full items-center gap-3">
                                    {/*<Label className="grid w-full max-w-lg items-center gap-3">*/}
                                    {/*    Media*/}
                                    {/*    <Input type="file" multiple onChange={(e) => setData('media', Array.from(e.target.files ?? []))} />*/}
                                    {/*</Label>*/}
                                    {/*{errors.media && <p className="text-sm text-red-500">{errors.media}</p>}*/}
                                    {/*<div className="h-96 w-full rounded border border-dashed shadow"></div>*/}
                                    <PreviewMedia
                                        onChange={(newMedia) => {
                                            setData('media', newMedia);
                                        }}
                                        error={Object.keys(errors)
                                            .filter((key) => key.startsWith('media.'))
                                            .map((key) => (errors as Record<string, string>)[key])
                                            .join(', ')}
                                    />
                                </div>

                                <Label className="grid w-full max-w-xs items-center gap-3">
                                    Category
                                    <Combobox
                                        onChange={(value) => setData('category', value)}
                                        value={data.category}
                                        list={categories.map((item) => ({
                                            label: item.name,
                                            value: item.slug,
                                        }))}
                                    />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </Label>

                                <Label className="grid w-full max-w-40 items-center gap-3">
                                    Price
                                    <Input
                                        type="number"
                                        step=".01"
                                        inputMode="decimal"
                                        placeholder="Price"
                                        value={data.price === 0 ? '' : data.price}
                                        onChange={(e) => setData('price', parseFloat(e.target.value))}
                                    />
                                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                                </Label>
                                <Label className="grid w-full max-w-40 items-center gap-3">
                                    Stock
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="Stock"
                                        value={data.stock === 0 ? '' : data.stock}
                                        onChange={(e) => setData('stock', parseInt(e.target.value))}
                                    />
                                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                                </Label>
                                <Label className="grid w-full max-w-40 items-center gap-3">
                                    Weight (gram)
                                    <Input
                                        type="number"
                                        inputMode="numeric"
                                        placeholder="Weight"
                                        value={data.weight === 0 ? '' : data.weight}
                                        onChange={(e) => setData('weight', parseInt(e.target.value))}
                                    />
                                    {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                                </Label>
                                <Label className="grid w-full max-w-40 items-center gap-3">
                                    Status
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </Label>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save</Button>
                        </CardFooter>
                    </Card>
                </form>
            </AdminLayout>
        </>
    );
}
