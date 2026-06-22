import { useState } from 'react';

interface CalendarViewProps {
    todoCounts: Record<string, number>;
    onDateSelect: (date: string) => void;
    onBackToTodo: () => void;
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const CalendarView = ({ todoCounts, onDateSelect, onBackToTodo }: CalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDay = firstDayOfMonth.getDay() || 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const goToday = () => {
        setCurrentDate(new Date());
    };

    const getDateKey = (day: number) => {
        const d = new Date(year, month, day);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const generateCalendarDays = () => {
        const days = [];
        
        for (let i = 1; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-20" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateKey = getDateKey(i);
            const count = todoCounts[dateKey] || 0;
            const isToday = dateKey === todayKey;

            days.push(
                <div
                    key={dateKey}
                    className={`h-20 p-2 flex flex-col cursor-pointer hover:bg-beige-100 rounded-lg transition-colors ${
                        isToday ? 'bg-pink-100' : ''
                    }`}
                    onClick={() => {
                        onDateSelect(dateKey);
                        onBackToTodo();
                    }}
                >
                    <div className={`text-sm font-medium ${isToday ? 'text-pink-500' : 'text-gray-700'}`}>
                        {i}
                    </div>
                    {count > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            <div className="w-2 h-2 bg-pink-300 rounded-full flex-shrink-0" title={`${count} 个待办`}></div>
                            {count > 1 && (
                                <span className="text-xs text-gray-500">{count}</span>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-beige-200 bg-beige-100">
                <div className="flex items-center justify-between">
                    <button
                        onClick={goToday}
                        className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-beige-50 transition-colors"
                    >
                        今天
                    </button>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevMonth}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-lg font-semibold text-gray-700">
                            {year}年{month + 1}月
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-1 hover:bg-white rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-10"></div>
                </div>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-sm text-gray-500 py-2 font-medium">
                            {day}
                        </div>
                    ))}
                    {generateCalendarDays()}
                </div>
            </div>
            <div className="p-4 border-t border-beige-200">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
                        <span>有待办</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-pink-300 bg-pink-100"></div>
                        <span>今天</span>
                    </div>
                </div>
            </div>
        </div>
    );
};