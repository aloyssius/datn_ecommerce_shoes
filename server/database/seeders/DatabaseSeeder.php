<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call(RoleTableSeeder::class);
        $this->call(AccountTableSeeder::class);
        $this->call(AddressSeeder::class);
        $this->call(VoucherTableSeeder::class);
        $this->call(PromotionTableSeeder::class);
        $this->call(BillTableSeeder::class);
        $this->call(ProductTableSeeder::class);
        $this->call(AttributeTableSeeder::class);
        $this->call(ProductDetailsTableSeeder::class);
    }
}
