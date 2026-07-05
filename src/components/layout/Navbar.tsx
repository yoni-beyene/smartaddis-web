import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => { setOpen(false); }, [pathname]);

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };

  const langButton = (
    <button
      onClick={toggleLang}
      className="text-xs border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:border-accent-gold hover:text-forest-ink transition-all font-medium"
    >
      {i18n.language === 'en' ? 'አማ' : 'EN'}
    </button>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.svg" alt="Smart Addis" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, key }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-dark-forest/[0.07] text-dark-forest'
                    : 'text-gray-500 hover:text-primary-green hover:bg-gray-50'
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {langButton}
          {user ? (
            <>
              <span className="text-sm text-gray-600 font-medium">{user.name}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="text-sm text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-full transition-all"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary-green px-3 py-1.5 rounded-full hover:bg-gray-50 transition-all"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="text-sm bg-dark-forest text-cotton px-4 py-2 rounded-full hover:bg-primary-green font-semibold transition-colors shadow-sm"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          {langButton}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="p-2 -mr-1 rounded-lg text-forest-ink hover:bg-gray-100 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ to, key }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-dark-forest/[0.07] text-dark-forest'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 font-medium truncate">{user.name}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-sm text-red-500 hover:text-red-700 border border-red-100 px-4 py-2 rounded-full transition-all shrink-0"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-center text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="text-center text-sm bg-dark-forest text-cotton px-4 py-2.5 rounded-full hover:bg-primary-green font-semibold transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
