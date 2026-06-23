import { useState, useEffect, useMemo } from 'react';
import { DateSelector } from './components/DateSelector';
import { TodoList } from './components/TodoList';
import { CalendarView } from './components/CalendarView';
import { RecordView } from './components/RecordView';
import { LoginView } from './components/LoginView';
import { useTodos } from './hooks/useTodos';
import { useMoodRecords } from './hooks/useMoodRecords';
import { onAuthStateChange } from './hooks/useCloudStorage';
import { supabase } from './lib/supabase';

type TabType = 'todo' | 'calendar' | 'record';

function App() {
    const [selectedDate, setSelectedDate] = useState('');
    const [currentTab, setCurrentTab] = useState<TabType>('todo');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const { getTodosByDate, toggleTodo, addTodo, getTodoCounts, todos } = useTodos();
    const { records, addRecord } = useMoodRecords();

    // 监听 Supabase 登录态
    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((user) => {
            setIsLoggedIn(!!user);
            setAuthLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
    }, []);

    const selectedTodos = getTodosByDate(selectedDate);
    const todoCounts = getTodoCounts();

    const todosMap = useMemo(() => {
        const map: Record<string, string[]> = {};
        todos.forEach(todo => {
            if (!map[todo.date]) {
                map[todo.date] = [];
            }
            map[todo.date].push(todo.text);
        });
        return map;
    }, [todos]);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleDateSelectFromCalendar = (date: string) => {
        setSelectedDate(date);
    };

    const handleBackToTodo = () => {
        setCurrentTab('todo');
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-beige-100 flex items-center justify-center">
                <div className="text-gray-400 text-sm">加载中...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <LoginView onLoginSuccess={handleLoginSuccess} />;
    }

    const renderContent = () => {
        switch (currentTab) {
            case 'todo':
                return (
                    <>
                        <DateSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                        <TodoList
                            todos={selectedTodos}
                            selectedDate={selectedDate}
                            onToggle={toggleTodo}
                            onAdd={addTodo}
                        />
                    </>
                );
            case 'calendar':
                return (
                    <CalendarView
                        todoCounts={todoCounts}
                        onDateSelect={handleDateSelectFromCalendar}
                        onBackToTodo={handleBackToTodo}
                    />
                );
            case 'record':
                return (
                    <RecordView
                        records={records}
                        todos={todosMap}
                        selectedDate={selectedDate}
                        onAddRecord={addRecord}
                        onDateSelect={setSelectedDate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-beige-100 flex flex-col max-w-2xl mx-auto">
            <div className="flex-1 flex flex-row w-full shadow-lg overflow-hidden">
                {renderContent()}
            </div>
            <div className="h-16 bg-beige-200 flex items-center justify-around px-6 relative">
                <button
                    className={`flex flex-col items-center gap-1 transition-colors ${
                        currentTab === 'todo' ? 'text-pink-400' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => setCurrentTab('todo')}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        {currentTab === 'todo' && <circle cx="12" cy="12" r="4" fill="currentColor" />}
                    </svg>
                    <span className="text-xs">待办</span>
                </button>
                <button
                    className={`flex flex-col items-center gap-1 transition-colors ${
                        currentTab === 'calendar' ? 'text-pink-400' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => setCurrentTab('calendar')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">日历</span>
                </button>
                <button
                    className={`flex flex-col items-center gap-1 transition-colors ${
                        currentTab === 'record' ? 'text-pink-400' : 'text-gray-400 hover:text-gray-600'
                    }`}
                    onClick={() => setCurrentTab('record')}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs">记录</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                    title="退出登录"
                >
                    退出
                </button>
            </div>
        </div>
    );
}

export default App;
