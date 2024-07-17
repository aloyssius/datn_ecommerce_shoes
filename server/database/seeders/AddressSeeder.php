<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AddressSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 20) as $index) {
            DB::table('addresses')->insert([
                'id' => $faker->uuid,
                'full_name' => $faker->name,
                'address' => $faker->name,
                'phone_number' => $faker->unique()->numerify('##########'),
                'province_id' => $faker->uuid,
                'district_id' => $faker->uuid,
                'ward_code' => $faker->uuid,
                'is_default' => $faker->boolean,
                'account_id' => Account::all()->random()->id,
            ]);
        }
    }
}
