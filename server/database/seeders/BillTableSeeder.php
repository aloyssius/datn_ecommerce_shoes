<?php

namespace Database\Seeders;

use App\Constants\OrderStatus;
use App\Models\Account;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class BillTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('bills')->insert([
                'id' => $faker->uuid,
                'code' => "2024{$index}",
                'full_name' => $faker->name,
                'phone_number' => $faker->unique()->numerify('##########'),
                'email' => $faker->unique()->safeEmail,
                'address' => $faker->text,
                'total_money' => $faker->numberBetween(100000, 2000000),
                'status' => $faker->randomElement(OrderStatus::toArray()),
                'created_at' => $faker->dateTime,
                'customer_id' => Account::all()->random()->id,
                'employee_id' => Account::all()->random()->id,
            ]);
        }
    }
}
