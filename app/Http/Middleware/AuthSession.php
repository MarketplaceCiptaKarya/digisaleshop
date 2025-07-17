<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthSession
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the session has the 'admin-code-id' key
        if (!$request->session()->has('admin-code-id')) {
            // If not, redirect to the admin index page
            return redirect()->route('admin.index');
        }
        return $next($request);
    }
}
