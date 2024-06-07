<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AttributeTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 2) as $index) {

            DB::table('categories')->insert([
                'id' => $faker->uuid,
                'code' => "ATT{$index}",
                'name' => $faker->name,
            ]);

            DB::table('brands')->insert([
                'id' => $faker->uuid,
                'code' => "ATT{$index}",
                'name' => $faker->name,
            ]);
            DB::table('sizes')->insert([
                'id' => $faker->uuid,
                'code' => "ATT{$index}",
                'name' => $faker->name,
            ]);
            DB::table('colors')->insert([
                'id' => $faker->uuid,
                'code' => "ATT{$index}",
                'name' => $faker->name,
            ]);
        }
    }
}
