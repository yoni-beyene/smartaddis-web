import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/auth.store';

const NAV_LINKS = [
  { to: '/parks', key: 'nav.parks' },
  { to: '/events', key: 'nav.events' },
  { to: '/map', key: 'nav.map' },
] as const;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="Smart Addis"
            className="h-9 w-auto"
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ to, key }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:border-green-400 hover:text-green-600 transition-all font-medium"
          >
            {i18n.language === 'en' ? 'አማ' : 'EN'}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-600 font-medium">{user.name}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-full transition-all"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-green-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-all"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-medium transition-colors shadow-sm"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
