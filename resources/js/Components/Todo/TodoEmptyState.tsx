import { Button } from '@/Components/ui/button';

interface TodoEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
    onCreateNew: () => void;
}

export default function TodoEmptyState({ hasFilters, onClearFilters, onCreateNew }: TodoEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl text-muted-foreground">
                {hasFilters ? '🔍' : '📝'}
            </div>
            {hasFilters ? (
                <>
                    <h3 className="mb-2 text-lg font-medium text-foreground">
                        条件に一致するTodoが見つかりません
                    </h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        フィルタを変更するか、検索条件を見直してください。
                    </p>
                    <Button variant="secondary" onClick={onClearFilters}>
                        フィルタをクリア
                    </Button>
                </>
            ) : (
                <>
                    <h3 className="mb-2 text-lg font-medium text-foreground">
                        Todoがまだありません
                    </h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                        新しいTodoを作成して、タスク管理を始めましょう。
                    </p>
                    <Button onClick={onCreateNew}>
                        最初のTodoを作成
                    </Button>
                </>
            )}
        </div>
    );
}
