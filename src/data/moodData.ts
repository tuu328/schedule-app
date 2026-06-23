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

export const mockMoodRecords: MoodRecord[] = [];