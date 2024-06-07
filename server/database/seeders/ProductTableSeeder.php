<?php

namespace Database\Seeders;

use App\Constants\ProductStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProductTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $productNames = [
            'Air Max 90',
            'Classic Leather',
            'Chuck Taylor All Star',
            'Gel-Kayano 26',
            'UltraBoost 20',
            'Old Skool',
            'Yeezy Boost 350',
            'Stan Smith',
            'Pegasus 37',
            'Jordan 1',
            'Gel-Lyte III',
            'FuelCell Rebel',
            'NMD_R1',
            'Clyde Court',
            'Disruptor 2',
            'Gel-Nimbus 22',
            'Free Run 5.0',
            'Wave Rider 23',
            'GEL-Contend 5',
            'Revolution 5'
        ];

        foreach (range(1, 2) as $index) {
            DB::table('products')->insert([
                'id' => $faker->uuid,
                'name' => $productNames[$index - 1],
                'sku' => "SKU{$index}",
                'status' => $faker->randomElement(ProductStatus::toArray()),
                'description' => $faker->text,
                'created_at' => $faker->dateTime,
            ]);
        }
    }
}
