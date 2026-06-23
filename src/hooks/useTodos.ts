import { useState, useEffect } from 'react';
import type { Todo } from '../data/mockData';
import { mockTodos } from '../data/mockData';
import { getCurrentUser, getUserData, saveUserData } from './useCloudStorage';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [user, setUser] = useState(getCurrentUser());

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            const stored = getUserData(currentUser.phone, 'todos');
            if (stored) {
                setTodos(stored);
            } else {
                setTodos(mockTodos);
            }
        } else {
            setTodos(mockTodos);
        }
    }, []);

    useEffect(() => {
        if (user && todos.length >= 0) {
            saveUserData(user.phone, 'todos', todos);
        }
    }, [todos, user]);

    const toggleTodo = (id: string) => {
        setTodos(prev =>
            prev.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const addTodo = (date: string, text: string) => {
        const newTodo: Todo = {
            id: Math.random().toString(36).substr(2, 9),
            date,
            text,
            completed: false,
        };
        setTodos(prev => [...prev, newTodo]);
    };

    const deleteTodo = (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const getTodosByDate = (date: string) => {
        return todos.filter(todo => todo.date === date);
    };

    const getTodoCounts = () => {
        const counts: Record<string, number> = {};
        todos.forEach(todo => {
            counts[todo.date] = (counts[todo.date] || 0) + 1;
        });
        return counts;
    };

    return {
        todos,
        toggleTodo,
        addTodo,
        deleteTodo,
        getTodosByDate,
        getTodoCounts,
    };
};