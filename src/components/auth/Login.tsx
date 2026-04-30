import React, { useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const { signIn, signUp, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                setError('');
                await signIn(email, password);
                navigate('/dashboard');
            } catch (err) {
                setError('تعذّر تسجيل الدخول. يُرجى التأكّد من صحّة بيانات الاعتماد.');
                console.error(err);
            }
        });
    };

    const handleSignUp = () => {
        startTransition(async () => {
            try {
                setError('');
                await signUp(email, password);
                navigate('/dashboard');
            } catch (err: unknown) {
                setError('تعذّر إنشاء الحساب: ' + (err instanceof Error ? err.message : String(err)));
                console.error(err);
            }
        });
    };

    const handleGoogleSignIn = () => {
        startTransition(async () => {
            try {
                setError('');
                await signInWithGoogle();
                navigate('/dashboard');
            } catch (err: unknown) {
                setError('تعذّر تسجيل الدخول عبر Google: ' + (err instanceof Error ? err.message : String(err)));
                console.error(err);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">تسجيل الدخول</h2>
                {error && <div className="bg-[#DC2626]/15 border border-[#DC2626] text-[#B91C1C] px-4 py-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col items-center justify-between">
                        <button
                            className="bg-[#1B7778] hover:bg-[#1B7778] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? 'جاري التحميل...' : 'دخول'}
                        </button>
                        <button
                            className="bg-[#1E9658] hover:bg-[#1E9658] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
                            type="button"
                            onClick={handleSignUp}
                            disabled={isPending}
                        >
                            تسجيل جديد
                        </button>
                        <button
                            className="bg-[#B91C1C] hover:bg-[#B91C1C] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isPending}
                        >
                            تسجيل الدخول عبر Google
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
