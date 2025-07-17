<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LocaleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->segment(1);

        $supportedLocales = config('app.supported_locales');
        if (in_array($locale, $supportedLocales)) {
            \App::setLocale($locale);
        } else {
            \App::setLocale('en');
        }

        return $next($request);
    }
}
