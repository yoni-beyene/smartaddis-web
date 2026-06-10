import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth.store';
import { Trees } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-green-700">
          <Trees size={22} />
          <span>Smart Parks Addis</span>
        </Link>
        <div className="flex items-center gap-6">
          {[
            { to: '/parks', label: t('nav.parks') },
            { to: '/events', label: t('nav.events') },
            { to: '/map', label: t('nav.map') },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="text-sm text-gray-600 hover:text-green-700 font-medium transition-colors">
              {label}
            </Link>
          ))}
          <button
            onClick={toggleLang}
            className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 hover:border-green-500 hover:text-green-600 transition-colors"
          >
            {i18n.language === 'en' ? 'አማ' : 'EN'}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-red-500 hover:text-red-700"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 hover:text-green-700">{t('nav.login')}</Link>
              <Link to="/register" className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-full hover:bg-green-700 transition-colors">
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
