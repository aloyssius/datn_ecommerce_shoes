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

class ImageTableSeeder extends Seeder
{
    public function run()
    {
        $product1 = Product::where('code', 'NIKEF1')->first();
        $colorWhite = Color::where('code', '#FFFFFF')->first();
        $colorGrey = Color::where('code', '#C3C3C3')->first();

        $faker = Faker::create();

        DB::table('images')->insert([
            'id' => $faker->uuid,
            'public_id' => $faker->userName,
            'product_color_id' => $colorWhite->id,
            'product_id' => $product1->id,
            'is_default' => true,
            'path_url' => "https://www.nike.ae/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwb0005c08/nk/5ab/d/3/0/f/9/5abd30f9_47b7_42a8_8d8c_514c3e72f8a3.jpg?sw=700&sh=700&sm=fit&q=100&strip=false",
        ]);
        DB::table('images')->insert([
            'id' => $faker->uuid,
            'public_id' => $faker->userName,
            'product_color_id' => $colorWhite->id,
            'product_id' => $product1->id,
            'is_default' => false,
            'path_url' => "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/82aa97ed-98bf-4b6f-9d0b-31a9f907077b/AIR+FORCE+1+%2707.png",
        ]);
        DB::table('images')->insert([
            'id' => $faker->uuid,
            'public_id' => $faker->userName,
            'product_color_id' => $colorWhite->id,
            'product_id' => $product1->id,
            'is_default' => false,
            'path_url' => "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a0a300da-2e16-4483-ba64-9815cf0598ac/AIR+FORCE+1+%2707.png",
        ]);
        DB::table('images')->insert([
            'id' => $faker->uuid,
            'public_id' => $faker->userName,
            'product_color_id' => $colorWhite->id,
            'product_id' => $product1->id,
            'is_default' => false,
            'path_url' => "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/33533fe2-1157-4001-896e-1803b30659c8/AIR+FORCE+1+%2707.png",
        ]);

        DB::table('images')->insert([
            'id' => $faker->uuid,
            'public_id' => $faker->userName,
            'product_color_id' => $colorGrey->id,
            'product_id' => $product1->id,
            'is_default' => true,
            'path_url' => "https://www.nike.ae/dw/image/v2/BDVB_PRD/on/demandware.static/-/Sites-akeneo-master-catalog/default/dwd3cb4ff1/nk/dd1/e/f/0/1/a/dd1ef01a_1486_4178_aff9_ef6b4daf1818.jpg?sw=700&sh=700&sm=fit&q=100&strip=false",
        ]);
    }
}
