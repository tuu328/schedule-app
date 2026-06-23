import { useState, useEffect } from 'react';
import type { MoodRecord } from '../data/moodData';
import { mockMoodRecords } from '../data/moodData';
import { getCurrentUser, getUserData, saveUserData } from './useCloudStorage';

export const useMoodRecords = () => {
    const [records, setRecords] = useState<MoodRecord[]>([]);
    const [user, setUser] = useState(getCurrentUser());

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            const stored = getUserData(currentUser.phone, 'moodRecords');
            if (stored) {
                setRecords(stored);
            } else {
                setRecords(mockMoodRecords);
            }
        } else {
            setRecords(mockMoodRecords);
        }
    }, []);

    useEffect(() => {
        if (user) {
            saveUserData(user.phone, 'moodRecords', records);
        }
    }, [records, user]);

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