import type { Todo } from '../data/mockData';

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => void;
}

export const TodoItem = ({ todo, onToggle }: TodoItemProps) => {
    return (
        <div className="flex items-center gap-3 p-3 hover:bg-beige-50 rounded-lg transition-colors">
            <div
                className={`checkbox-circle ${todo.completed ? 'completed' : ''}`}
                onClick={() => onToggle(todo.id)}
            />
            <span className={`todo-text flex-1 text-gray-700 ${todo.completed ? 'completed' : ''}`}>
                {todo.text}
            </span>
        </div>
    );
};