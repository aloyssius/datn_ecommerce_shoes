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
use Illuminate\Support\Carbon;

class ProductDetailsTableSeeder extends Seeder
{
    public function run()
    {
        $product1 = Product::where('code', 'NIKEF1')->first();
        $colorWhite = Color::where('code', '#FFFFFF')->first();
        $colorGrey = Color::where('code', '#C3C3C3')->first();
        $size40Id = Size::where('code', 'KC0006')->first()->id;
        $size41Id = Size::where('code', 'KC0007')->first()->id;
        $size42Id = Size::where('code', 'KC0008')->first()->id;
        $size43Id = Size::where('code', 'KC0009')->first()->id;
        $size44Id = Size::where('code', 'KC0010')->first()->id;
        $size45Id = Size::where('code', 'KC0011')->first()->id;

        $faker = Faker::create();

        // 1

        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorWhite->name}",
            'quantity' => 300,
            'price' => 1790000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size40Id,
            'color_id' => $colorWhite->id,
            'created_at' => Carbon::now(),
        ]);
        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorWhite->name}",
            'quantity' => 300,
            'price' => 1790000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size41Id,
            'color_id' => $colorWhite->id,
            'created_at' => Carbon::now(),
        ]);
        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorWhite->name}",
            'quantity' => 300,
            'price' => 1790000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size42Id,
            'color_id' => $colorWhite->id,
            'created_at' => Carbon::now(),
        ]);
        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorWhite->name}",
            'quantity' => 300,
            'price' => 1790000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size43Id,
            'color_id' => $colorWhite->id,
            'created_at' => Carbon::now(),
        ]);
        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorWhite->name}",
            'quantity' => 300,
            'price' => 1790000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size44Id,
            'color_id' => $colorWhite->id,
            'created_at' => Carbon::now(),
        ]);

        // 2

        DB::table('product_details')->insert([
            'id' => $faker->uuid,
            'sku' => "{$product1->code}-{$colorGrey->name}",
            'quantity' => 9,
            'price' => 1850000,
            'status' => ProductStatus::IS_ACTIVE,
            'product_id' => $product1->id,
            'size_id' => $size40Id,
            'color_id' => $colorGrey->id,
            'created_at' => Carbon::now(),
        ]);
    }
}
