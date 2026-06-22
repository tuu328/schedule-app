import { useState, useEffect } from 'react';
import type { MoodRecord } from '../data/moodData';
import { mockMoodRecords } from '../data/moodData';

const STORAGE_KEY = 'mood-app-data';

export const useMoodRecords = () => {
    const [records, setRecords] = useState<MoodRecord[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setRecords(JSON.parse(stored));
        } else {
            setRecords(mockMoodRecords);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockMoodRecords));
        }
    }, []);

    useEffect(() => {
        if (records.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        }
    }, [records]);

    const addRecord = (date: string, mood: MoodRecord['mood'], note: string) => {
        const existing = records.find(r => r.date === date);
        if (existing) {
            setRecords(prev =>
                prev.map(r =>
                    r.date === date ? { ...r, mood, note } : r
                )
            );
        } else {
            const newRecord: MoodRecord = {
                id: Math.random().toString(36).substr(2, 9),
                date,
                mood,
                note,
            };
            setRecords(prev => [...prev, newRecord]);
        }
    };

    const getRecordByDate = (date: string) => {
        return records.find(r => r.date === date);
    };

    const getRecordsByMonth = (year: number, month: number) => {
        const monthStr = String(month).padStart(2, '0');
        return records.filter(r =>
            r.date.startsWith(`${year}-${monthStr}`)
        );
    };

    return {
        records,
        addRecord,
        getRecordByDate,
        getRecordsByMonth,
    };
};