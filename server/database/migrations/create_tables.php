<?php

use App\Common\BaseBlueprint;
use App\Constants\BillHistoryStatusTimeline;
use App\Constants\CommonStatus;
use App\Constants\ConstantSystem;
use App\Constants\DiscountStatus;
use App\Constants\OrderStatus;
use App\Constants\OrderType;
use App\Constants\ProductStatus;
use App\Constants\Role;
use App\Constants\TransactionType;
use App\Constants\VoucherTypeDiscount;
use App\Constants\VoucherType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $schema = DB::connection()->getSchemaBuilder();

        $schema->blueprintResolver(function ($table, $callback) {
            return new BaseBlueprint($table, $callback);
        });

        // $schema->create('users', function (BaseBlueprint $table) {
        //     $table->baseColumn()->addColumnName();
        //     $table->string('password', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
        //     $table->string('email', ConstantSystem::DEFAULT_MAX_LENGTH)->unique()->nullable();
        //     $table->text('remember_token')->nullable();
        // });

        // Role
        $schema->create('roles', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnName();
            $table->enum('code', Role::toArray())->unique();
        });

        // Account
        $schema->create('accounts', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode();
            $table->string('full_name', ConstantSystem::FULL_NAME_MAX_LENGTH)->nullable();
            $table->dateTime('birth_date')->nullable();
            $table->string('phone_number', ConstantSystem::PHONE_NUMBER_MAX_LENGTH)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH)->nullable();
            $table->string('identity_card', ConstantSystem::IDENTITY_CARD_MAX_LENGTH)->nullable()->unique();
            $table->boolean('gender')->nullable();
            $table->enum('status', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
            $table->string('avatar_url', ConstantSystem::URL_MAX_LENGTH)->nullable();
            $table->foreignUuid('role_id')->references('id')->on('roles');
        });

        // Address
        $schema->create('addresses', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('full_name', ConstantSystem::FULL_NAME_MAX_LENGTH);
            $table->string('address', ConstantSystem::ADDRESS_MAX_LENGTH);
            $table->string('phone_number', ConstantSystem::PHONE_NUMBER_MAX_LENGTH);
            $table->string('province_id');
            $table->string('district_id');
            $table->string('ward_code');
            $table->boolean('is_default')->default(false);
            $table->foreignUuid('account_id')->references('id')->on('accounts');
        });

        // Notification
        $schema->create('notifications', function (BaseBlueprint $table) {
            $table->baseColumn()->addSoftDeletes();
            $table->string('content', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->boolean('is_seen')->default(false);
            $table->string('url', ConstantSystem::URL_MAX_LENGTH);
            $table->foreignUuid('account_id')->references('id')->on('accounts');
            // $table->foreignUuid('account_id')->nullable()->references('id')->on('accounts');
        });

        // Voucher
        $schema->create('vouchers', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnName()->addColumnCode()->addSoftDeletes();
            $table->bigDecimal('value');
            $table->bigDecimal('max_discount_value');
            $table->bigDecimal('min_order_value');
            $table->enum('type_discount', VoucherTypeDiscount::toArray())->default(VoucherTypeDiscount::VND);
            $table->enum('status', DiscountStatus::toArray())->default(DiscountStatus::UP_COMMING);
            $table->integer('quantity')->default(0);
            $table->timestamp('start_time');
            $table->timestamp('end_time');
        });

        // Customer_vouchers
        // $schema->create('customer_vouchers', function (BaseBlueprint $table) {
        //     $table->baseColumn()->addSoftDeletes();
        //     $table->boolean('is_used')->default(false);
        //     $table->foreignUuid('voucher_id')->references('id')->on('vouchers');
        //     $table->foreignUuid('account_id')->references('id')->on('accounts');
        // });

        // Carts
        $schema->create('carts', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->uuid('account_id')->unique();
        });

        // Categorys
        $schema->create('categories', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode()->addColumnName();
            $table->enum('status', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        // Sizes
        $schema->create('sizes', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode()->addColumnName();
            $table->enum('status', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        // Colors
        $schema->create('colors', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode()->addColumnName();
            $table->enum('status', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        // Brands
        $schema->create('brands', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode()->addColumnName();
            $table->enum('status', CommonStatus::toArray())->default(CommonStatus::IS_ACTIVE);
        });

        // Products
        $schema->create('products', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnName();
            $table->string('code', ConstantSystem::CODE_MAX_LENGTH)->unique();
            $table->enum('status', ProductStatus::toArray())->default(ProductStatus::IS_ACTIVE);
            $table->text('description')->nullable();
            $table->foreignUuid('brand_id')->references('id')->on('brands');
        });

        // Product_categories
        $schema->create('product_categories', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->foreignUuid('category_id')->references('id')->on('categories');
            $table->foreignUuid('product_id')->references('id')->on('products');
        });


        // Product_details
        $schema->create('product_details', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('sku', ConstantSystem::CODE_MAX_LENGTH);
            $table->integer('quantity')->default(0);
            $table->bigDecimal('price');
            $table->enum('status', ProductStatus::toArray())->default(ProductStatus::IS_ACTIVE);
            $table->foreignUuid('product_id')->references('id')->on('products');
            $table->foreignUuid('color_id')->references('id')->on('colors');
            $table->foreignUuid('size_id')->references('id')->on('sizes');
        });

        // Cart_details
        $schema->create('cart_details', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->integer('quantity');
            $table->foreignUuid('cart_id')->references('id')->on('carts');
            $table->foreignUuid('product_details_id')->references('id')->on('product_details');
        });

        // Bills
        $schema->create('bills', function (BaseBlueprint $table) {
            $table->baseColumn()->addColumnCode()->addSoftDeletes();
            $table->timestamp('cancellation_date')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->timestamp('completion_date')->nullable();
            $table->string('note', ConstantSystem::DEFAULT_MAX_LENGTH)->nullable();
            $table->enum('status', OrderStatus::toArray())->default(OrderStatus::PENDING_COMFIRM);
            $table->enum('payment_method', TransactionType::toArray());
            $table->string('full_name', ConstantSystem::FULL_NAME_MAX_LENGTH);
            $table->string('email', ConstantSystem::EMAIL_MAX_LENGTH);
            $table->string('address', ConstantSystem::ADDRESS_MAX_LENGTH);
            $table->string('phone_number', ConstantSystem::PHONE_NUMBER_MAX_LENGTH);
            $table->bigDecimal('money_ship');
            $table->bigDecimal('total_money');
            $table->bigDecimalNullable('discount_amount');
            $table->foreignUuid('customer_id')->nullable()->references('id')->on('accounts');
            $table->foreignUuid('voucher_id')->nullable()->references('id')->on('vouchers');
            // $table->foreignUuid('employee_id')->references('id')->on('accounts');
            // $table->index(['full_name', 'created_at', 'phone_number', 'code', 'status']);
        });

        // Bill_details
        $schema->create('bill_details', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->bigDecimal('price');
            $table->integer('quantity');
            $table->foreignUuid('bill_id')->references('id')->on('bills');
            $table->foreignUuid('product_details_id')->references('id')->on('product_details');
        });

        // Bill_histories
        $schema->create('bill_histories', function (BaseBlueprint $table) {
            $table->baseColumn()->addSoftDeletes();
            $table->enum('status_timeline', BillHistoryStatusTimeline::toArray());
            $table->string('note', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->string('action', ConstantSystem::DEFAULT_MAX_LENGTH);
            $table->foreignUuid('bill_id')->references('id')->on('bills');
        });

        // Transactions
        $schema->create('transactions', function (BaseBlueprint $table) {
            $table->baseColumn()->addSoftDeletes();
            $table->bigDecimal('total_money');
            $table->enum('type', TransactionType::toArray());
            $table->string('trading_code', ConstantSystem::CODE_MAX_LENGTH)->unique()->nullable();
            $table->foreignUuid('bill_id')->references('id')->on('bills');
        });

        // Images
        $schema->create('images', function (BaseBlueprint $table) {
            $table->baseColumn();
            $table->string('path_url', ConstantSystem::URL_MAX_LENGTH);
            $table->string('public_id', ConstantSystem::URL_MAX_LENGTH);
            $table->boolean('is_default')->default(false);
            // $table->foreignUuid('product_color_id')->references('color_id')->on('product_details');
            // $table->foreignUuid('product_id')->references('product_id')->on('product_details');
            $table->uuid('product_color_id');
            $table->uuid('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('sizes');
        Schema::dropIfExists('colors');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('bill_details');
        Schema::dropIfExists('bill_histories');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('customer_vouchers');
        Schema::dropIfExists('accounts');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('cart_details');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_details');
        Schema::dropIfExists('images');
    }
};
