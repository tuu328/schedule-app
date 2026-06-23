import { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { onAuthStateChange, type User } from './useCloudStorage';

export interface MoodRecord {
    id: string;
    user_id?: string;
    date: string;
    mood: 'happy' | 'excited' | 'neutral' | 'tired' | 'sad';
    note: string;
    created_at?: string;
}

export const useMoodRecords = () => {
    const [records, setRecords] = useState<MoodRecord[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange(async (u) => {
            setUser(u);
            if (u) {
                const { data, error } = await supabase
                    .from(TABLES.MOOD_RECORDS)
                    .select('*')
                    .eq('user_id', u.id)
                    .order('date', { ascending: true });
                if (!error && data) {
                    setRecords(data as MoodRecord[]);
                }
            } else {
                setRecords([]);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const addRecord = async (date: string, mood: MoodRecord['mood'], note: string) => {
        if (!user) return;
        const existing = records.find(r => r.date === date);
        if (existing) {
            // 更新
            setRecords(prev => prev.map(r => r.date === date ? { ...r, mood, note } : r));
            await supabase
                .from(TABLES.MOOD_RECORDS)
                .update({ mood, note })
                .eq('id', existing.id);
        } else {
            // 新增
            const tempId = `temp-${Date.now()}`;
            const newRecord: MoodRecord = {
                id: tempId,
                user_id: user.id,
                date,
                mood,
                note,
            };
            setRecords(prev => [...prev, newRecord]);
            const { data, error } = await supabase
                .from(TABLES.MOOD_RECORDS)
                .insert({
                    user_id: user.id,
                    date,
                    mood,
                    note,
                })
                .select()
                .single();
            if (!error && data) {
                setRecords(prev => prev.map(r => r.id === tempId ? (data as MoodRecord) : r));
            }
        }
    };

    const getRecordByDate = (date: string) => {
        return records.find(r => r.date === date);
    };

    const getRecordsByMonth = (year: number, month: number) => {
        const monthStr = String(month + 1).padStart(2, '0');
        return records.filter(r => r.date.startsWith(`${year}-${monthStr}`));
    };

    return {
        records,
        addRecord,
        getRecordByDate,
        getRecordsByMonth,
    };
};
