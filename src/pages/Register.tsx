import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useState } from 'react';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; name: string; email: string; role: string };
}

interface RegisterFormData { name: string; email: string; password: string; }

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const e: { error?: string } = await res.json();
        throw new Error(e.error ?? 'Registration failed');
      }
      const json: AuthResponse = await res.json();
      login(json.user, json.accessToken, json.refreshToken);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const fields: Array<{ name: keyof RegisterFormData; label: string; type: string; placeholder: string }> = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Abebe Bekele' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'abebe@email.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Join to write reviews and save your favorite parks</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
              <input
                {...register(name, { required: true })}
                type={type}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
