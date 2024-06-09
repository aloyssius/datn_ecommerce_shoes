<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;

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
        $showsql = DB::getQueryLog();

        $response = [
            'success' => true,
            'data'    => $data,
            'sql' => $showsql,
        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }
        return response()->json($response, $code);
    }

    public static function responsepage($page, $message = '', $code = 200)
    {
        $showsql = DB::getQueryLog();

        $response = [
            'success' => true,
            'data'    => $page->items(),
            'page' => [
                'currentpage' => $page->currentpage(),
                'totalpages' => $page->lastpage(),
                'pagesize' => $page->perpage(),
                'totalElements' => $page->total(),
            ],
            'sql' => $showsql,

        ];
        if (!empty($message)) {
            $response['message'] = $message;
        }
        return response()->json($response, $code);
    }
}
