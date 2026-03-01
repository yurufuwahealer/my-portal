import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Todo, TodoPriority, TodoStatus } from '@/types/todo';
import { Pencil, Trash2 } from 'lucide-react';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: number) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (todo: Todo) => void;
}

const PRIORITY_VARIANT: Record<TodoPriority, 'destructive' | 'default' | 'secondary'> = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary',
};

const PRIORITY_LABEL: Record<TodoPriority, string> = {
    high: '高',
    medium: '中',
    low: '低',
};

const STATUS_VARIANT: Record<TodoStatus, 'default' | 'secondary' | 'outline'> = {
    done: 'default',
    in_progress: 'secondary',
    pending: 'outline',
};

const STATUS_LABEL: Record<TodoStatus, string> = {
    done: '完了',
    in_progress: '進行中',
    pending: '未着手',
};

export default function TodoItem({ todo, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = todo.due_date && todo.due_date < today && todo.status !== 'done';
    const isDone = todo.status === 'done';

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm transition-opacity ${isDone ? 'opacity-60' : ''}`}>
            <div className="mt-0.5 shrink-0">
                <Checkbox
                    checked={isDone}
                    onCheckedChange={() => onToggleComplete(todo.id)}
                />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {todo.title}
                    </span>
                    <Badge variant={PRIORITY_VARIANT[todo.priority]}>
                        {PRIORITY_LABEL[todo.priority]}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[todo.status]}>
                        {STATUS_LABEL[todo.status]}
                    </Badge>
                </div>

                {todo.description && (
                    <p className="mt-1 truncate text-xs text-muted-foreground">{todo.description}</p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {todo.category && (
                        <Badge variant="outline" className="text-xs">
                            {todo.category}
                        </Badge>
                    )}
                    {todo.tags.map((tag) => (
                        <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                            #{tag}
                        </span>
                    ))}
                    {todo.due_date && (
                        <span className={isOverdue ? 'font-medium text-destructive' : ''}>
                            期限: {formatDate(todo.due_date)}
                            {isOverdue && ' (期限切れ)'}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(todo)}
                    aria-label="編集"
                    className="h-8 w-8"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(todo)}
                    aria-label="削除"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
