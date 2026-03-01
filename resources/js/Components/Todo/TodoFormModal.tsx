import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Todo, TodoFormData, TodoPriority, TodoStatus } from '@/types/todo';
import { FormEvent, useEffect, useState } from 'react';

interface TodoFormModalProps {
    todo: Todo | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TodoFormData) => void;
}

const EMPTY_FORM: TodoFormData = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    category: '',
};

export default function TodoFormModal({ todo, isOpen, onClose, onSubmit }: TodoFormModalProps) {
    const [form, setForm] = useState<TodoFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});

    useEffect(() => {
        if (todo) {
            setForm({
                title: todo.title,
                description: todo.description ?? '',
                status: todo.status,
                priority: todo.priority,
                due_date: todo.due_date ?? '',
                category: todo.category ?? '',
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setErrors({});
    }, [todo, isOpen]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof TodoFormData, string>> = {};
        if (!form.title.trim()) {
            newErrors.title = 'タイトルは必須です。';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(form);
        }
    };

    const set = <K extends keyof TodoFormData>(key: K, value: TodoFormData[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {todo ? 'Todoを編集' : '新しいTodoを作成'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="todo-title">タイトル *</Label>
                            <Input
                                id="todo-title"
                                value={form.title}
                                onChange={(e) => set('title', e.target.value)}
                                placeholder="タイトルを入力"
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="todo-description">説明</Label>
                            <Textarea
                                id="todo-description"
                                rows={3}
                                value={form.description}
                                onChange={(e) => set('description', e.target.value)}
                                placeholder="詳細説明（任意）"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="todo-status">ステータス</Label>
                                <Select
                                    value={form.status}
                                    onValueChange={(value) => set('status', value as TodoStatus)}
                                >
                                    <SelectTrigger id="todo-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">未着手</SelectItem>
                                        <SelectItem value="in_progress">進行中</SelectItem>
                                        <SelectItem value="done">完了</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="todo-priority">優先度</Label>
                                <Select
                                    value={form.priority}
                                    onValueChange={(value) => set('priority', value as TodoPriority)}
                                >
                                    <SelectTrigger id="todo-priority">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">高</SelectItem>
                                        <SelectItem value="medium">中</SelectItem>
                                        <SelectItem value="low">低</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="todo-due-date">期限日</Label>
                                <Input
                                    id="todo-due-date"
                                    type="date"
                                    value={form.due_date}
                                    onChange={(e) => set('due_date', e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="todo-category">カテゴリ</Label>
                                <Input
                                    id="todo-category"
                                    value={form.category}
                                    onChange={(e) => set('category', e.target.value)}
                                    placeholder="例: 仕事、個人"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            キャンセル
                        </Button>
                        <Button type="submit">
                            {todo ? '更新する' : '作成する'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
