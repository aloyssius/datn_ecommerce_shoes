<?php

namespace Database\Seeders;

use App\Constants\ProductStatus;
use App\Models\Brand;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProductTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();
        $created_at1 = Carbon::now();
        $created_at2 = Carbon::parse($created_at1)->addMinutes(1);
        $created_at3 = Carbon::parse($created_at2)->addMinutes(1);
        $created_at4 = Carbon::parse($created_at3)->addMinutes(1);
        $created_at5 = Carbon::parse($created_at4)->addMinutes(1);
        $created_at6 = Carbon::parse($created_at5)->addMinutes(1);
        $created_at7 = Carbon::parse($created_at6)->addMinutes(1);
        $created_at8 = Carbon::parse($created_at7)->addMinutes(1);
        $created_at9 = Carbon::parse($created_at8)->addMinutes(1);
        $created_at10 = Carbon::parse($created_at9)->addMinutes(1);
        $created_at11 = Carbon::parse($created_at10)->addMinutes(1);
        $created_at12 = Carbon::parse($created_at11)->addMinutes(1);

        $brandNikeId = Brand::where('code', 'TH0001')->first();

        DB::table('products')->insert([
            'id' => $faker->uuid,
            'name' => "Giày Air Force 1",
            'code' => "NIKEF1",
            'status' => ProductStatus::IS_ACTIVE,
            'brand_id' => $brandNikeId->id,
            'description' => $faker->text,
            'created_at' => $created_at1,
            'updated_at' => $created_at1,
        ]);
    }
}
