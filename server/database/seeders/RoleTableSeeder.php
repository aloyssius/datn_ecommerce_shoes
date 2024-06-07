<?php

namespace Database\Seeders;

use App\Constants\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class RoleTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        DB::table('roles')->insert([
            ['id' => $faker->uuid, 'code' => Role::ADMIN, 'name' => Role::ADMIN_VI],
            ['id' => $faker->uuid, 'code' => Role::EMPLOYEE, 'name' => Role::EMPLOYEE_VI],
            ['id' => $faker->uuid, 'code' => Role::CUSTOMER, 'name' => Role::CUSTOMER_VI],
        ]);
    }
}
