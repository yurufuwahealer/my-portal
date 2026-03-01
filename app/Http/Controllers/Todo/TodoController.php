<?php

namespace App\Http\Controllers\Todo;

use App\Features\Todo\Actions\CreateTodoAction;
use App\Features\Todo\Actions\DeleteTodoAction;
use App\Features\Todo\Actions\UpdateTodoAction;
use App\Features\Todo\Models\Todo;
use App\Features\Todo\Queries\ListTodosQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $filters = $request->only(['status', 'priority', 'search', 'sort_key', 'sort_direction']);

        $todos = ListTodosQuery::run($user, $filters);

        $todosData = $todos->map(function (Todo $todo) {
            return [
                'id' => $todo->id,
                'title' => $todo->title,
                'description' => $todo->description,
                'status' => $todo->status,
                'priority' => $todo->priority,
                'due_date' => $todo->due_date?->format('Y-m-d'),
                'completed_at' => $todo->completed_at?->toISOString(),
                'category' => $todo->category,
                'tags' => $todo->tags->pluck('name')->values()->all(),
                'created_at' => $todo->created_at->toISOString(),
                'updated_at' => $todo->updated_at->toISOString(),
            ];
        });

        return Inertia::render('Todo/Index', [
            'todos' => $todosData,
            'filters' => [
                'status' => $filters['status'] ?? 'all',
                'priority' => $filters['priority'] ?? 'all',
                'search' => $filters['search'] ?? '',
                'sort_key' => $filters['sort_key'] ?? 'created_at',
                'sort_direction' => $filters['sort_direction'] ?? 'desc',
            ],
        ]);
    }

    public function store(StoreTodoRequest $request): RedirectResponse
    {
        CreateTodoAction::run($request->user(), $request->validated());

        return redirect()->route('todos.index');
    }

    public function update(UpdateTodoRequest $request, Todo $todo): RedirectResponse
    {
        abort_if($todo->user_id !== $request->user()->id, 403);

        UpdateTodoAction::run($todo, $request->validated());

        return redirect()->route('todos.index');
    }

    public function destroy(Request $request, Todo $todo): RedirectResponse
    {
        abort_if($todo->user_id !== $request->user()->id, 403);

        DeleteTodoAction::run($todo);

        return redirect()->route('todos.index');
    }
}
