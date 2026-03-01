<?php

namespace App\Features\Todo\Queries;

use App\Features\Todo\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ListTodosQuery
{
    public static function run(User $user, array $filters = []): Collection
    {
        $status = $filters['status'] ?? 'all';
        $priority = $filters['priority'] ?? 'all';
        $search = $filters['search'] ?? '';
        $sortKey = $filters['sort_key'] ?? 'created_at';
        $sortDir = $filters['sort_direction'] ?? 'desc';

        $query = $user->todos()->with('tags');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($priority !== 'all') {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        if ($sortKey === 'priority') {
            $query->orderByRaw("CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 END " . ($sortDir === 'asc' ? 'ASC' : 'DESC'));
        } else {
            $allowedSortKeys = ['created_at', 'updated_at', 'due_date', 'title'];
            if (in_array($sortKey, $allowedSortKeys)) {
                $query->orderBy($sortKey, $sortDir === 'asc' ? 'asc' : 'desc');
            } else {
                $query->orderBy('created_at', 'desc');
            }
        }

        return $query->get();
    }
}
