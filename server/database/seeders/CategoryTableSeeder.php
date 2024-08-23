<?php

namespace Database\Seeders;

use App\Constants\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class CategoryTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $productId1 = Product::where('code', 'NIKEF1')->first()->id;
        $categoryMaleId = Category::where('code', 'DM0001')->first()->id;
        $categoryFemaleId = Category::where('code', 'DM0002')->first()->id;
        $categoryUnisexId = Category::where('code', 'DM0003')->first()->id;
        $categorySportId = Category::where('code', 'DM0004')->first()->id;

        // 1

        DB::table('product_categories')->insert([
            'id' => $faker->uuid,
            'category_id' => $categorySportId,
            'product_id' => $productId1,
        ]);
        DB::table('product_categories')->insert([
            'id' => $faker->uuid,
            'category_id' => $categoryUnisexId,
            'product_id' => $productId1,
        ]);
    }
}
