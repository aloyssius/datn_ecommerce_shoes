<?php

namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class QueryHelper
{
    public static function buildQuerySearchContains(Builder $model, $search, $searchFields)
    {
        $model->where(function ($query) use ($search, $searchFields) {
            foreach ($searchFields as $field) {
                $query->orWhere($field, 'like', '%' . $search . '%');
            }
        });
    }

    public static function buildQueryEquals(Builder $model, $filterField, $value)
    {
        $model->where($filterField, $value);
    }

    public static function buildQueryIn(Builder $model, $filterField, $value)
    {
        $arrayValue = explode(',', $value);
        $model->whereIn($filterField, $arrayValue);
    }

    public static function buildOrderBy(Builder $model, $sortField, $by)
    {
        $model->orderBy($sortField, $by);
    }

    public static function buildPagination(Builder $model, $req)
    {
        return $model->paginate($req->pageSize, ['*'], 'page', $req->currentPage);
    }
}
