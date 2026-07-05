import { Link } from 'react-router-dom';
import { Trees, MapPin, CalendarDays, Map } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white mb-3">
              <Trees size={20} className="text-emerald-400" />
              <span className="font-bold text-lg">Smart Parks Addis</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Connecting residents with Addis Ababa's green spaces, cultural events, and outdoor experiences.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { to: '/parks', icon: <Trees size={14} />, label: 'Parks' },
                { to: '/events', icon: <CalendarDays size={14} />, label: 'Events' },
                { to: '/map', icon: <Map size={14} />, label: 'Interactive Map' },
              ].map(({ to, icon, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors"
                  >
                    {icon} {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Location</p>
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <MapPin size={15} className="text-emerald-400 mt-0.5 shrink-0" />
              <span className="leading-relaxed">
                Addis Ababa City Administration<br />Parks &amp; Tourism Authority<br />Ethiopia
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2026 Addis Ababa Parks &amp; Tourism Authority. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>for Addis Ababa</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
