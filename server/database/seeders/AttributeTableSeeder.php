<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AttributeTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 5) as $index) {

            DB::table('categories')->insert([
                'id' => $faker->uuid,
                'code' => "DM000{$index}",
                'name' => $faker->name,
                'status' => $faker->randomElement(CommonStatus::toArray()),
            ]);
            DB::table('brands')->insert([
                'id' => $faker->uuid,
                'code' => "TH000{$index}",
                'name' => $faker->name,
                'status' => $faker->randomElement(CommonStatus::toArray()),
            ]);
            DB::table('sizes')->insert([
                'id' => $faker->uuid,
                'code' => "KC000{$index}",
                'name' => $faker->name,
                'status' => $faker->randomElement(CommonStatus::toArray()),
            ]);
            DB::table('colors')->insert([
                'id' => $faker->uuid,
                'code' => "#D1D1D{$index}",
                'name' => $faker->name,
                'status' => $faker->randomElement(CommonStatus::toArray()),
            ]);
        }
    }
}
