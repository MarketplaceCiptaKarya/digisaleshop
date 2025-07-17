<?php

namespace App\Http\Controllers;

use App\Models\Checkout;
use App\Models\DetailTransaction;
use App\Models\DetailTransactionTranslation;
use App\Models\Product;
use App\PaymentGateway\PaymentGateway;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    private PaymentGateway $paymentGateway;

    public function __construct(PaymentGateway $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    public function welcome()
    {
        $categories = \App\Models\Category::all();

        $productsByCategory = $categories->map(function ($category) {
            $products = \App\Models\Product::with(['category', 'galleries'])
                ->where('category_id', $category->id)
                ->where('status', 'active')
                ->where('stock', '>', 0)
                ->orderByDesc('sold')
                ->take(12)
                ->get();

            return [
                'category' => [
                    'slug' => $category->slug,
                    'name' => $category->name
                ],
                'data' => $products,
            ];
        });
        return Inertia::render('users/welcome', [
            'productsByCategory' => $productsByCategory,
        ]);
    }

    public function detailsProduct(string $slug)
    {
        $product = \App\Models\Product::with(['category', 'galleries'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        return Inertia::render('users/details-product', [
            'product' => $product,
        ]);
    }

    public function productPerCategory(string $category, Request $request)
    {
        $category = \App\Models\Category::where('slug', $category)->firstOrFail();

        $query = Product::with(['category', 'galleries'])
            ->where('category_id', $category->id)
            ->where('status', 'active');

        // ✅ Availability Filter
        if ($request->has('availability')) {
            $availability = $request->input('availability');

            $query->where(function ($subQuery) use ($availability) {
                if (in_array('in-stock', $availability)) {
                    $subQuery->orWhere('stock', '>', 0);
                }
                if (in_array('out-of-stock', $availability)) {
                    $subQuery->orWhere('stock', '<=', 0);
                }
            });
        }

        // ✅ Price Filter
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->input('price_min'));
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }

        $query->orderByRaw('CASE WHEN stock > 0 THEN 0 ELSE 1 END');

        $locale = app()->getLocale();
        $query->join('products_translations as pt', function ($join) use ($locale) {
            $join->on('products.id', '=', 'pt.product_id')
                ->where('pt.locale', '=', $locale);
        });
        $query->addSelect('products.*');

        // ✅ Sorting
        switch ($request->input('sort_by')) {
            case 'name-asc':
                $query->orderBy('pt.title', 'asc')->orderBy('id', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('pt.title', 'desc')->orderBy('id', 'desc');
                break;
            case 'price-asc':
                $query->orderBy('price', 'asc')->orderBy('id', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc')->orderBy('id', 'desc');
                break;
            case 'created-at-asc':
                $query->orderBy('created_at', 'asc')->orderBy('id', 'asc');
                break;
            case 'created-at-desc':
                $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                break;
            case 'best-seller':
                $query->orderBy('sold', 'desc')->orderBy('id', 'desc');
                break;
            default:
                $query->orderBy('updated_at', 'desc')->orderBy('id', 'desc');
                break;
        }

        $products = $query->paginate(12)->withQueryString();

        $parameter = [];

        if ($request->has('availability')) {
            $parameter['availability'] = $request->input('availability', []);
        }

        if ($request->filled('price_min')) {
            $parameter['price_min'] = (int)$request->input('price_min');
        }

        if ($request->filled('price_max')) {
            $parameter['price_max'] = (int)$request->input('price_max');
        }

        if ($request->filled('sort_by')) {
            $parameter['sort_by'] = $request->input('sort_by');
        }

        $returnedParams = !empty($parameter) ? $parameter : null;

        if ($request->expectsJson()) {
            return response()->json([
                'products' => $products,
                'parameter' => $returnedParams
            ]);
        }

        return Inertia::render('users/products-per-category', [
            'products' => $products,
            'parameter' => $returnedParams,
            'category' => [
                'name' => $category->name,
                'slug' => $category->slug,
            ],
        ]);
    }

    private function cartValidation(array $data): Validator
    {
        return \Illuminate\Support\Facades\Validator::make(['cart' => $data], [
            'cart' => 'present|array',
            'cart.*.slug' => 'required|string',
            'cart.*.qty' => 'required|integer|min:1',
        ]);
    }

    public function cart(Request $request)
    {
        if (!$request->expectsJson()) {
            return redirect()->back()->withErrors([
                'message' => 'Invalid request format. Expected JSON.',
            ]);
        }

        $cart = $request->input('cart');
        $validator = $this->cartValidation($cart);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid cart data',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $validatedCart = $validated['cart'] ?? [];
        $cartBySlug = collect($validatedCart)->keyBy('slug');

        $foundSlugs = Product::whereIn('slug', collect($validatedCart)->pluck('slug'))
            ->pluck('slug');

        $productNotFound = collect($validatedCart)
            ->pluck('slug')
            ->diff($foundSlugs)
            ->values();

        $products = Product::withTranslation()->with(['category', 'galleries'])
            ->whereIn('slug', collect($validatedCart)->pluck('slug'))
            ->where('status', 'active')
            ->select([
                'id',
                'slug',
                'price',
                'stock',
                'category_id'
            ])
            ->get()
            ->map(function ($product) use ($cartBySlug) {
                $product->qty = $cartBySlug[$product->slug]['qty'] >= 0 ? $cartBySlug[$product->slug]['qty'] : 1; // fallback qty = 1
                return $product;
            });

        return response()->json([
            'products' => $products,
            'products_not_found' => $productNotFound,
        ]);
    }

    public function checkout(string $path)
    {
        $checkout = Checkout::where('path', $path)->where('expired_at', '>', now())->firstOrFail();

        if ($checkout->redirect_url) {
            return Inertia::location($checkout->redirect_url);
        }

        $products = Product::with(['category', 'galleries'])
            ->whereIn('slug', collect($checkout->items)->pluck('slug'))
            ->where('status', 'active')
            ->select([
                'id',
                'slug',
                'price',
                'category_id'
            ])
            ->get()
            ->map(function ($product) use ($checkout) {
                $item = collect($checkout->items)->firstWhere('slug', $product->slug);
                $product->qty = $item['qty'] ?? 1;
                return $product;
            });

        return Inertia::render('users/checkout', [
            'checkoutItems' => $products,
            'path' => $checkout->path,
        ]);
    }

    private function checkoutValidation(array $data): \Illuminate\Validation\Validator
    {
        return \Illuminate\Support\Facades\Validator::make(['items' => $data], [
            'items' => 'required|array',
            'items.*.slug' => 'required|string|exists:products,slug',
            'items.*.qty' => 'required|integer|min:1',
        ]);
    }

    public function checkoutCreate(Request $request)
    {
        if (!$request->expectsJson()) {
            return redirect()->back()->withErrors([
                'message' => 'Invalid request format. Expected JSON.',
            ]);
        }

        $item = $request->input('items', []);

        $validator = $this->checkoutValidation($item);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid checkout data',
                'errors' => $validator->errors(),
            ], 422);
        }

        $products = Product::whereIn('slug', collect($item)->pluck('slug'))
            ->where('status', 'active')
            ->get();

        $filteredItems = collect($item)->filter(function ($i) use ($products) {
            $product = $products->firstWhere('slug', $i['slug']);

            return $product && $i['qty'] <= $product->stock;
        })->values();

        // Step 3: Return error if all items are invalid
        if ($filteredItems->isEmpty()) {
            return response()->json([
                'message' => 'All selected items are either out of stock or exceed available quantity.',
            ], 400);
        }

        $result = Checkout::create([
            'path' => str_replace('-', '', Str::uuid7()->toString()),
            'items' => $filteredItems,
            'expired_at' => now()->addDay(),
        ]);

        if (!$result) {
            return response()->json([
                'message' => 'Failed to create checkout session.',
            ], 500);
        }

        return response()->json([
            'checkout' => [
                'path' => $result->path,
                'expired_at' => $result->expired_at,
            ],
        ]);
    }

    private function userInformationValidation(array $data): \Illuminate\Validation\Validator
    {
        return \Illuminate\Support\Facades\Validator::make([
            'contact' => $data['contact'] ?? '',
            'shipping' => $data['shipping'] ?? [],
            'billing' => $data['billing'] ?? [],
            'save_shipping' => $data['save_shipping'] ?? null,
        ], [
            'contact' => 'required|string|max:255',

            // Shipping
            'shipping.first_name' => 'required|string|max:255',
            'shipping.last_name' => 'required|string|max:255',
            'shipping.address' => 'required|string|max:255',
            'shipping.detail_address' => 'nullable|string|max:255',
            'shipping.city' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'shipping.province' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'shipping.postal_code' => 'required|string|max:10|regex:/^[0-9\-]+$/',
            'shipping.country' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',

            // Billing (same structure as shipping)
            'billing.first_name' => 'required|string|max:255',
            'billing.last_name' => 'required|string|max:255',
            'billing.address' => 'required|string|max:255',
            'billing.detail_address' => 'nullable|string|max:255',
            'billing.city' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'billing.province' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',
            'billing.postal_code' => 'required|string|max:10|regex:/^[0-9\-]+$/',
            'billing.country' => 'required|string|max:255|regex:/^[\pL\s\-]+$/u',

            // Save shipping checkbox
            'save_shipping' => 'required|boolean',
        ]);
    }

    public function checkoutSession(Request $request, string $path)
    {
        //todo: remove this if any payment gateway implementation is ready
        return to_route('index');

        $data = $request->only(['contact', 'shipping', 'billing', 'save_shipping']);
        $validator = $this->userInformationValidation($data);

        if ($validator->fails()) {
            return redirect()->back()->withErrors(
                $validator->errors()
            )->withInput();
        }

        $validated = $validator->validated();

        try {
            \DB::beginTransaction();
            $checkout = Checkout::lockForUpdate()->where('path', $path)
                ->where('expired_at', '>', now())
                ->first();

            if (!$checkout) {
                return redirect()->back()->withErrors([
                    'message' => 'Checkout session not found or has expired.',
                ]);
            }

            $itemsBySlug = collect($checkout->items)->keyBy('slug');

            $products = Product::lockForUpdate()
                ->with(['category', 'galleries'])
                ->whereIn('slug', $itemsBySlug->keys())
                ->where('status', 'active')
                ->get();

            $totalPrice = 0;
            $totalWeight = 0;
            $detailTransactions = [];
            $translationRows = [];

            $detailId = (string)Str::uuid();
            $locale = app()->getLocale();

            foreach ($products as $product) {
                $item = $itemsBySlug->get($product->slug);
                $qty = $item['qty'] ?? 1;
                $totalPrice += $product->price * $qty;
                $totalWeight += $product->weight * $qty;
                $detailTransactions[] = [
                    'id' => $detailId,
                    'product_id' => $product->id,
                    'transaction_id' => null, // Will be set later
                    'snapshot_image' => $product->galleries->first()->media_url ?? null,
                    'snapshot_price' => $product->price,
                    'snapshot_weight' => $product->weight,
                    'quantity' => $qty,
                    'subtotal' => $product->price * $qty,
                ];

                foreach (config('app.supported_locales') as $supportedLocale) {
                    $productTranslated = $product->getTranslation($supportedLocale);

                    if (!$productTranslated?->title) {
                        continue;
                    }

                    // Create translation row for each locale
                    $translationRows[] = [
                        'details_transaction_id' => $detailId,
                        'locale' => $supportedLocale,
                        'snapshot_title' => $productTranslated->title,
                        'snapshot_description' => $productTranslated->description ?? null,
                        'snapshot_category' => $product->category->getTranslation($supportedLocale)->name,
                    ];
                }
            }

            $transactionHeader = $checkout->transaction()->create([
                'transaction_date' => Carbon::now(),
                'customer_contact' => $validated['contact'],
                'customer_shipping_first_name' => $validated['shipping']['first_name'],
                'customer_shipping_last_name' => $validated['shipping']['last_name'],
                'customer_shipping_address' => $validated['shipping']['address'],
                'customer_shipping_detail_address' => $validated['shipping']['detail_address'] ?? null,
                'customer_shipping_city' => $validated['shipping']['city'],
                'customer_shipping_province' => $validated['shipping']['province'],
                'customer_shipping_postal_code' => $validated['shipping']['postal_code'],
                'customer_shipping_country' => $validated['shipping']['country'],
                'customer_billing_first_name' => $validated['billing']['first_name'],
                'customer_billing_last_name' => $validated['billing']['last_name'],
                'customer_billing_address' => $validated['billing']['address'],
                'customer_billing_detail_address' => $validated['billing']['detail_address'] ?? null,
                'customer_billing_city' => $validated['billing']['city'],
                'customer_billing_province' => $validated['billing']['province'],
                'customer_billing_postal_code' => $validated['billing']['postal_code'],
                'customer_billing_country' => $validated['billing']['country'],
                'total_amount' => $totalPrice,
                'total_weight' => $totalWeight,
            ]);

            foreach ($detailTransactions as &$detail) {
                $detail['transaction_id'] = $transactionHeader->id;
                $detail['created_at'] = now();
                $detail['updated_at'] = now();
            }

            DetailTransaction::insert($detailTransactions);
            DetailTransactionTranslation::insert($translationRows);

            $currency = 1; // todo

            $paymentGatewayPayload = [
                'product' => collect($translationRows)
                    ->where('locale', $locale === 'id' ? 'id' : 'en')
                    ->pluck('snapshot_title')
                    ->toArray(),
                'description' => collect($translationRows)
                    ->where('locale', $locale === 'id' ? 'id' : 'en')
                    ->pluck('snapshot_description')
                    ->map(fn($desc) => Str::limit(strip_tags($desc), 100))
                    ->toArray(),

                'qty' => collect($detailTransactions)->pluck('quantity')->map(fn($qty) => (string)$qty)->toArray(),
                'price' => collect($detailTransactions)->pluck('snapshot_price')->map(fn($price) => (string)($price * $currency))->toArray(),
                'imageUrl' => collect($detailTransactions)->pluck('snapshot_image')->toArray(),

                'referenceId' => $transactionHeader->invoice_number,
                'returnUrl' => route($locale === 'en' ? 'index' : "{$locale}.index"), //todo
                'cancelUrl' => route($locale === 'en' ? 'index' : "{$locale}.index"), //todo
                'notifyUrl' => route('checkout.notification'),
                'buyerName' => $transactionHeader->customer_billing_first_name . ' ' . $transactionHeader->customer_billing_last_name,
                'lang' => $locale === 'id' ? 'id' : 'en',
                ...(filter_var($transactionHeader->customer_contact, FILTER_VALIDATE_EMAIL)
                    ? ['buyerEmail' => $transactionHeader->customer_contact]
                    : ['buyerPhone' => $transactionHeader->customer_contact]
                ),
            ];

            $paymentGatewayResponse = $this->paymentGateway->redirectPayment($paymentGatewayPayload);

            if ($paymentGatewayResponse['Status'] !== 200) {
                \DB::rollBack();
                return redirect()->back()->withErrors([
                    'message' => 'Failed to create transaction. Please try again later.',
                    'error' => $paymentGatewayResponse['Message'] ?? 'Unknown error',
                ]);
            }

            $checkout->update([
                'redirect_url' => $paymentGatewayResponse['Data']['Url'],
                'transaction_id' => $transactionHeader->id,
            ]);

            \DB::commit();

            return Inertia::location($paymentGatewayResponse['Data']['Url']);
        } catch (\Throwable $e) {
            \DB::rollBack();
            return redirect()->back()->withErrors([
                'message' => 'Failed to create transaction. Please try again later.',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
