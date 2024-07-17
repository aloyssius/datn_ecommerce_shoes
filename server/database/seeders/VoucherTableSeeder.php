<?php

namespace Database\Seeders;

use App\Constants\DiscountStatus;
use App\Constants\VoucherType;
use App\Constants\VoucherTypeDiscount;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class VoucherTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('vouchers')->insert([
                'id' => $faker->uuid,
                'code' => "PGG{$index}",
                'name' => "Giảm giá {$index}",
                'value' => $faker->numberBetween(100000, 2000000),
                'type_discount' => $faker->randomElement(VoucherTypeDiscount::toArray()),
                'max_discount_value' => $faker->numberBetween(10000, 2000000),
                'min_order_value' => $faker->numberBetween(100000, 2000000),
                'quantity' => $faker->numberBetween(1000, 2000),
                'status' => $faker->randomElement(DiscountStatus::toArray()),
                'start_time' => $faker->dateTime,
                'end_time' => $faker->dateTime,
            ]);
        }
    }
}
