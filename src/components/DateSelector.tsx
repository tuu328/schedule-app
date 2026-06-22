import { getWeekDays } from '../data/mockData';

interface DateSelectorProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
    const weekDays = getWeekDays();

    return (
        <div className="w-full md:w-64 lg:w-72 bg-white border-r border-beige-200 flex flex-col">
            <div className="p-4 border-b border-beige-200 bg-beige-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-700">27周</span>
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    
                </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {weekDays.map((item) => (
                    <div
                        key={item.date}
                        className={`date-item p-4 border-b border-beige-100 ${
                            selectedDate === item.date ? 'selected' : ''
                        } ${item.isToday ? 'today' : ''}`}
                        onClick={() => onDateSelect(item.date)}
                    >
                        <div className="text-2xl text-gray-800">{item.day}</div>
                        <div className="text-sm text-gray-500 mt-1">{item.weekDay}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};