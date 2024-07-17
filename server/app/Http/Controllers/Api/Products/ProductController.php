<?php

namespace App\Http\Controllers\Api\Products;

use App\Constants\ProductStatus;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\AttributeRequestBody;
use App\Http\Requests\Product\ProductRequest;
use App\Http\Requests\Product\ProductRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Http\Resources\Products\ImageResource;
use App\Http\Resources\Products\ProductDetailResource;
use App\Http\Resources\Products\ProductItemResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Image;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductDetails;
use App\Models\Size;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use JD\Cloudder\Facades\Cloudder;
use GuzzleHttp\Client;
use GuzzleHttp\Pool;
use GuzzleHttp\Promise\Promise;
use GuzzleHttp\Promise\Utils;
use GuzzleHttp\Psr7\Request;

class ProductController extends Controller
{
    public function index(ProductRequest $req)
    {
        $products = Product::getProducts($req);

        $statusCounts = Product::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();
        $brands = Brand::select(['id', 'name'])->get();
        $categories = Category::select(['id', 'name'])->get();

        $otherData['brands'] = $brands;
        $otherData['categories'] = $categories;

        return ApiResponse::responsePageCustom($products, $statusCounts, $otherData);
    }

    public function indexAttributes()
    {
        $brands = Brand::select(['id', 'name'])->where('status', '=', ProductStatus::IS_ACTIVE)->get();
        $categories = Category::select(['id', 'name'])->where('status', '=', ProductStatus::IS_ACTIVE)->get();
        $colors = Color::select(['id', 'code', 'name'])->where('status', '=', ProductStatus::IS_ACTIVE)->get();
        $sizes = Size::select(['id', 'name'])->where('status', '=', ProductStatus::IS_ACTIVE)->get();

        $data['brands'] = $brands;
        $data['categories'] = $categories;
        $data['colors'] = $colors;
        $data['sizes'] = $sizes;

        return ApiResponse::responseObject($data);
    }

    public function storeAttributes(AttributeRequestBody $req)
    {

        if ($req->type === "brand") {
            $brand = Brand::query();
            $prefix = 'TH';

            $moreColumns = [
                'code' => CustomCodeHelper::generateCode($brand, $prefix),
            ];

            // convert req
            $brandConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

            $existingBrand = Brand::where('name', '=', $req->name)->first();

            if ($existingBrand) {
                throw new RestApiException("Tên thương hiệu này đã tồn tại!");
            }

            $brandCreated = Brand::create($brandConverted);

            return ApiResponse::responseObject(new AttributeResource($brandCreated));
        } else if ($req->type === "category") {
            $category = Category::query();
            $prefix = 'DM';

            $moreColumns = [
                'code' => CustomCodeHelper::generateCode($category, $prefix),
            ];

            // convert req
            $categoryConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

            $existingCategory = Category::where('name', '=', $req->name)->first();

            if ($existingCategory) {
                throw new RestApiException("Tên danh mục này đã tồn tại!");
            }

            $categoryCreated = Category::create($categoryConverted);

            return ApiResponse::responseObject(new AttributeResource($categoryCreated));
        } else if ($req->type === "size") {
            $size = Size::query();
            $prefix = 'KC';

            $moreColumns = [
                'code' => CustomCodeHelper::generateCode($size, $prefix),
            ];

            // convert req
            $sizeConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

            $existingSize = Size::where('name', '=', $req->name)->first();

            if ($existingSize) {
                throw new RestApiException("Tên kích cỡ này đã tồn tại!");
            }

            $sizeCreated = Size::create($sizeConverted);

            return ApiResponse::responseObject(new AttributeResource($sizeCreated));
        } else {

            $existingColor = Color::where('code', '=', $req->code)->first();

            if ($existingColor) {
                throw new RestApiException("Mã màu sắc này đã tồn tại!");
            }

            $colorCreated = Color::create($req->all());

            return ApiResponse::responseObject(new AttributeResource($colorCreated));
        }
    }

