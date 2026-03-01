import { Button } from '@/Components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Todo } from '@/types/todo';

interface TodoDeleteModalProps {
    todo: Todo | null;
    onClose: () => void;
    onConfirm: (id: number) => void;
}

export default function TodoDeleteModal({ todo, onClose, onConfirm }: TodoDeleteModalProps) {
    return (
        <Dialog open={todo !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Todoを削除しますか？</DialogTitle>
                    <DialogDescription>
                        「<span className="font-medium text-foreground">{todo?.title}</span>」を削除します。この操作は取り消せません。
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button variant="destructive" onClick={() => todo && onConfirm(todo.id)}>
                        削除する
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
