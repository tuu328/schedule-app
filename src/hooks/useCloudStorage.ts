// 云端存储 hook - 使用 localStorage 模拟云端（用户级别隔离）
// 生产环境建议替换为真实的后端 API

const USER_KEY = 'current_user';
const USER_DATA_PREFIX = 'user_data_';

export interface User {
    phone: string;
    createdAt: string;
}

export const getCurrentUser = (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

export const setCurrentUser = (user: User | null) => {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
};

export const getUserDataKey = (phone: string, dataType: string) => {
    return `${USER_DATA_PREFIX}${phone}_${dataType}`;
};

export const saveUserData = (phone: string, dataType: string, data: any) => {
    const key = getUserDataKey(phone, dataType);
    localStorage.setItem(key, JSON.stringify(data));
};

export const getUserData = (phone: string, dataType: string): any => {
    const key = getUserDataKey(phone, dataType);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

export const registerUser = (phone: string, password: string): { success: boolean; message: string } => {
    if (!phone || phone.length < 11) {
        return { success: false, message: '请输入有效的手机号' };
    }
    if (!password || password.length < 6) {
        return { success: false, message: '密码至少6位' };
    }

    const users = JSON.parse(localStorage.getItem('all_users') || '{}');
    if (users[phone]) {
        return { success: false, message: '该手机号已注册' };
    }

    users[phone] = {
        password: btoa(password),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem('all_users', JSON.stringify(users));

    return { success: true, message: '注册成功' };
};

export const loginUser = (phone: string, password: string): { success: boolean; message: string; user?: User } => {
    if (!phone || phone.length < 11) {
        return { success: false, message: '请输入有效的手机号' };
    }
    if (!password) {
        return { success: false, message: '请输入密码' };
    }

    const users = JSON.parse(localStorage.getItem('all_users') || '{}');
    if (!users[phone]) {
        return { success: false, message: '该手机号未注册' };
    }

    if (users[phone].password !== btoa(password)) {
        return { success: false, message: '密码错误' };
    }

    const user: User = {
        phone,
        createdAt: users[phone].createdAt,
    };

    return { success: true, message: '登录成功', user };
};