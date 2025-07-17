<?php

namespace Database\Seeders;

use App\Models\StaticWebsiteDatum;
use Illuminate\Database\Seeder;

class StaticWebsiteDatumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $keys = [
            'about-us',
            'contact-us',
            'cookie-policy',
            'faq',
            'payments',
            'privacy-policy',
            'shipping',
            'terms-and-conditions',
        ];
        $locales = config('app.supported_locales');

        foreach ($keys as $key) {
            foreach ($locales as $locale) {
                StaticWebsiteDatum::firstOrCreate([
                    'key' => $key,
                    'locale' => $locale,
                    'value' => \File::get(base_path("resources/static/{$locale}/{$key}.html"))
                ]);
            }
        }
    }
}
