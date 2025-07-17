<?php

namespace App\Http\Controllers;

use App\Models\Code;
use App\Models\Product;
use App\Models\ProductGallery;
use Database\Seeders\CategorySeeder;
use Database\Seeders\StaticWebsiteDatumSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{

    public function seed(Request $request)
    {
        $key = $request->query('key');
        $accessCode = $request->query('access_code');

        if ($key !== config('app.seed_key')) {
            abort(403, 'Unauthorized action.');
        }

        $code = Code::firstOrCreate([
            'identifier' => hash('SHA256', '5Bl/Q5hxc8WfpPKKA8LJhw=='),
            'access_code' => \Hash::make($accessCode ?: '123'),
        ]);

        \Artisan::call('db:seed', [
            '--class' => CategorySeeder::class,
            '--force' => true,
        ]);

        \Artisan::call('db:seed', [
            '--class' => StaticWebsiteDatumSeeder::class,
            '--force' => true,
        ]);

        return response()->json([
            'message' => 'Code seeded successfully with ID: ' . $code->id
        ]);
    }

    public function index()
    {
        return Inertia::render('admin/index');
    }

    public function dashboard()
    {
        return to_route('admin.transactions');
    }

    private function productValidation(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make([
            "title" => $data['title'] ?? null,
            "description" => $data['description'] ?? null,
            "category" => $data['category'] ?? null,
            "price" => $data['price'] ?? null,
            "stock" => $data['stock'] ?? null,
            "weight" => $data['weight'] ?? null,
            "status" => $data['status'] ?? null,
            "media" => $data['media'] ?? null,
            "remove_media" => $data['remove_media'] ?? null,
        ], [
            "title" => "required|string|max:255",
            "description" => "nullable|string",
            "category" => "required|exists:categories,slug",
            "price" => "required|decimal:0,2|min:1",
            "stock" => "required|numeric|integer|min:0",
            "weight" => "required|numeric|integer|min:0",
            "status" => "required|in:active,inactive",
            "media" => "nullable|array",
            "media.*" => "image|mimes:jpg,jpeg,png,gif,webp",
            "remove_media" => "nullable|array|exists:product_galleries,id",
        ], [
            'media.*.image' => 'Each uploaded file must be an image.',
        ]);
    }

    public function postIndex(Request $request)
    {
        $identifier = hash('SHA256', '5Bl/Q5hxc8WfpPKKA8LJhw==');
        $inputCode = $request->input('code');

        $code = Code::where('identifier', $identifier)->first();

        if (!$code) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid access code.',
            ]);
        }

        if (!\Hash::check($inputCode, $code->access_code)) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid access code.',
            ]);
        }

        Session::put('admin-code-id', $code->id);

        return to_route('admin.dashboard');
    }

    public function transactions(Request $request)
    {
        $search = $request->query('search', '');
        $transactions = \App\Models\Transaction::query()
            ->with(['detailTransactions'])
            ->where('invoice_number', 'like', '%' . $search . '%')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/transactions', [
            'transactions' => $transactions,
            'search' => $search,
        ]);
    }

    public function products(Request $request)
    {
        $search = $request->query('search', '');

        $products = \App\Models\Product::query()
            ->with(['galleries', 'category'])
            ->whereHas('translations', function ($query) use ($search) {
                $query->where('title', 'ilike', '%' . $search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/products', [
            'products' => $products,
            'search' => $search,
        ]);
    }

    public function createProduct()
    {
        $categories = \App\Models\Category::all();
        return Inertia::render('admin/add-products', [
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $validations = $this->productValidation(
            $request->only([
                'title',
                'description',
                'category',
                'price',
                'stock',
                'weight',
                'status',
                'media',
            ])
        );

        if ($validations->fails()) {
            return redirect()->back()->withErrors($validations)->withInput();
        }

        $data = $validations->validated();

        $product = \App\Models\Product::create([
            'category_id' => \App\Models\Category::where('slug', $data['category'])->first()->id,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'weight' => $data['weight'],
            'status' => $data['status'],
            'slug' => Str::slug($data['title']) . '-' . Str::random(3),
        ]);

        foreach (config('app.supported_locales') as $supportedLocale) {
            $product->translateOrNew($supportedLocale)->title = $data['title'];
            $product->translateOrNew($supportedLocale)->description = $data['description'];
        }

        $product->save();

        if ($request->hasFile('media')) {
            $mediaFiles = $request->file('media');
            foreach ($mediaFiles as $file) {
                $filename = Str::slug($product->title) . '-' . Str::random(5) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('products', $filename);

                ProductGallery::create([
                    'product_id' => $product->id,
                    'media_url' => $path,
                    'type' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        return redirect()->back();
    }

    public function editProduct(Product $product)
    {
        $categories = \App\Models\Category::all();
        $product->load(['galleries', 'category']);

        return Inertia::render('admin/edit-products', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function updateProduct(Product $product, Request $request)
    {
        $validations = $this->productValidation(
            $request->only([
                'title',
                'description',
                'category',
                'price',
                'stock',
                'weight',
                'status',
                'media',
                'remove_media',
            ])
        );

        if ($validations->fails()) {
            return redirect()->back()->withErrors($validations)->withInput();
        }

        $data = $validations->validated();

        $product->update([
            'category_id' => \App\Models\Category::where('slug', $data['category'])->first()->id,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'weight' => $data['weight'],
            'status' => $data['status'],
        ]);

        foreach (config('app.supported_locales') as $supportedLocale) {
            $product->translateOrNew($supportedLocale)->title = $data['title'];
            $product->translateOrNew($supportedLocale)->description = $data['description'];
        }
        $product->save();

        foreach ($product->galleries->whereIn('id', $data['remove_media']) as $gallery) {
            \Storage::delete($gallery->getRawOriginal('media_url'));
            $gallery->forceDelete();
        }

        if ($request->hasFile('media')) {
            $mediaFiles = $request->file('media');
            foreach ($mediaFiles as $file) {
                $filename = Str::slug($product->title) . '-' . Str::random(5) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('products', $filename);

                ProductGallery::create([
                    'product_id' => $product->id,
                    'media_url' => $path,
                    'type' => $file->getClientOriginalExtension(),
                ]);
            }
        }

        return redirect()->back();
    }

    public function destroyProduct(Product $product)
    {
        $product->delete();
        return redirect()->back();
    }

    public function codes()
    {
        return Inertia::render('admin/edit-code');
    }

    public function storeCode(Request $request)
    {
        $sessionCodeId = $request->session()->get('admin-code-id');
        $code = $request->input('code');

        $currentCode = Code::where('id', $sessionCodeId)->first();

        if (!$currentCode) {
            return redirect()->back()->withErrors([
                'code' => 'Invalid session code.',
            ]);
        }

        $currentCode->update(['access_code' => \Hash::make($code)]);

        return redirect()->back();
    }

    public function logout(Request $request)
    {
        $request->session()->forget('admin-code-id');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('admin.index');
    }
}
