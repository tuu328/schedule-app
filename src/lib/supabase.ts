import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cbskejhpsmwfnfpxados.supabase.co';
const supabaseAnonKey = 'sb_publishable_v9xsvlidk_4MwfVF_Drf_g_5C8gOe_e';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 表名常量
export const TABLES = {
    TODOS: 'todos',
    MOOD_RECORDS: 'mood_records',
} as const;
