<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class ApiResponse
{
    public static function rollback($e, $message = "Something went wrong! Process not completed")
    {
        DB::rollBack();
        self::throw($e, $message);
    }

    public static function throw($e, $message = "Something went wrong! Process not completed")
    {
        Log::info($e);
        throw new HttpResponseException(response()->json(["message" => $message], 500));
    }

    public static function responseObject($data, $message = '', $code = 200)
    {
        $showSql = DB::getQueryLog();

        $response = [
            'success' => true,
            'statusCode' => $code,
            'data'    => $data,
            'sql' => $showSql,
        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }
        return response()->json($response, $code);
    }

    public static function responsePage($page, $statusCounts = [], $otherData = [], $message = '', $code = 200)
    {
        $showSql = DB::getQueryLog();

        $response = [
            'success' => true,
            'statusCode' => $code,
            'data'    => $page->items(),
            'page' => [
                'currentPage' => $page->currentPage(),
                'totalPages' => $page->lastPage(),
                'pageSize' => $page->perPage(),
                'totalElements' => $page->total(),
            ],
            'sql' => $showSql,

        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }

        if ($statusCounts) {
            $response['statusCounts'] = $statusCounts;
        }

        if ($otherData) {
            $response['otherData'] = $otherData;
        }

        return response()->json($response, $code);
    }
}
