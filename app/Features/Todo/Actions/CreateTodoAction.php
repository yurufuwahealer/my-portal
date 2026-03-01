<?php

namespace App\Features\Todo\Actions;

use App\Features\Todo\Models\Tag;
use App\Features\Todo\Models\Todo;
use App\Models\User;

class CreateTodoAction
{
    public static function run(User $user, array $data): Todo
    {
        $tags = $data['tags'] ?? [];
        unset($data['tags']);

        if (isset($data['status']) && $data['status'] === 'done' && empty($data['completed_at'])) {
            $data['completed_at'] = now();
        }

        $todo = $user->todos()->create($data);

        if (!empty($tags)) {
            $tagIds = collect($tags)->map(function (string $name) {
                return Tag::firstOrCreate(['name' => trim($name)])->id;
            });
            $todo->tags()->sync($tagIds);
        }

        return $todo->load('tags');
    }
}
