export type TodoStatus = 'pending' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';
export type TodoSortKey = 'due_date' | 'priority' | 'created_at' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface Todo {
    id: number;
    title: string;
    description: string | null;
    status: TodoStatus;
    priority: TodoPriority;
    due_date: string | null;
    completed_at: string | null;
    category: string | null;
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface TodoFormData {
    title: string;
    description: string;
    status: TodoStatus;
    priority: TodoPriority;
    due_date: string;
    category: string;
}

export interface TodoFilters {
    status: TodoStatus | 'all';
    priority: TodoPriority | 'all';
    searchQuery: string;
    sortKey: TodoSortKey;
    sortDirection: SortDirection;
}
