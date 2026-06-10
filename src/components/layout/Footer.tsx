import { Trees } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Trees size={18} />
          <span className="font-semibold">Smart Parks Addis Ababa</span>
        </div>
        <p className="text-sm">© 2026 Addis Ababa Parks &amp; Tourism Authority</p>
      </div>
    </footer>
  );
}
