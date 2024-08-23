<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use App\Constants\Role as ConstantsRole;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AccountTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // DB::table('accounts')->insert([
        //     'id' => $faker->uuid,
        //     'code' => "KH0001",
        //     'full_name' => "Ho Van Thang",
        //     'email_verified_at' => now(),
        //     'password' => bcrypt("123123123"),
        //     'phone_number' => '0978774487',
        //     'email' => 'simbasimba7503@gmail.com',
        //     'gender' => 0,
        //     'status' => CommonStatus::IS_ACTIVE,
        //     'role_id' => Role::where('code', ConstantsRole::CUSTOMER)->id,
        //     'created_at' => now(),
        // ]);
    }
}
