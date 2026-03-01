<?php

namespace App\Features\Todo\Actions;

use App\Features\Todo\Models\Todo;

class DeleteTodoAction
{
    public static function run(Todo $todo): void
    {
        $todo->delete();
    }
}
