export interface MoodRecord {
    id: string;
    date: string;
    mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'tired';
    note: string;
}

export const moodEmojis: Record<string, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    excited: '🎉',
    tired: '😴',
};

export const moodColors: Record<string, string> = {
    happy: '#f8bbd0',
    neutral: '#d4c4b0',
    sad: '#b3cde0',
    excited: '#fed7aa',
    tired: '#e8ddd0',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const today = new Date();
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const mockMoodRecords: MoodRecord[] = [
    {
        id: generateId(),
        date: formatDate(today),
        mood: 'happy',
        note: '今天点的外卖是国潮包装...心死了\n小赵请我吃的午饭呢，本来想尝试个新的\n结果狠狠踩雷\n其实味道还可以\n但是就是觉得很不卫生',
    },
    {
        id: generateId(),
        date: formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000)),
        mood: 'excited',
        note: '今天工作效率很高，完成了很多任务！',
    },
    {
        id: generateId(),
        date: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
        mood: 'neutral',
        note: '平平淡淡的一天',
    },
];