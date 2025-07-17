<?php

namespace Database\Seeders;

use App\Models\Code;
use Illuminate\Database\Seeder;

class CodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Code::firstOrCreate([
            'identifier' => hash('SHA256', '5Bl/Q5hxc8WfpPKKA8LJhw=='),
            'access_code' => \Hash::make('123'),
        ]);
    }
}
