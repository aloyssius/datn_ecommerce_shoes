<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AccountTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 50) as $index) {
            DB::table('accounts')->insert([
                'id' => $faker->uuid,
                'code' => "PH2118{$index}",
                'full_name' => $faker->name,
                'birth_date' => $faker->date,
                'phone_number' => $faker->unique()->numerify('##########'),
                'email' => $faker->unique()->safeEmail,
                'gender' => $faker->boolean,
                'status' => $faker->randomElement(CommonStatus::toArray()),
                'role_id' => Role::all()->random()->id,
            ]);
        }
    }
}
