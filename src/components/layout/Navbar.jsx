import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import oceanLogo from '../../assets/brand/ocean-logo-alpha.png';

const ITEMS = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'voyages', label: 'Voyages' },
  { id: 'billet', label: 'Billet' },
  { id: 'services', label: 'Services' },
  { id: 'agences', label: 'Agences' },
  { id: 'fidelite', label: 'Fidélité' },
];

export default function Navbar({ activeTab, onNavigate, ticketCount = 0 }) {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const active = navRef.current?.querySelector('[aria-current="page"]');
    active?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [activeTab]);

  useEffect(() => {
    if (!window.matchMedia('(min-width: 640px)').matches) return undefined;
    let current = window.scrollY > 8;
    setScrolled(current);
    const update = () => {
      const next = window.scrollY > 8;
      if (next === current) return;
      current = next;
      setScrolled(next);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-paper pt-[env(safe-area-inset-top)] transition-[border-color,box-shadow] duration-300 sm:bg-paper/95 sm:backdrop-blur-md ${
        scrolled ? 'border-ink/15 shadow-soft' : 'border-ink/10'
      }`}
    >
      <div className="hidden border-b border-cream/10 bg-forest-deep text-cream sm:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-1.5 text-[0.68rem] font-medium">
          <span>Brazzaville, République du Congo</span>
          <span className="text-cream/70">Lun – Sam, 07h – 18h, +242 06 587 44 60</span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-0 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('accueil')}
          className="flex shrink-0 items-center gap-2.5 text-start"
          aria-label="Océan du Nord — accueil"
        >
          <img
            src={oceanLogo}
            alt="Océan du Nord — Sécurité, confort, fiabilité"
            width="1461"
            height="426"
            decoding="async"
            className="h-8 w-auto sm:h-9"
          />
        </button>

        <nav
          ref={navRef}
          aria-label="Navigation principale"
          className="scrollbar-none order-3 mt-3 flex w-full items-center justify-between gap-0 overflow-x-auto border-t border-ink/10 px-0 pt-2.5 sm:justify-center sm:gap-8 lg:order-none lg:mt-0 lg:w-auto lg:flex-1 lg:gap-7 lg:overflow-visible lg:border-0 lg:pt-0"
        >
          {ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                aria-label={
                  item.id === 'billet' && ticketCount
                    ? `Billet, ${ticketCount} enregistré${ticketCount > 1 ? 's' : ''}`
                    : undefined
                }
                className={`nav-link shrink-0 whitespace-nowrap py-1.5 text-[0.75rem] font-semibold tracking-[-0.01em] transition-colors duration-200 sm:text-[0.82rem] lg:py-0 lg:pb-1 ${
                  active ? 'is-active text-ink' : 'text-muted hover:text-forest-deep'
                }`}
              >
                {item.label}
                {item.id === 'billet' && ticketCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="badge-pop ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded-[2px] bg-ochre px-1 align-middle text-[0.6rem] font-bold leading-none text-forest-deep"
                  >
                    {ticketCount > 9 ? '9+' : ticketCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => onNavigate('voyages')}
          className="group ms-auto inline-flex shrink-0 items-center gap-1.5 rounded-[2px] bg-forest-deep px-3.5 py-2.5 text-[0.78rem] font-semibold text-cream transition-colors duration-200 hover:bg-ink sm:px-4 sm:text-[0.8rem]"
        >
          Réserver
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </header>
  );
}
