import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { SortDirection, TodoFilters, TodoPriority, TodoSortKey, TodoStatus } from '@/types/todo';
import { cn } from '@/lib/utils';

interface TodoFilterBarProps {
    filters: TodoFilters;
    onChange: (filters: TodoFilters) => void;
}

const STATUS_TABS: { value: TodoStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'pending', label: '未着手' },
    { value: 'in_progress', label: '進行中' },
    { value: 'done', label: '完了' },
];

export default function TodoFilterBar({ filters, onChange }: TodoFilterBarProps) {
    const set = <K extends keyof TodoFilters>(key: K, value: TodoFilters[K]) => {
        onChange({ ...filters, [key]: value });
    };

    const toggleSort = () => {
        set('sortDirection', filters.sortDirection === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div className="space-y-3">
            <Input
                value={filters.searchQuery}
                onChange={(e) => set('searchQuery', e.target.value)}
                placeholder="Todoを検索..."
            />

            <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-md border border-input bg-background">
                    {STATUS_TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => set('status', tab.value)}
                            className={cn(
                                'px-3 py-1.5 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                                filters.status === tab.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <Select
                    value={filters.priority}
                    onValueChange={(value) => set('priority', value as TodoPriority | 'all')}
                >
                    <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">優先度: すべて</SelectItem>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.sortKey}
                    onValueChange={(value) => set('sortKey', value as TodoSortKey)}
                >
                    <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="created_at">並び: 作成日</SelectItem>
                        <SelectItem value="due_date">並び: 期限日</SelectItem>
                        <SelectItem value="priority">並び: 優先度</SelectItem>
                        <SelectItem value="title">並び: タイトル</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSort}
                    className="h-8 text-xs"
                    title={filters.sortDirection === 'asc' ? '昇順' : '降順'}
                >
                    {filters.sortDirection === 'asc' ? '↑ 昇順' : '↓ 降順'}
                </Button>
            </div>
        </div>
    );
}
