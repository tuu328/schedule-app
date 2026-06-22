import { useState, useEffect } from 'react';
import type { MoodRecord } from '../data/moodData';
import { moodEmojis, moodColors } from '../data/moodData';

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
    const [currentDate] = useState(new Date());
    const [calendarDate, setCalendarDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDateKey = (day: number, m?: number, y?: number) => {
        const useMonth = m !== undefined ? m : month;
        const useYear = y !== undefined ? y : year;
        return `${useYear}-${String(useMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getRecordForDate = (dateKey: string) => {
        return records.find(r => r.date === dateKey);
    };

    const getTodosForDate = (dateKey: string) => {
        return todos[dateKey] || [];
    };

    const [editingNote, setEditingNote] = useState('');
    const [editingMood, setEditingMood] = useState<MoodRecord['mood']>('neutral');

    const handleSaveRecord = () => {
        if (selectedDate && (editingNote.trim() || editingMood)) {
            onAddRecord(selectedDate, editingMood, editingNote);
        }
    };

    const selectedDateRecord = selectedDate ? getRecordForDate(selectedDate) : null;

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
    }, [selectedDate]);

    const handlePrevDay = () => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const newDate = new Date(y, m - 1, d - 1);
        const newDateKey = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
        onDateSelect(newDateKey);
    };

    const handleNextDay = () => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const newDate = new Date(y, m - 1, d + 1);
        const newDateKey = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
        onDateSelect(newDateKey);
    };

    const currentDayInfo = selectedDate ? {
        day: parseInt(selectedDate.split('-')[2]),
        weekDay: weekDays[new Date(selectedDate).getDay() - 1 || 6],
        month: parseInt(selectedDate.split('-')[1]),
        year: parseInt(selectedDate.split('-')[0])
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
        <div className="flex-1 flex flex-col bg-beige-50">
            <div className="p-4 bg-beige-200 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">{month + 1}月</span>
            </div>
            <div className="flex-1 flex">
                <div className="w-1/2 bg-white border-r border-beige-200 flex flex-col">
                    <div className="p-4 border-b border-beige-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-semibold text-gray-800">{currentDayInfo?.day}</span>
                                <span className="text-sm text-gray-400 ml-2">{currentDayInfo?.weekDay}</span>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={handlePrevDay}
                                    className="p-1 hover:bg-beige-100 rounded-full"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={handleNextDay}
                                    className="p-1 hover:bg-beige-100 rounded-full"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                            <span className="text-sm font-medium text-gray-600">待办清单</span>
                        </div>
                        {dayTodos.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p className="text-sm">暂无待办</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dayTodos.map((todo, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 bg-beige-50 rounded-lg">
                                        <div className="checkbox-circle"></div>
                                        <span className="text-sm text-gray-700">{todo}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-6">
                            <div className="text-xs text-gray-400 mb-2">心情</div>
                            <div className="flex gap-2">
                                {moods.map((mood) => (
                                    <button
                                        key={mood.value}
                                        onClick={() => setEditingMood(mood.value)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
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
                        </div>
                        <div className="mt-4">
                            <div className="text-xs text-gray-400 mb-2">日记</div>
                            <textarea
                                value={editingNote}
                                onChange={(e) => setEditingNote(e.target.value)}
                                placeholder="写下今天的心情..."
                                className="w-full h-24 p-3 border border-beige-200 rounded-lg resize-none focus:outline-none focus:border-pink-300 text-sm text-gray-700"
                            />
                        </div>
                        {selectedDateRecord && selectedDateRecord.note && (
                            <div className="mt-4 p-3 bg-beige-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <span>{moodEmojis[selectedDateRecord.mood]}</span>
                                    <span className="text-xs text-gray-400">已保存</span>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedDateRecord.note}</p>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t border-beige-100">
                        <button
                            onClick={handleSaveRecord}
                            className="w-full py-2 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg text-sm font-medium transition-colors"
                        >
                            保存
                        </button>
                    </div>
                </div>
                <div className="w-1/2 bg-white flex flex-col">
                    <div className="p-4 border-b border-beige-100">
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
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="grid grid-cols-7 gap-0.5 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs text-gray-400 py-1">
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

                                return (
                                    <button
                                        key={dateKey}
                                        onClick={() => onDateSelect(dateKey)}
                                        className={`h-8 flex flex-col items-center justify-center text-xs rounded transition-colors ${
                                            isToday ? 'text-pink-500 font-medium' : 'text-gray-600'
                                        } ${isSelected ? 'bg-pink-100' : 'hover:bg-beige-100'}`}
                                    >
                                        {day}
                                        {dayTodoCount > 0 && (
                                            <div className="w-1 h-1 bg-pink-300 rounded-full mt-0.5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};