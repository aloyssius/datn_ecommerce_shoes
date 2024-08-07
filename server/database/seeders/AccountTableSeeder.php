<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use App\Constants\Role as ConstantsRole;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AccountTableSeeder extends Seeder
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

        $role = Role::where('code', ConstantsRole::ADMIN)->first();
        $role1 = Role::where('code', ConstantsRole::EMPLOYEE)->first();

        DB::table('accounts')->insert([
            'id' => $faker->uuid,
            'code' => "AD0001",
            'full_name' => "TQH",
            'email_verified_at' => null,
            'password' => bcrypt("123456"),
            'email' => 'simbasimba7503@gmail.com',
            'gender' => 0,
            'status' => CommonStatus::IS_ACTIVE,
            'role_id' => $role ? $role->id : null,
            'created_at' => $created_at1,
        ]);

        DB::table('accounts')->insert([
            'id' => $faker->uuid,
            'code' => "NV0002",
            'full_name' => "Hồ Văn Thắng",
            'email_verified_at' => null,
            'password' => bcrypt("123456"),
            'phone_number' => '0978774485',
            'email' => 'sxmb1983@gmail.com',
            'gender' => 0,
            'status' => CommonStatus::IS_ACTIVE,
            'role_id' => $role1 ? $role1->id : null,
            'created_at' => $created_at2,
        ]);

        DB::table('accounts')->insert([
            'id' => $faker->uuid,
            'code' => "AD0003",
            'full_name' => "Hồ Khánh Đăng",
            'email_verified_at' => null,
            'password' => bcrypt("123456"),
            'email' => 'danghkph22590@fpt.edu.vn',
            'gender' => 0,
            'status' => CommonStatus::IS_ACTIVE,
            'role_id' => $role ? $role->id : null,
            'created_at' => $created_at3,
        ]);

        DB::table('accounts')->insert([
            'id' => $faker->uuid,
            'code' => "AD0004",
            'full_name' => "Đỗ Dương",
            'email_verified_at' => null,
            'password' => bcrypt("123456"),
            'email' => 'hagolive2003@gmail.com',
            'gender' => 0,
            'status' => CommonStatus::IS_ACTIVE,
            'role_id' => $role ? $role->id : null,
            'created_at' => $created_at4,
        ]);
    }
}
