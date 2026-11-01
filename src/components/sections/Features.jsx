import React from 'react';
import { ArrowRight, Bus, Mail, Package, Route } from 'lucide-react';

const ICONS = { letter: Mail, box: Package, route: Route, bus: Bus };

function FeatureIcon({ type }) {
  const Icon = ICONS[type] ?? Mail;
  return <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />;
}

const SERVICES = [
  {
    icon: 'letter',
    title: 'Courrier',
    text: 'Un pli à envoyer ? Nous le remettons d’agence en agence, sur tout le réseau.',
    href: 'agences',
    link: 'Trouver une agence',
  },
  {
    icon: 'box',
    title: 'Fret & colis',
    text: 'Un carton à expédier. Vous le déposez. Nous le suivons jusqu’à l’arrivée.',
    href: 'services',
    link: 'Suivre un colis',
  },
  {
    icon: 'route',
    title: 'Axes réguliers',
    text: 'Le nord forestier, les villes du sud. Prenez la ligne qui vous arrange.',
    href: 'voyages',
    link: 'Explorer les lignes',
  },
  {
    icon: 'bus',
    title: 'Location de bus',
    text: 'Un groupe, un événement, un déplacement particulier ? On organise le trajet avec vous.',
    href: 'agences',
    link: 'Parler à une agence',
  },
];

export default function Features({ onNavigate }) {
  return (
    <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map((service) => (
        <button
          type="button"
          key={service.title}
          onClick={() => onNavigate(service.href)}
          className="service-tile group text-start"
        >
          <span className="service-icon flex h-10 w-10 items-center justify-center rounded-[2px] border border-ink/20 text-ink transition-colors duration-150">
            <FeatureIcon type={service.icon} />
          </span>

          <span className="mt-7 block">
            <strong className="block text-[1.18rem] font-bold tracking-[-0.03em] text-ink">{service.title}</strong>
            <span className="mt-2 block text-[0.86rem] leading-relaxed text-muted">{service.text}</span>
          </span>

          <span className="mt-5 inline-flex items-center gap-1.5 border-b border-clay-deep/35 pb-0.5 text-[0.78rem] font-semibold text-clay-deep transition-colors duration-150 group-hover:border-clay-deep">
            {service.link}
            <ArrowRight aria-hidden="true" className="tile-arrow h-3.5 w-3.5" />
          </span>
        </button>
      ))}
    </div>
  );
}