    public function store(ProductRequestBody $req)
    {

        $data = json_decode($req->data);
        $files = $req->file('files');

        DB::beginTransaction();

        try {
            // convert req
            $newProduct = new Product();
            $newProduct->code = $data->code;
            $newProduct->name = $data->name;
            $newProduct->status = $data->status;
            $newProduct->description = $data->description;
            $newProduct->brand_id = $data->brandId;
            $newProduct->save();

            foreach ($data->categoryIds as $categoryId) {
                $newProductCategory = new ProductCategory();
                $newProductCategory->category_id = $categoryId;
                $newProductCategory->product_id = $newProduct->id;
                $newProductCategory->save();
            }

            foreach ($data->productItems as $productItem) {
                $newProductItem = new ProductDetails();
                $newProductItem->sku = $productItem->sku;
                $newProductItem->color_id = $productItem->colorId;
                $newProductItem->size_id = $productItem->sizeId;
                $newProductItem->price = $productItem->price;
                $newProductItem->quantity = $productItem->quantity;
                $newProductItem->status = $productItem->status;
                $newProductItem->product_id = $newProduct->id;
                $newProductItem->save();
            }

            $images = $data->images;

            $client = new Client();
            $cloudName = 'dgupbx2im';
            $uploadPreset = 'ml_default';

            foreach ($files as $file) {
                $promises[] = $client->postAsync("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                    'multipart' => [
                        [
                            'name' => 'file',
                            'contents' => fopen($file->getRealPath(), 'r'),
                        ],
                        [
                            'name' => 'upload_preset',
                            'contents' => $uploadPreset,
                        ],
                        [
                            'name' => 'folder',
                            'contents' => 'products',
                        ],
                    ],
                ]);
            };

            $results = Utils::unwrap($promises);
            foreach ($results as $index => $result) {
                $response = json_decode($result->getBody(), true);
                $url = $response['secure_url'];
                $image = $images[$index];

                $newImage = new Image();
                $newImage->path_url = $url;
                $newImage->is_default = $image->isDefault;
                $newImage->public_id = $response['public_id'];
                $newImage->product_color_id = $image->colorId;
                $newImage->product_id = $newProduct->id;
                $newImage->save();
            }
            DB::commit();
        } catch (\Exception  $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        $response = $newProduct;

        return ApiResponse::responseObject($response);
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            throw new NotFoundException("Không tìm thấy sản phẩm có id là " . $id);
        }

        // categories
        $productCategoryIds = ProductCategory::where('product_id', $id)->pluck('category_id');
        $categories = Category::whereIn('id', $productCategoryIds)->get();

        // product_details
        $productItems = ProductDetails::where('product_id', '=', $id)->get();

        // colors
        $colorIds = ProductDetails::where('product_id', $id)->pluck('color_id')->unique();
        $colors = Color::whereIn('id', $colorIds->toArray())->get();

        // sizes
        $sizeIds = ProductDetails::where('product_id', $id)->pluck('size_id')->unique();
        $sizes = Size::whereIn('id', $sizeIds->toArray())->get();

        // prices unique
        $colorPrices = ProductDetails::where('product_id', $id)->pluck('price', 'color_id');

        // images
        $images = Image::where('product_id', $id)->get();

        // variants
        $variants = $colors->map(function ($item, $key) use ($colorPrices, $productItems, $sizes, $images) {
            $price = $colorPrices->get($item->id, null);

            $colorImages = $images->filter(function ($image) use ($item) {
                return $image->product_color_id == $item->id;
            });

            return [
                'key' => 0,
                'colorId' => $item->id,
                'colorName' => $item->name,
                'price' => ConvertHelper::formatCurrencyVnd($price),
                'images' => ImageResource::collection($colorImages),
                'variantItems' => $productItems->map(function ($productItem, $key) use ($sizes, $item) {

                    if ($item->id === $productItem->color_id) {
                        $size = collect($sizes)->first(function ($size) use ($productItem) {
                            return $size->id === $productItem->size_id;
                        });

                        return [
                            'sku' => $productItem->sku,
                            'colorId' => $productItem->color_id,
                            'sizeId' => $productItem->size_id,
                            'price' => ConvertHelper::formatCurrencyVnd($productItem->price),
                            'quantity' => ConvertHelper::formatNumberString($productItem->quantity),
                            'status' => $productItem->status,
                            'sizeName' => $size->name,
                        ];
                    }

                    return null;
                })->filter()->values(),
            ];
        })->values();

        $response = new ProductDetailResource($product);
        $response['categories'] = AttributeResource::collection($categories);
        $response['colors'] = AttributeResource::collection($colors);
        $response['sizes'] = AttributeResource::collection($sizes);
        $response['variants'] = $variants;

        return ApiResponse::responseObject($response);
    }
}
