import TodoDeleteModal from '@/Components/Todo/TodoDeleteModal';
import TodoEmptyState from '@/Components/Todo/TodoEmptyState';
import TodoFilterBar from '@/Components/Todo/TodoFilterBar';
import TodoFormModal from '@/Components/Todo/TodoFormModal';
import TodoItem from '@/Components/Todo/TodoItem';
import TodoStats from '@/Components/Todo/TodoStats';
import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Todo, TodoFilters, TodoFormData, SortDirection, TodoPriority, TodoSortKey, TodoStatus } from '@/types/todo';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface ServerFilters {
    status: string;
    priority: string;
    search: string;
    sort_key: string;
    sort_direction: string;
}

interface Props {
    todos: Todo[];
    filters: ServerFilters;
}

function toFrontendFilters(f: ServerFilters): TodoFilters {
    return {
        status: (f.status || 'all') as TodoStatus | 'all',
        priority: (f.priority || 'all') as TodoPriority | 'all',
        searchQuery: f.search || '',
        sortKey: (f.sort_key || 'created_at') as TodoSortKey,
        sortDirection: (f.sort_direction || 'desc') as SortDirection,
    };
}

function toServerFilters(f: TodoFilters): Record<string, string> {
    return {
        status: f.status,
        priority: f.priority,
        search: f.searchQuery,
        sort_key: f.sortKey,
        sort_direction: f.sortDirection,
    };
}

export default function TodoIndex({ todos, filters: serverFilters }: Props) {
    const [filters, setFilters] = useState<TodoFilters>(() => toFrontendFilters(serverFilters));

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

    const hasFilters =
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.searchQuery !== '';

    const handleFilterChange = (newFilters: TodoFilters) => {
        setFilters(newFilters);
        router.get('/todos', toServerFilters(newFilters), {
            preserveState: true,
            replace: true,
        });
    };

    const handleToggleComplete = (id: number) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        const newStatus = todo.status === 'done' ? 'pending' : 'done';
        router.patch(`/todos/${id}`, { status: newStatus }, { preserveScroll: true });
    };

    const handleCreate = () => {
        setEditingTodo(null);
        setFormModalOpen(true);
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodo(todo);
        setFormModalOpen(true);
    };

    const handleDelete = (todo: Todo) => {
        setDeletingTodo(todo);
    };

    const handleFormSubmit = (data: TodoFormData) => {
        if (editingTodo) {
            router.patch(`/todos/${editingTodo.id}`, { ...data }, {
                onSuccess: () => {
                    setFormModalOpen(false);
                    setEditingTodo(null);
                },
            });
        } else {
            router.post('/todos', { ...data }, {
                onSuccess: () => {
                    setFormModalOpen(false);
                },
            });
        }
    };

    const handleDeleteConfirm = (id: number) => {
        router.delete(`/todos/${id}`, {
            onSuccess: () => setDeletingTodo(null),
        });
    };

    const handleClearFilters = () => {
        const defaultFilters: TodoFilters = {
            status: 'all',
            priority: 'all',
            searchQuery: '',
            sortKey: 'created_at',
            sortDirection: 'desc',
        };
        setFilters(defaultFilters);
        router.get('/todos', toServerFilters(defaultFilters), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Todo
                    </h2>
                    <Button onClick={handleCreate} size="sm">
                        <Plus className="h-4 w-4" />
                        新規作成
                    </Button>
                </div>
            }
        >
            <Head title="Todo" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <TodoStats todos={todos} />

                        <TodoFilterBar filters={filters} onChange={handleFilterChange} />

                        <div className="space-y-2">
                            {todos.length === 0 ? (
                                <TodoEmptyState
                                    hasFilters={hasFilters}
                                    onClearFilters={handleClearFilters}
                                    onCreateNew={handleCreate}
                                />
                            ) : (
                                todos.map((todo) => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggleComplete={handleToggleComplete}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TodoFormModal
                todo={editingTodo}
                isOpen={formModalOpen}
                onClose={() => {
                    setFormModalOpen(false);
                    setEditingTodo(null);
                }}
                onSubmit={handleFormSubmit}
            />

            <TodoDeleteModal
                todo={deletingTodo}
                onClose={() => setDeletingTodo(null)}
                onConfirm={handleDeleteConfirm}
            />
        </AuthenticatedLayout>
    );
}
