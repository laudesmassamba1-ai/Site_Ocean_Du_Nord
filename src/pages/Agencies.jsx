import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import { AGENCIES } from '../data/site.js';
import basilicaPhoto from '../assets/photos/brazzaville-basilica.webp';

const FILTERS = ['Tous', 'Nord', 'Sud'];

export default function Agencies() {
  const [axis, setAxis] = useState('Tous');
  const visible = AGENCIES.filter((agency) => axis === 'Tous' || agency.axis === axis);

  return (
    <section className="pb-20 pt-36 sm:pt-44 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <PageHeader
          title="Trouver"
          accent="une agence."
          description="Huit agences, du nord au sud. Vous pouvez y prendre un billet, déposer un colis ou demander un horaire. Le téléphone marche aussi."
          image={basilicaPhoto}
          imageAlt="Basilique Sainte-Anne-du-Congo à Brazzaville"
          imageCredit="Henri van der Noot / CC BY-SA 4.0"
        />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAxis(item)}
              aria-pressed={axis === item}
              className={`chip ${axis === item ? 'chip-active' : ''}`}
            >
              {item === 'Tous' ? 'Toutes les agences' : `Axe ${item}`}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.72rem] font-medium text-muted">
          {visible.length} agences
        </p>

        <div key={axis} className="filter-grid mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((agency, index) => (
            <article
              key={agency.name}
              style={{ '--card-index': index }}
              className="card-index group border-t border-ink/20 pt-5 transition-colors duration-150 hover:border-ink"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 break-words font-serif text-[1.7rem] font-normal leading-[1.02] tracking-[-0.02em] text-ink">{agency.name}</h3>
                <span className="shrink-0 text-[0.7rem] font-semibold text-clay-deep">
                  {agency.axis}
                </span>
              </div>

              <p className="mt-3 flex-1 text-[0.84rem] leading-relaxed text-muted">{agency.address}</p>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-ink/10 pt-3">
                {agency.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    aria-label={`Appeler l’agence ${agency.name} au ${phone}`}
                    className="text-[0.76rem] font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors hover:text-clay-deep hover:decoration-clay-deep"
                  >
                    {phone.replace(/^00242/, '+242 ')}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-y border-ink/15 bg-cream px-6 py-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[0.72rem] font-semibold text-muted">Besoin d’aide ?</p>
            <p className="mt-1.5 text-[0.95rem] font-semibold tracking-[-0.02em] text-ink">
              La direction générale est à Brazzaville. Appelez, on vous oriente.
            </p>
          </div>
          <a href="tel:00242065874460" className="btn-primary shrink-0">
            +242 06 587 44 60
          </a>
        </div>
      </div>
    </section>
  );
}
