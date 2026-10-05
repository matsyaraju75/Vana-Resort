import React from 'react';
import { RESORT_INFO } from '../../data/resortInfo';

export const FloatingActions: React.FC = () => {
  const whatsappUrl = `https://wa.me/${RESORT_INFO.contact.whatsapp}?text=${encodeURIComponent(
    'Hi Vana Resort Araku, I would like to inquire about room availability and reservations.'
  )}`;

  const instagramUrl = RESORT_INFO.contact.instagram.url || 'https://www.instagram.com/mobile._.moments_/';

  return (
    <aside aria-label="Quick contact links" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Instagram Floating Action Button */}
      <div className="relative group flex items-center">
        {/* Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
          Follow @mobile._.moments_
        </span>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-rose-500/40 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-300/50"
          aria-label="Follow us on Instagram @mobile._.moments_"
        >
          <svg
            className="w-6 h-6 fill-none stroke-current"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </a>
      </div>

      {/* WhatsApp Floating Action Button */}
      <div className="relative group flex items-center">
        {/* Pulse beacon glow */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-sm animate-pulse pointer-events-none" />

        {/* Tooltip */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
          Chat with Concierge
        </span>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] hover:shadow-emerald-600/50 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300/50"
          aria-label="Chat with Vana Resort Concierge on WhatsApp"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </aside>
  );
};
