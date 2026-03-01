import TodoDeleteModal from '@/Components/Todo/TodoDeleteModal';
import TodoEmptyState from '@/Components/Todo/TodoEmptyState';
import TodoFilterBar from '@/Components/Todo/TodoFilterBar';
import TodoFormModal from '@/Components/Todo/TodoFormModal';
import TodoItem from '@/Components/Todo/TodoItem';
import TodoStats from '@/Components/Todo/TodoStats';
import { MOCK_TODOS } from '@/Components/Todo/mockData';
import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Todo, TodoFilters, TodoFormData, TodoPriority, TodoSortKey } from '@/types/todo';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const DEFAULT_FILTERS: TodoFilters = {
    status: 'all',
    priority: 'all',
    searchQuery: '',
    sortKey: 'created_at',
    sortDirection: 'desc',
};

const PRIORITY_ORDER: Record<TodoPriority, number> = { high: 0, medium: 1, low: 2 };

export default function TodoIndex() {
    const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS);
    const [filters, setFilters] = useState<TodoFilters>(DEFAULT_FILTERS);

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

    const filteredTodos = useMemo(() => {
        let result = todos.filter((todo) => {
            if (filters.status !== 'all' && todo.status !== filters.status) return false;
            if (filters.priority !== 'all' && todo.priority !== filters.priority) return false;
            if (filters.searchQuery) {
                const q = filters.searchQuery.toLowerCase();
                if (
                    !todo.title.toLowerCase().includes(q) &&
                    !(todo.description?.toLowerCase().includes(q)) &&
                    !(todo.category?.toLowerCase().includes(q))
                ) {
                    return false;
                }
            }
            return true;
        });

        result = [...result].sort((a, b) => {
            const dir = filters.sortDirection === 'asc' ? 1 : -1;
            const key = filters.sortKey as TodoSortKey;

            if (key === 'priority') {
                return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * dir;
            }
            if (key === 'due_date') {
                const aVal = a.due_date ?? '9999-12-31';
                const bVal = b.due_date ?? '9999-12-31';
                return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
            }
            const aVal = (a[key] as string) ?? '';
            const bVal = (b[key] as string) ?? '';
            return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
        });

        return result;
    }, [todos, filters]);

    const hasFilters =
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.searchQuery !== '';

    const handleToggleComplete = (id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id
                    ? {
                          ...todo,
                          status: todo.status === 'done' ? 'pending' : 'done',
                          completed_at:
                              todo.status === 'done' ? null : new Date().toISOString(),
                      }
                    : todo,
            ),
        );
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
            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === editingTodo.id
                        ? {
                              ...todo,
                              ...data,
                              description: data.description || null,
                              due_date: data.due_date || null,
                              category: data.category || null,
                              updated_at: new Date().toISOString(),
                          }
                        : todo,
                ),
            );
        } else {
            const newTodo: Todo = {
                id: Date.now(),
                title: data.title,
                description: data.description || null,
                status: data.status,
                priority: data.priority,
                due_date: data.due_date || null,
                completed_at: data.status === 'done' ? new Date().toISOString() : null,
                category: data.category || null,
                tags: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setTodos((prev) => [newTodo, ...prev]);
        }
        setFormModalOpen(false);
        setEditingTodo(null);
    };

    const handleDeleteConfirm = (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
        setDeletingTodo(null);
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
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

                        <TodoFilterBar filters={filters} onChange={setFilters} />

                        <div className="space-y-2">
                            {filteredTodos.length === 0 ? (
                                <TodoEmptyState
                                    hasFilters={hasFilters}
                                    onClearFilters={handleClearFilters}
                                    onCreateNew={handleCreate}
                                />
                            ) : (
                                filteredTodos.map((todo) => (
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
