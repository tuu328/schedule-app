// 云端存储 hook - 使用 Supabase 作为真实后端
// 实现方式：UI 用手机号登录，内部转换为 email (手机号@phone.app) 调用 Supabase Auth
// 这样可以避免配置 Twilio 等短信服务
import { supabase } from '../lib/supabase';

export interface User {
    id: string;
    phone: string;
    createdAt: string;
}

const PHONE_DOMAIN = '@phone.app';

const phoneToEmail = (phone: string) => `${phone}${PHONE_DOMAIN}`;

// 监听 Supabase 登录态变化
export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            const phoneMeta = session.user.user_metadata?.phone as string | undefined;
            callback({
                id: session.user.id,
                phone: phoneMeta || '',
                createdAt: session.user.created_at,
            });
        } else {
            callback(null);
        }
    });
};

// 注册（手机号 + 密码）
export const registerUser = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!phone || phone.length < 11) {
        return { success: false, message: '请输入有效的手机号' };
    }
    if (!password || password.length < 6) {
        return { success: false, message: '密码至少6位' };
    }

    const email = phoneToEmail(phone);
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { phone }, // 把手机号存到 user_metadata
            emailRedirectTo: undefined,
        },
    });

    if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            return { success: false, message: '该手机号已注册' };
        }
        return { success: false, message: error.message || '注册失败' };
    }

    // Supabase 默认会发送验证邮件。我们已经在 dashboard 关掉了 "Confirm email"，所以会直接返回 session
    if (data.session) {
        return { success: true, message: '注册成功' };
    }
    return { success: true, message: '注册成功，请登录' };
};

// 登录
export const loginUser = async (phone: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    if (!phone || phone.length < 11) {
        return { success: false, message: '请输入有效的手机号' };
    }
    if (!password) {
        return { success: false, message: '请输入密码' };
    }

    const email = phoneToEmail(phone);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('Invalid login credentials')) {
            return { success: false, message: '手机号或密码错误' };
        }
        return { success: false, message: error.message || '登录失败' };
    }

    if (data.user) {
        return {
            success: true,
            message: '登录成功',
            user: {
                id: data.user.id,
                phone: (data.user.user_metadata?.phone as string) || phone,
                createdAt: data.user.created_at,
            }
        };
    }

    return { success: false, message: '登录失败' };
};

// 登出
export const logoutUser = async () => {
    await supabase.auth.signOut();
};

// 兼容旧代码的 no-op 接口
export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    return {
        id: session.user.id,
        phone: (session.user.user_metadata?.phone as string) || '',
        createdAt: session.user.created_at,
    };
};
