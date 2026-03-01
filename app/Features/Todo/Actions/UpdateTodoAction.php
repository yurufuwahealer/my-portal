<?php

namespace App\Features\Todo\Actions;

use App\Features\Todo\Models\Tag;
use App\Features\Todo\Models\Todo;

class UpdateTodoAction
{
    public static function run(Todo $todo, array $data): Todo
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        // completed_at を status に合わせて自動設定
        if (isset($data['status'])) {
            if ($data['status'] === 'done' && $todo->status !== 'done') {
                $data['completed_at'] = now();
            } elseif ($data['status'] !== 'done') {
                $data['completed_at'] = null;
            }
        }

        $todo->update($data);

        if ($tags !== null) {
            $tagIds = collect($tags)->map(function (string $name) {
                return Tag::firstOrCreate(['name' => trim($name)])->id;
            });
            $todo->tags()->sync($tagIds);
        }

        return $todo->load('tags');
    }
}
