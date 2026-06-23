import { useState, useEffect } from 'react';
import { registerUser, loginUser, onAuthStateChange } from '../hooks/useCloudStorage';

interface LoginViewProps {
    onLoginSuccess: () => void;
}

export const LoginView = ({ onLoginSuccess }: LoginViewProps) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 如果已经登录，直接跳出去
    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((user) => {
            if (user) {
                onLoginSuccess();
            }
        });
        return () => subscription.unsubscribe();
    }, [onLoginSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!/^1\d{10}$/.test(phone)) {
            setError('请输入11位手机号');
            return;
        }

        if (password.length < 6) {
            setError('密码至少6位');
            return;
        }

        if (mode === 'register' && password !== confirmPassword) {
            setError('两次密码不一致');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'register') {
                const result = await registerUser(phone, password);
                if (!result.success) {
                    setError(result.message);
                    setLoading(false);
                    return;
                }
                // 注册成功后自动登录
                const loginResult = await loginUser(phone, password);
                if (!loginResult.success) {
                    setError(loginResult.message);
                    setLoading(false);
                    return;
                }
                onLoginSuccess();
            } else {
                const result = await loginUser(phone, password);
                if (!result.success) {
                    setError(result.message);
                    setLoading(false);
                    return;
                }
                onLoginSuccess();
            }
        } catch (err: any) {
            setError(err?.message || '操作失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-beige-100 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">日程待办</h1>
                    <p className="text-sm text-gray-500">{mode === 'login' ? '欢迎回来' : '创建你的账号'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">手机号</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            placeholder="请输入手机号"
                            className="w-full px-4 py-3 bg-white border border-beige-200 rounded-xl focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-gray-700"
                            maxLength={11}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-2">密码</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="请输入密码（至少6位）"
                            className="w-full px-4 py-3 bg-white border border-beige-200 rounded-xl focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-gray-700"
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">确认密码</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="再次输入密码"
                                className="w-full px-4 py-3 bg-white border border-beige-200 rounded-xl focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 text-gray-700"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-pink-300 hover:bg-pink-400 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? '处理中...' : (mode === 'login' ? '登录' : '注册')}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login');
                            setError('');
                        }}
                        className="text-sm text-pink-500 hover:text-pink-600"
                    >
                        {mode === 'login' ? '没有账号？立即注册' : '已有账号？去登录'}
                    </button>
                </div>
            </div>
        </div>
    );
};
