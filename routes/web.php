<?php

use Illuminate\Support\Facades\Route;

$locales = config('app.supported_locales');
$defaultLocale = config('app.locale');

foreach ($locales as $locale) {
    if ($locale === $defaultLocale) {
        Route::get('/', [\App\Http\Controllers\UserController::class, 'welcome'])->name('index');
        Route::post('/cart', [\App\Http\Controllers\UserController::class, 'cart'])->name('products.cart');

        Route::prefix('/pages')->group(function () {
            Route::get('/faq', [\App\Http\Controllers\WebsiteController::class, 'faq'])->name('pages.faq');
            Route::get('/payments', [\App\Http\Controllers\WebsiteController::class, 'payments'])->name('pages.payments');
            Route::get('/shipping', [\App\Http\Controllers\WebsiteController::class, 'shipping'])->name('pages.shipping');
            Route::get('/returns', [\App\Http\Controllers\WebsiteController::class, 'returns'])->name('pages.returns');
            Route::get('/cancellations', [\App\Http\Controllers\WebsiteController::class, 'cancellations'])->name('pages.cancellations');
            Route::get('/terms-and-conditions', [\App\Http\Controllers\WebsiteController::class, 'termsAndConditions'])
                ->name('pages.terms-and-conditions');

            Route::get('/contact-us', [\App\Http\Controllers\WebsiteController::class, 'contactUs'])->name('pages.contact-us');
            Route::get('/about-us', [\App\Http\Controllers\WebsiteController::class, 'aboutUs'])->name('pages.about-us');

            Route::get('/privacy-policy', [\App\Http\Controllers\WebsiteController::class, 'privacyPolicy'])->name('pages.privacy-policy');
            Route::get('/cookie-policy', [\App\Http\Controllers\WebsiteController::class, 'cookiesPolicy'])->name('pages.cookies-policy');
        });

        Route::prefix('/checkout')->group(function () {
            Route::post('/create', [\App\Http\Controllers\UserController::class, 'checkoutCreate'])
                ->name('products.checkout.create');
            Route::get('/session/{path}', [\App\Http\Controllers\UserController::class, 'checkout'])
                ->name('products.checkout');
            Route::post('/session/{path}', [\App\Http\Controllers\UserController::class, 'checkoutSession'])
                ->name('products.checkout.session');
        });

        Route::prefix('products')->group(function () {
            Route::get('/categories/{category}', [\App\Http\Controllers\UserController::class, 'productPerCategory'])
                ->name('products.per-category');
            Route::get('/{slug}', [\App\Http\Controllers\UserController::class, 'detailsProduct'])->name('products.show');
        });

    } else {
        Route::prefix($locale)->middleware('locale')->group(function () use ($locale) {
            Route::get('/', [\App\Http\Controllers\UserController::class, 'welcome'])->name("$locale.index");
            Route::post('/cart', [\App\Http\Controllers\UserController::class, 'cart'])->name("$locale.products.cart");

            Route::prefix('/pages')->group(function () use ($locale) {
                Route::get('/faq', [\App\Http\Controllers\WebsiteController::class, 'faq'])->name("$locale.pages.faq");
                Route::get('/payments', [\App\Http\Controllers\WebsiteController::class, 'payments'])->name("$locale.pages.payments");
                Route::get('/shipping', [\App\Http\Controllers\WebsiteController::class, 'shipping'])->name("$locale.pages.shipping");
                Route::get('/returns', [\App\Http\Controllers\WebsiteController::class, 'returns'])->name("$locale.pages.returns");
                Route::get('/cancellations', [\App\Http\Controllers\WebsiteController::class, 'cancellations'])->name("$locale.pages.cancellations");
                Route::get('/terms-and-conditions', [\App\Http\Controllers\WebsiteController::class, 'termsAndConditions'])
                    ->name("$locale.pages.terms-and-conditions");

                Route::get('/contact-us', [\App\Http\Controllers\WebsiteController::class, 'contactUs'])->name("$locale.pages.contact-us");
                Route::get('/about-us', [\App\Http\Controllers\WebsiteController::class, 'aboutUs'])->name("$locale.pages.about-us");

                Route::get('/privacy-policy', [\App\Http\Controllers\WebsiteController::class, 'privacyPolicy'])->name("$locale.pages.privacy-policy");
                Route::get('/cookie-policy', [\App\Http\Controllers\WebsiteController::class, 'cookiesPolicy'])->name("$locale.pages.cookies-policy");
            });

            Route::prefix('/checkout')->group(function () use ($locale) {
                Route::post('/create', [\App\Http\Controllers\UserController::class, 'checkoutCreate'])
                    ->name("$locale.products.checkout.create");
                Route::get('/session/{path}', [\App\Http\Controllers\UserController::class, 'checkout'])
                    ->name("$locale.products.checkout");
                Route::post('/session/{path}', [\App\Http\Controllers\UserController::class, 'checkoutSession'])
                    ->name("$locale.products.checkout.session");
            });

            Route::prefix('products')->group(function () use ($locale) {
                Route::get('/categories/{category}', [\App\Http\Controllers\UserController::class, 'productPerCategory'])
                    ->name("$locale.products.per-category");
                Route::get('/{slug}', [\App\Http\Controllers\UserController::class, 'detailsProduct'])->name("$locale.products.show");
            });
        });
    }
}

