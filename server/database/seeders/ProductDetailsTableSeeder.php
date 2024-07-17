<?php

namespace Database\Seeders;

use App\Constants\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\Size;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProductDetailsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $products = Product::all();
        $colors = Color::all();
        $sizes = Size::all();
        $productIndex = 0;

        foreach (range(1, 8) as $index) {
            if ($index % 5 == 0) {
                $productIndex++;
            }

            $currentProduct = $products[$productIndex];
            $currentColor = $colors[$productIndex];
            $currentSize = $sizes[$productIndex];

            DB::table('product_details')->insert([
                'id' => $faker->uuid,
                'sku' => "SUBSKU{$index}",
                'quantity' => $faker->numberBetween(1000, 2000),
                'price' => $faker->numberBetween(350000, 5000000),
                'status' => $faker->randomElement(ProductStatus::toArray()),
                'product_id' => $currentProduct->id,
                'size_id' => $currentSize->id,
                'color_id' => $currentColor->id,
            ]);
        }
    }
}
