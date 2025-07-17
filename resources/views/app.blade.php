<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>


    <link rel="preload" href="/assets/logo.webp" as="image">
    <link rel="icon" href="/assets/icon.png" type="image/png">
    <link rel="apple-touch-icon" href="/assets/icon.png">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>
<body class="antialiased">
@inertia
</body>
</html>