Route::prefix('admin')->group(function () {
    Route::group(['middleware' => ['guest-with-session']], function () {
        Route::get('/', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
        Route::post('/', [\App\Http\Controllers\AdminController::class, 'postIndex'])->name('admin.index.post');
        Route::get('/seed', [\App\Http\Controllers\AdminController::class, 'seed'])->name('admin.seed');
    });
    Route::group(['middleware' => ['auth-with-session']], function () {
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::get('/transactions', [\App\Http\Controllers\AdminController::class, 'transactions'])->name('admin.transactions');

        Route::get('/products', [\App\Http\Controllers\AdminController::class, 'products'])->name('admin.products');
        Route::get('/products/create', [\App\Http\Controllers\AdminController::class, 'createProduct'])->name('admin.products.create');
        Route::get('/products/{product}/edit', [\App\Http\Controllers\AdminController::class, 'editProduct'])->name('admin.products.edit');

        Route::post('/products', [\App\Http\Controllers\AdminController::class, 'storeProduct'])->name('admin.products.store');
        Route::post('/products/{product}', [\App\Http\Controllers\AdminController::class, 'updateProduct'])->name('admin.products.update');
        Route::delete('/products/{product}', [\App\Http\Controllers\AdminController::class, 'destroyProduct'])->name('admin.products.destroy');

        Route::get('/codes', [\App\Http\Controllers\AdminController::class, 'codes'])->name('admin.codes');
        Route::post('/codes', [\App\Http\Controllers\AdminController::class, 'storeCode'])->name('admin.codes.store');

        Route::post('/logout', [\App\Http\Controllers\AdminController::class, 'logout'])->name('admin.logout');
    });
});

Route::post('/checkout/notification', [\App\Http\Controllers\PaymentController::class, 'notification'])
    ->name('checkout.notification')
    ->withoutMiddleware('web');

/*Route::withoutMiddleware('web')->post('restore-data', function (Request $request) {
    $key = $request->input('key');
    if ($key !== config('app.seed_key')) {
        abort(403, 'Unauthorized action.');
    }
    if (!$request->expectsJson()) {
        return response()->json(['error' => 'Invalid request'], 400);
    }

    $productsInput = $request->input('products');
    foreach ($productsInput as $item) {
        $data = $item;

        $product = \App\Models\Product::create([
            'category_id' => \App\Models\Category::where('slug', $data['category'])->first()->id,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'weight' => $data['weight'],
            'status' => $data['status'],
            'slug' => Str::slug($data['title']) . '-' . Str::random(3),
        ]);
        $product->created_at = $data['created_at'];
        $product->updated_at = $data['updated_at'];
        $product->deleted_at = $data['deleted_at'] ?? null;

        foreach (config('app.supported_locales') as $supportedLocale) {
            $product->translateOrNew($supportedLocale)->title = $data['title'];
            $product->translateOrNew($supportedLocale)->description = $data['description'];
        }

        $product->save();


        foreach ($data['media'] as $file) {
            $url = $file['url'];
            $type = $file['type'];

            $productGallery = ProductGallery::create([
                'product_id' => $product->id,
                'media_url' => $url,
                'type' => $type,
            ]);
            $productGallery->created_at = $file['created_at'];
            $productGallery->updated_at = $file['updated_at'];
            $productGallery->deleted_at = $file['deleted_at'] ?? null;
        }
    }

    return response()->json(['message' => 'Product created successfully'], 201);
});*/
