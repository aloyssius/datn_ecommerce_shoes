<?php

namespace Database\Seeders;

use App\Constants\DiscountStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PromotionTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('promotions')->insert([
                'id' => $faker->uuid,
                'name' => "Đợt giảm giá {$index}",
                'value' => $faker->numberBetween(100000, 2000000),
                'status' => $faker->randomElement(DiscountStatus::toArray()),
                'start_time' => $faker->dateTime,
                'end_time' => $faker->dateTime,
            ]);
        }
    }
}
