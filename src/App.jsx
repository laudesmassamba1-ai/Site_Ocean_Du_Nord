import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import Navbar from './components/layout/Navbar.jsx';
import oceanLogo from './assets/brand/ocean-logo.png';
import Home from './pages/Home.jsx';
import Voyages from './pages/Voyages.jsx';
import Services from './pages/Services.jsx';
import Agencies from './pages/Agencies.jsx';
import Loyalty from './pages/Loyalty.jsx';
import TicketSpace from './pages/TicketSpace.jsx';
import { ScrollProgress } from './components/ui/Motion.jsx';
import { safeLoadLoyalty } from './data/site.js';
import { safeLoadTickets, saveTickets } from './data/tickets.js';

const FOOTER_LINKS = [
  ['voyages', 'Voyages'],
  ['billet', 'Mon billet'],
  ['services', 'Services'],
  ['agences', 'Agences'],
  ['fidelite', 'Fidélité'],
];

function Footer({ onNavigate }) {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 border-b border-cream/15 pb-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)]">
          <div>
            <button
              type="button"
              onClick={() => onNavigate('accueil')}
              aria-label="Océan du Nord — accueil"
              className="inline-flex w-fit items-center rounded-[2px] bg-cream px-3 py-2"
            >
              <img
                src={oceanLogo}
                alt="Océan du Nord — Sécurité, confort, fiabilité"
                width="1461"
                height="426"
                loading="lazy"
                decoding="async"
                className="h-9 w-auto sm:h-10"
              />
            </button>
            <p className="mt-3 max-w-xs text-[0.8rem] leading-relaxed text-cream/65">
              Avenue de l’OUA, Brazzaville. Nos agences vont du nord à Pointe-Noire.
            </p>
          </div>

          <div>
            <p className="text-[0.74rem] font-semibold text-ochre">Navigation</p>
            <div className="mt-3 grid gap-2">
              {FOOTER_LINKS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="w-fit text-[0.82rem] font-medium text-cream/75 transition-colors hover:text-cream"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.74rem] font-semibold text-ochre">Contact</p>
            <a href="tel:+242065874460" className="mt-3 block text-[0.86rem] font-semibold text-cream/85 hover:text-cream">
              +242 06 587 44 60
            </a>
            <a
              href="mailto:contact@oceandunord.com"
              className="mt-1 block break-words text-[0.82rem] text-cream/65 hover:text-cream"
            >
              contact@oceandunord.com
            </a>
            <p className="mt-3 text-[0.72rem] leading-relaxed text-cream/65">Lun – Sam, 07h – 18h</p>
          </div>
        </div>

        <div className="grid gap-5 pt-6 md:grid-cols-2 md:items-end">
          <p className="max-w-xl text-[0.7rem] leading-relaxed text-cream/65">
            Prototype non officiel : tarifs, horaires, réservations, paiements, suivi de colis et points ONC
            sont simulés. Les billets générés ici restent dans votre navigateur et ne sont pas valables pour
            voyager.
          </p>
          <p className="text-[0.68rem] leading-relaxed text-cream/65 md:text-end">
            Photographies : Africany (CC0), Marcel1977 (CC BY-SA 3.0), Henri van der Noot (CC BY-SA 4.0),
            Allen Chouyy (CC BY-SA 4.0), JosepMGracia (CC BY-SA 4.0), Bokoba veroly (CC BY-SA 4.0) —
            Wikimedia Commons. Vidéo :
            « Ocean surface waves », Mostafameraji (CC0) — Wikimedia Commons. Visuels de campagne et
            cartes ONC : documents Océan du Nord. Fond de carte : Natural Earth (domaine public).
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [prefill, setPrefill] = useState(null);
  const [loyalty, setLoyalty] = useState(safeLoadLoyalty);
  const [tickets, setTickets] = useState(safeLoadTickets);

  useEffect(() => {
    try {
      localStorage.setItem('onc-demo', JSON.stringify(loyalty));
    } catch {
      /* Stockage indisponible : la démonstration reste utilisable en mémoire. */
    }
  }, [loyalty]);

  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  function runTransition(update) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compact = window.matchMedia('(max-width: 639px)').matches;
    if (!reduced && !compact && typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => flushSync(update));
      return;
    }
    update();
  }

  function navigate(tab) {
    runTransition(() => {
      setPrefill(null);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  function explore(prefillValue) {
    runTransition(() => {
      setPrefill(prefillValue);
      setActiveTab('voyages');
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  function addPoints(points) {
    setLoyalty((current) => ({ ...current, points: current.points + points }));
  }

  function addTicket(ticket) {
    setTickets((current) => [ticket, ...current.filter((item) => item.reference !== ticket.reference)].slice(0, 30));
  }

  function removeTicket(reference) {
    setTickets((current) => current.filter((ticket) => ticket.reference !== reference));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <ScrollProgress />
      <Navbar activeTab={activeTab} onNavigate={navigate} ticketCount={tickets.length} />

      <main
        id="contenu"
        tabIndex={-1}
        key={activeTab}
        className="page-enter flex-1 pt-[env(safe-area-inset-top)] focus:outline-none"
      >
        {activeTab === 'accueil' && <Home onNavigate={navigate} onExplore={explore} />}
        {activeTab === 'voyages' && (
          <Voyages
            prefill={prefill}
            onAddPoints={addPoints}
            onSaveTicket={addTicket}
            onOpenTickets={() => navigate('billet')}
          />
        )}
        {activeTab === 'billet' && (
          <TicketSpace tickets={tickets} onRemoveTicket={removeTicket} onNavigate={navigate} />
        )}
        {activeTab === 'services' && <Services onNavigate={navigate} />}
        {activeTab === 'agences' && <Agencies />}
        {activeTab === 'fidelite' && <Loyalty loyalty={loyalty} setLoyalty={setLoyalty} />}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
