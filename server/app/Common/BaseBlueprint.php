<?php

namespace App\Common;

use App\Constants\ConstantSystem;
use Illuminate\Database\Schema\Blueprint;

class BaseBlueprint extends Blueprint
{
    public function baseColumn()
    {
        $this->uuid('id')->primary();
        $this->timestamps();
        $this->uuid('created_by')->nullable();
        $this->uuid('updated_by')->nullable();

        return $this;
    }

    public function addColumnName()
    {
        $this->string('name', ConstantSystem::DEFAULT_MAX_LENGTH);
        return $this;
    }

    public function addColumnCode()
    {
        $this->string('code', ConstantSystem::CODE_MAX_LENGTH)->unique();
        return $this;
    }

    public function addSoftDeletes()
    {
        $this->softDeletes()->nullable();
        return $this;
    }

    public function bigDecimal(string $colunmName)
    {
        $this->decimal($colunmName, 15, 2)->default(0);
    }

    public function bigDecimalNullable(string $colunmName)
    {
        $this->decimal($colunmName, 15, 2)->nullable();
    }
}
