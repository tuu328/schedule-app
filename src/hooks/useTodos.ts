import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { onAuthStateChange, type User } from './useCloudStorage';

export interface Todo {
    id: string;
    user_id?: string;
    date: string;
    text: string;
    completed: boolean;
    created_at?: string;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 监听登录态变化，加载对应用户的数据
    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange(async (u) => {
            setUser(u);
            if (u) {
                const { data, error } = await supabase
                    .from(TABLES.TODOS)
                    .select('*')
                    .eq('user_id', u.id)
                    .order('created_at', { ascending: true });
                if (!error && data) {
                    setTodos(data as Todo[]);
                }
            } else {
                setTodos([]);
            }
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    const toggleTodo = async (id: string) => {
        const target = todos.find(t => t.id === id);
        if (!target) return;
        const newCompleted = !target.completed;
        // 乐观更新
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        await supabase
            .from(TABLES.TODOS)
            .update({ completed: newCompleted })
            .eq('id', id);
    };

    const addTodo = async (date: string, text: string) => {
        if (!user) return;
        const tempId = `temp-${Date.now()}`;
        const newTodo: Todo = {
            id: tempId,
            user_id: user.id,
            date,
            text,
            completed: false,
        };
        setTodos(prev => [...prev, newTodo]);
        const { data, error } = await supabase
            .from(TABLES.TODOS)
            .insert({
                user_id: user.id,
                date,
                text,
                completed: false,
            })
            .select()
            .single();
        if (!error && data) {
            setTodos(prev => prev.map(t => t.id === tempId ? (data as Todo) : t));
        }
    };

    const deleteTodo = async (id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id));
        await supabase
            .from(TABLES.TODOS)
            .delete()
            .eq('id', id);
    };

    const getTodosByDate = (date: string) => {
        return todos.filter(t => t.date === date);
    };

    const getTodoCounts = () => {
        const counts: Record<string, number> = {};
        todos.forEach(t => {
            counts[t.date] = (counts[t.date] || 0) + 1;
        });
        return counts;
    };

    return {
        todos,
        loading,
        toggleTodo,
        addTodo,
        deleteTodo,
        getTodosByDate,
        getTodoCounts,
    };
};
