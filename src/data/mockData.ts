export interface Todo {
    id: string;
    date: string;
    text: string;
    completed: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const today = new Date();
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const mockTodos: Todo[] = [
    {
        id: generateId(),
        date: formatDate(today),
        text: '呼啦圈30分钟',
        completed: false,
    },
    {
        id: generateId(),
        date: formatDate(today),
        text: '拖房间的地',
        completed: false,
    },
    {
        id: generateId(),
        date: formatDate(today),
        text: '丢垃圾',
        completed: false,
    },
    {
        id: generateId(),
        date: formatDate(today),
        text: '看书30分钟',
        completed: false,
    },
    {
        id: generateId(),
        date: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)),
        text: '准备会议材料',
        completed: false,
    },
    {
        id: generateId(),
        date: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)),
        text: '回复邮件',
        completed: true,
    },
    {
        id: generateId(),
        date: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
        text: '健身',
        completed: false,
    },
];

export const getWeekDays = () => {
    const days = [];
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 1; i <= 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({
            date: formatDate(date),
            day: date.getDate(),
            weekDay: weekDays[date.getDay()],
            isToday: formatDate(date) === formatDate(today),
        });
    }
    
    return days;
};