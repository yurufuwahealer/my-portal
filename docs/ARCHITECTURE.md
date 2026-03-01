# Project Architecture

## Stack

- **Backend**: Laravel 12
- **Frontend**: React 18 + TypeScript
- **Bridge**: Inertia.js 2.0 (SPA without API)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: MySQL (via Laravel Sail)

## Directory Structure

```
app/
├── Features/                  # Domain logic (DDD-Light)
│   └── {Domain}/
│       ├── Models/            # Eloquent models
│       ├── Actions/           # Single-purpose write operations
│       └── Queries/           # Read operations with filtering/sorting
├── Http/
│   ├── Controllers/
│   │   └── {Domain}/          # Controllers per domain
│   └── Requests/
│       └── {Domain}/          # FormRequest validation classes
└── Models/                    # Framework-level models (User)

resources/js/
├── Pages/
│   └── {Domain}/              # Inertia page components
├── Components/
│   ├── {Domain}/              # Domain-specific components
│   └── ui/                    # shadcn/ui base components
├── Layouts/                   # Shared layouts
└── types/                     # TypeScript types

database/
└── migrations/                # All schema migrations

docs/                          # Architecture documentation
routes/
└── web.php                    # All web routes
```

## Architecture Principles

### DDD-Light Pattern

Domain logic lives under `app/Features/{Domain}/`:

- **Models**: Eloquent models with relationships and casts. No business logic.
- **Actions**: One class per write operation (Create, Update, Delete). Called from controllers.
- **Queries**: Read operations with filtering, sorting, and eager loading.

### Controllers

Controllers are thin. They:
1. Receive the request
2. Authorize the action
3. Delegate to an Action or Query
4. Return an Inertia response or redirect

### Inertia.js Data Flow

```
Browser → router.get/post/patch/delete → Controller → Action/Query → Inertia::render/redirect
```

- **GET with filters**: `router.get(url, queryParams, { preserveState: true })`
- **Mutations**: `router.post/patch/delete` → controller → redirect back to index
- No REST API layer needed; Inertia handles the SPA navigation

### Authorization

Resource ownership is checked in the controller:
```php
abort_if($todo->user_id !== $request->user()->id, 403);
```

### Frontend Types

TypeScript types in `resources/js/types/` mirror the JSON shape returned by controllers.
Server-side filter keys (`search`, `sort_key`, `sort_direction`) are converted to frontend
filter keys (`searchQuery`, `sortKey`, `sortDirection`) at the page component boundary.

## Implemented Domains

### Todo

| Layer | Files |
|---|---|
| Model | `app/Features/Todo/Models/Todo.php`, `Tag.php` |
| Actions | `CreateTodoAction`, `UpdateTodoAction`, `DeleteTodoAction` |
| Query | `ListTodosQuery` (filter by status, priority, search; sort by multiple keys) |
| Controller | `app/Http/Controllers/Todo/TodoController.php` |
| Requests | `StoreTodoRequest`, `UpdateTodoRequest` |
| Page | `resources/js/Pages/Todo/Index.tsx` |
| Components | `resources/js/Components/Todo/` |

#### Todo DB Schema

- `todos`: id, user_id (FK), title, description, status, priority, due_date, completed_at, category, timestamps
- `tags`: id, name (unique), timestamps
- `todo_tags`: todo_id (FK), tag_id (FK) — pivot table
