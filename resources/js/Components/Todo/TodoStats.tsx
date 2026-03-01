import { Card, CardContent } from '@/Components/ui/card';
import { Todo } from '@/types/todo';

interface TodoStatsProps {
    todos: Todo[];
}

export default function TodoStats({ todos }: TodoStatsProps) {
    const today = new Date().toISOString().split('T')[0];

    const total = todos.length;
    const done = todos.filter((t) => t.status === 'done').length;
    const inProgress = todos.filter((t) => t.status === 'in_progress').length;
    const overdue = todos.filter(
        (t) => t.due_date && t.due_date < today && t.status !== 'done',
    ).length;

    const stats = [
        { label: '合計', value: total, valueClass: 'text-foreground' },
        { label: '完了', value: done, valueClass: 'text-green-600' },
        { label: '進行中', value: inProgress, valueClass: 'text-blue-600' },
        { label: '期限切れ', value: overdue, valueClass: 'text-destructive' },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${stat.valueClass}`}>{stat.value}</div>
                        <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
