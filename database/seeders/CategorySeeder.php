<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Luxury Watches' => [
                'en' => ['title' => 'Luxury Watches', 'description' => ''],
                'cn' => ['title' => '奢侈手表', 'description' => ''],
                'id' => ['title' => 'Jam Tangan Mewah', 'description' => ''],
            ],
            'Luxury Bags' => [
                'en' => ['title' => 'Luxury Bags', 'description' => ''],
                'cn' => ['title' => '奢侈包包', 'description' => ''],
                'id' => ['title' => 'Tas Mewah', 'description' => ''],
            ],
        ];

        foreach ($categories as $key => $translations) {
            $category = Category::firstOrCreate([
                'slug' => Str::slug($key),
            ]);
            foreach ($translations as $locale => $translation) {
                $category->translateOrNew($locale)->name = $translation['title'];
                $category->translateOrNew($locale)->description = $translation['description'];
            }
            $category->save();
        }
    }
}
