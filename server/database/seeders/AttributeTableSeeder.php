<?php

namespace Database\Seeders;

use App\Constants\CommonStatus;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AttributeTableSeeder extends Seeder
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
        $created_at7 = Carbon::parse($created_at6)->addMinutes(1);
        $created_at8 = Carbon::parse($created_at7)->addMinutes(1);
        $created_at9 = Carbon::parse($created_at8)->addMinutes(1);
        $created_at10 = Carbon::parse($created_at9)->addMinutes(1);
        $created_at11 = Carbon::parse($created_at10)->addMinutes(1);
        $created_at12 = Carbon::parse($created_at11)->addMinutes(1);

        DB::table('categories')->insert([
            'id' => $faker->uuid,
            'code' => "DM0001",
            'name' => "Nam",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
            'updated_at' => $created_at1,
        ]);
        DB::table('categories')->insert([
            'id' => $faker->uuid,
            'code' => "DM0002",
            'name' => "Nữ",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
            'updated_at' => $created_at2,
        ]);
        DB::table('categories')->insert([
            'id' => $faker->uuid,
            'code' => "DM0003",
            'name' => "Unisex",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
            'updated_at' => $created_at3,
        ]);
        // DB::table('categories')->insert([
        //     'id' => $faker->uuid,
        //     'code' => "DM0004",
        //     'name' => "Thể thao",
        //     'status' => CommonStatus::IS_ACTIVE,
        //     'created_at' => $created_at4,
        //     'updated_at' => $created_at4,
        // ]);
        // DB::table('categories')->insert([
        //     'id' => $faker->uuid,
        //     'code' => "DM0005",
        //     'name' => "Thời trang",
        //     'status' => CommonStatus::IS_ACTIVE,
        //     'created_at' => $created_at5,
        //     'updated_at' => $created_at5,
        // ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0001",
            'name' => "Nike",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
            'updated_at' => $created_at1,
        ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0002",
            'name' => "Adidas",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
            'updated_at' => $created_at2,
        ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0003",
            'name' => "Converse",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
            'updated_at' => $created_at3,
        ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0004",
            'name' => "Vans",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at4,
            'updated_at' => $created_at4,
        ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0005",
            'name' => "New Balance",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at5,
            'updated_at' => $created_at5,
        ]);
        DB::table('brands')->insert([
            'id' => $faker->uuid,
            'code' => "TH0006",
            'name' => "Puma",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at6,
            'updated_at' => $created_at6,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0001",
            'name' => "35",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
            'updated_at' => $created_at1,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0002",
            'name' => "36",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
            'updated_at' => $created_at2,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0003",
            'name' => "37",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
            'updated_at' => $created_at3,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0004",
            'name' => "38",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at4,
            'updated_at' => $created_at4,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0005",
            'name' => "39",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at5,
            'updated_at' => $created_at5,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0006",
            'name' => "40",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at6,
            'updated_at' => $created_at6,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0007",
            'name' => "41",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at7,
            'updated_at' => $created_at7,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0008",
            'name' => "42",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at8,
            'updated_at' => $created_at8,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0009",
            'name' => "43",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at9,
            'updated_at' => $created_at9,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0010",
            'name' => "44",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at10,
            'updated_at' => $created_at10,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0011",
            'name' => "45",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at11,
            'updated_at' => $created_at11,
        ]);
        DB::table('sizes')->insert([
            'id' => $faker->uuid,
            'code' => "KC0012",
            'name' => "46",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at12,
            'updated_at' => $created_at12,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#C10013",
            'name' => "Red",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at1,
            'updated_at' => $created_at1,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#464646",
            'name' => "Black",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at2,
            'updated_at' => $created_at2,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#E9662C",
            'name' => "Orange",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at3,
            'updated_at' => $created_at3,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#F5D255",
            'name' => "Yellow",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at4,
            'updated_at' => $created_at4,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#F1778A",
            'name' => "Pink",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at5,
            'updated_at' => $created_at5,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#8A5CA0",
            'name' => "Violet",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at6,
            'updated_at' => $created_at6,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#6D9951",
            'name' => "Green",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at7,
            'updated_at' => $created_at7,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#FFFFFF",
            'name' => "White",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at8,
            'updated_at' => $created_at8,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#865439",
            'name' => "Brown",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at9,
            'updated_at' => $created_at9,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#C3C3C3",
            'name' => "Grey",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at10,
            'updated_at' => $created_at10,
        ]);
        DB::table('colors')->insert([
            'id' => $faker->uuid,
            'code' => "#003171",
            'name' => "Blue",
            'status' => CommonStatus::IS_ACTIVE,
            'created_at' => $created_at11,
            'updated_at' => $created_at11,
        ]);
    }
}
