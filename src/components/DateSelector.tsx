import { getWeekDays, getWeekNumber } from '../data/mockData';

interface DateSelectorProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}

export const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
    const weekDays = getWeekDays();
    const weekNumber = getWeekNumber();

    return (
        <div className="w-20 sm:w-24 bg-white border-r border-beige-200 flex flex-col flex-shrink-0">
            <div className="p-2 border-b border-beige-200 bg-beige-100 flex-shrink-0 text-center">
                <span className="text-xs font-semibold text-gray-700">{weekNumber}周</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {weekDays.map((item) => (
                    <div
                        key={item.date}
                        className={`date-item p-1.5 border-b border-beige-100 text-center ${
                            selectedDate === item.date ? 'selected' : ''
                        } ${item.isToday ? 'today' : ''}`}
                        onClick={() => onDateSelect(item.date)}
                    >
                        <div className="text-base text-gray-800 leading-tight">{item.day}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{item.weekDay}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
