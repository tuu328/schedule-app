import { useState } from 'react';
import type { Todo } from '../data/mockData';
import { TodoItem } from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    selectedDate: string;
    onToggle: (id: string) => void;
    onAdd: (date: string, text: string) => void;
}

export const TodoList = ({ todos, selectedDate, onToggle, onAdd }: TodoListProps) => {
    const [newTodoText, setNewTodoText] = useState('');

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodoText.trim()) {
            onAdd(selectedDate, newTodoText.trim());
            setNewTodoText('');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-beige-200">
                <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-full inline-flex">
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <span className="text-gray-700 font-medium">待办清单</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
                {todos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <p className="text-lg">暂无待办事项</p>
                        <p className="text-sm mt-2">点击右下角添加新任务</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {todos.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
                        ))}
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-beige-200">
                <form onSubmit={handleAddTodo} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        placeholder="添加新待办..."
                        className="flex-1 px-4 py-2 border border-beige-300 rounded-full focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 bg-beige-300 hover:bg-beige-400 rounded-full flex items-center justify-center transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};