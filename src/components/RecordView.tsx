import { useState, useEffect } from 'react';
import type { MoodRecord } from '../data/moodData';
import { moodColors } from '../data/moodData';

interface RecordViewProps {
    records: MoodRecord[];
    todos: Record<string, string[]>;
    selectedDate: string;
    onAddRecord: (date: string, mood: MoodRecord['mood'], note: string) => void;
    onDateSelect: (date: string) => void;
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const moods: { value: MoodRecord['mood']; emoji: string }[] = [
    { value: 'happy', emoji: '😊' },
    { value: 'excited', emoji: '🎉' },
    { value: 'neutral', emoji: '😐' },
    { value: 'tired', emoji: '😴' },
    { value: 'sad', emoji: '😢' },
];

export const RecordView = ({ records, todos, selectedDate, onAddRecord, onDateSelect }: RecordViewProps) => {
    const [calendarDate, setCalendarDate] = useState(new Date());

    const [editingNote, setEditingNote] = useState('');
    const [editingMood, setEditingMood] = useState<MoodRecord['mood']>('neutral');

    const getDateKey = (day: number, m?: number, y?: number) => {
        const useMonth = m !== undefined ? m : calendarDate.getMonth();
        const useYear = y !== undefined ? y : calendarDate.getFullYear();
        return `${useYear}-${String(useMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getRecordForDate = (dateKey: string) => {
        return records.find(r => r.date === dateKey);
    };

    const getTodosForDate = (dateKey: string) => {
        return todos[dateKey] || [];
    };

    const handleSaveRecord = () => {
        if (selectedDate && (editingNote.trim() || editingMood)) {
            onAddRecord(selectedDate, editingMood, editingNote);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            const record = getRecordForDate(selectedDate);
            if (record) {
                setEditingNote(record.note);
                setEditingMood(record.mood);
            } else {
                setEditingNote('');
                setEditingMood('neutral');
            }
        }
    }, [selectedDate, records]);

    const currentDayInfo = selectedDate ? {
        day: parseInt(selectedDate.split('-')[2]),
        weekDay: weekDays[new Date(selectedDate).getDay() - 1 || 6],
    } : null;

    const dayTodos = selectedDate ? getTodosForDate(selectedDate) : [];

    const calendarYear = calendarDate.getFullYear();
    const calendarMonth = calendarDate.getMonth();
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay() || 7;
    const daysCount = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    const prevMonth = () => {
        setCalendarDate(new Date(calendarYear, calendarMonth - 1, 1));
    };

    const nextMonth = () => {
        setCalendarDate(new Date(calendarYear, calendarMonth + 1, 1));
    };

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return (
        <div className="flex-1 flex bg-beige-50 overflow-hidden">
            <div className="w-1/2 bg-white border-r border-beige-200 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-beige-100 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">待办清单</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-gray-800">{currentDayInfo?.day}</span>
                        <span className="text-sm text-gray-400">{currentDayInfo?.weekDay}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 min-h-0">
                    {dayTodos.length === 0 ? (
                        <div className="text-center text-gray-400 py-4">
                            <p className="text-xs">暂无待办</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {dayTodos.map((todo, i) => (
                                <div key={i} className="flex items-center gap-2 p-2 bg-beige-50 rounded-lg">
                                    <div className="w-3 h-3 border-2 border-pink-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-xs text-gray-700">{todo}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-beige-100 flex-shrink-0">
                    <div className="text-xs text-gray-400 mb-2">心情</div>
                    <div className="flex gap-1.5 mb-3">
                        {moods.map((mood) => (
                            <button
                                key={mood.value}
                                onClick={() => setEditingMood(mood.value)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all flex-shrink-0 ${
                                    editingMood === mood.value
                                        ? 'ring-2 ring-pink-300 scale-110'
                                        : 'hover:bg-beige-100'
                                }`}
                                style={{ backgroundColor: editingMood === mood.value ? moodColors[mood.value] : 'transparent' }}
                            >
                                {mood.emoji}
                            </button>
                        ))}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">日记</div>
                    <textarea
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="写下今天的心情..."
                        className="w-full h-16 p-2 border border-beige-200 rounded-lg resize-none focus:outline-none focus:border-pink-300 text-xs text-gray-700"
                    />
                    <button
                        onClick={handleSaveRecord}
                        className="w-full mt-2 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg text-xs font-medium transition-colors"
                    >
                        保存
                    </button>
                </div>
            </div>
            <div className="w-1/2 bg-white flex flex-col overflow-hidden">
                <div className="p-3 border-b border-beige-100 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevMonth}
                            className="p-1 hover:bg-beige-100 rounded-full"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium text-gray-700">{calendarYear}年{calendarMonth + 1}月</span>
                        <button
                            onClick={nextMonth}
                            className="p-1 hover:bg-beige-100 rounded-full"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 min-h-0">
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-[10px] text-gray-400 py-1">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({ length: firstDay - 1 }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-8" />
                        ))}
                        {Array.from({ length: daysCount }).map((_, i) => {
                            const day = i + 1;
                            const dateKey = getDateKey(day, calendarMonth, calendarYear);
                            const isToday = dateKey === todayKey;
                            const isSelected = dateKey === selectedDate;
                            const dayTodoCount = getTodosForDate(dateKey).length;
                            const dayRecord = getRecordForDate(dateKey);

                            return (
                                <button
                                    key={dateKey}
                                    onClick={() => onDateSelect(dateKey)}
                                    className={`h-8 flex flex-col items-center justify-center text-xs rounded transition-colors ${
                                        isToday ? 'text-pink-500 font-medium' : 'text-gray-600'
                                    } ${isSelected ? 'bg-pink-100' : 'hover:bg-beige-100'}`}
                                >
                                    {day}
                                    <div className="flex gap-0.5 mt-0.5">
                                        {dayTodoCount > 0 && (
                                            <div className="w-1 h-1 bg-pink-300 rounded-full" />
                                        )}
                                        {dayRecord && (
                                            <div className="w-1 h-1 bg-pink-400 rounded-full" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};