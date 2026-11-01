import React from 'react';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/home/Hero.jsx';
import CongoMap from '../components/home/CongoMap.jsx';
import Features from '../components/sections/Features.jsx';
import { ImageReveal, Reveal, WordRise, useInView } from '../components/ui/Motion.jsx';
import { formatFCFA } from '../data/site.js';
import sanghaRiver from '../assets/photos/sangha-river.webp';
import sanghaMist from '../assets/photos/sangha-mist.webp';
import sanghaCanoe from '../assets/photos/sangha-canoe.webp';
import bridgePhoto from '../assets/photos/brazzaville-bridge-night.webp';
import discoveryPhoto from '../assets/photos/congo-discovery.jpg';
import oceanLogo from '../assets/brand/ocean-logo.png';
import oncCards from '../assets/photos/onc-cards.jpg';

const ROUTES = [
  { from: 'Brazzaville', to: 'Pointe-Noire', price: 9000 },
  { from: 'Brazzaville', to: 'Ouesso', price: 9000 },
  { from: 'Brazzaville', to: 'Oyo', price: 6000 },
  { from: 'Pointe-Noire', to: 'Sibiti', price: 10000 },
  { from: 'Brazzaville', to: 'Kéllé', price: 15000 },
];

function Network({ onNavigate, onExplore }) {
  const [routesRef, routesInView] = useInView({ threshold: 0.2 });
  return (
    <section id="reseau" className="border-b border-ink/10 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-14">
          <div className="lg:pt-4">
            <h2 className="font-serif text-[clamp(2.8rem,5.6vw,4.6rem)] font-normal leading-[0.9] tracking-[-0.03em] text-ink">
              Où allez-vous ?
            </h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted">
              Brazzaville, Pointe-Noire, la forêt, la savane. Choisissez une ville sur la carte ou
              partez d’une ligne déjà ouverte. Les tarifs sont affichés par trajet.
            </p>

            <div ref={routesRef} className={`route-list mt-8 ${routesInView ? 'is-visible' : ''}`}>
              {ROUTES.map((route, index) => (
                <button
                  key={`${route.from}-${route.to}`}
                  type="button"
                  onClick={() => onExplore({ origin: route.from, destination: route.to })}
                  style={{ '--route-row': index }}
                  className="route-row group flex w-full items-center justify-between gap-4 border-t border-ink/15 py-3.5 text-start transition-colors duration-150 hover:border-forest"
                >
                  <span className="flex min-w-0 flex-wrap items-center gap-2.5 text-[0.86rem] font-semibold tracking-[-0.02em] text-ink">
                    {route.from}
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-clay-deep transition-transform duration-150 group-hover:translate-x-1"
                    />
                    {route.to}
                  </span>
                  <span className="shrink-0 text-[0.72rem] font-semibold text-muted">{formatFCFA(route.price)}</span>
                </button>
              ))}
            </div>

            <button type="button" onClick={() => onNavigate('voyages')} className="link-arrow mt-6">
              Tous les horaires
            </button>
          </div>

          <CongoMap onSelectRoute={(city) => onExplore({ origin: city, destination: '' })} />
        </div>
      </div>
    </section>
  );
}

function Journal({ onExplore }) {
  return (
    <section id="carnets" className="border-b border-ink/10 bg-cream/55 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Ligne du nord</p>
            <h2 className="mt-3 max-w-xl font-serif text-[clamp(2.6rem,5vw,4.2rem)] font-normal leading-[0.92] tracking-[-0.03em] text-ink">
              <WordRise text="Ouesso," className="block" stagger={110} />
              <WordRise text="au bout de la route." className="block" stagger={110} delay={240} />
            </h2>
          </div>
          <div className="max-w-sm sm:pb-2">
            <p className="text-[0.9rem] leading-relaxed text-muted">
              Notre ligne la plus au nord part de Brazzaville à 07h00, tous les jours. Un seul
              billet, un horaire fixe. À Ouesso, la Sangha ouvre la forêt et les pirogues.
            </p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
              Pour la suite, passez en agence avant le départ. On vous oriente.
            </p>

            <div className="mt-4 border-t border-ink/15 pt-3">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] font-semibold text-ink">
                <span>Brazzaville</span>
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-clay-deep" />
                <span>Ouesso</span>
              </p>
              <p className="mt-1 text-[0.72rem] font-medium text-muted">
                07h00 · tous les jours · {formatFCFA(9000)} par passager
              </p>
              <button
                type="button"
                onClick={() => onExplore({ origin: 'Brazzaville', destination: 'Ouesso' })}
                className="link-arrow mt-3"
              >
                Voir les départs pour Ouesso
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-12">
          <figure className="md:col-span-7">
            <ImageReveal delay={0}>
              <div className="photo-frame aspect-[4/3] md:aspect-square">
                <img
                  src={sanghaRiver}
                  alt="La rivière Sangha bordée de forêt, dans le bassin du Congo"
                  width="1920"
                  height="1275"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </ImageReveal>
            <figcaption className="mt-2.5 flex items-start justify-between gap-4 text-[0.7rem] font-medium text-muted">
              <span className="min-w-0">La Sangha, dans le bassin du Congo</span>
              <span className="text-end text-muted">Photo : JosepMGracia / CC BY-SA 4.0</span>
            </figcaption>
          </figure>

          <div className="grid gap-4 md:col-span-5">
            <figure>
              <ImageReveal delay={110}>
                <div className="photo-frame aspect-[4/3]">
                  <img
                    src={sanghaMist}
                    alt="Brume du matin sur la Sangha, en amont d’Ouesso"
                    width="1920"
                    height="1275"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </ImageReveal>
              <figcaption className="mt-2.5 flex items-start justify-between gap-4 text-[0.7rem] font-medium text-muted">
                <span className="min-w-0">Brume sur la Sangha, en amont d’Ouesso</span>
                <span className="text-end text-muted">Photo : JosepMGracia / CC BY-SA 4.0</span>
              </figcaption>
            </figure>

            <figure>
              <ImageReveal delay={220}>
                <div className="photo-frame aspect-[4/3]">
                  <img
                    src={sanghaCanoe}
                    alt="Pirogue traditionnelle sur la Sangha, en amont d’Ouesso"
                    width="1920"
                    height="1275"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </ImageReveal>
              <figcaption className="mt-2.5 flex items-start justify-between gap-4 text-[0.7rem] font-medium text-muted">
                <span className="min-w-0">Pirogue sur la Sangha, en amont d’Ouesso</span>
                <span className="text-end text-muted">Photo : JosepMGracia / CC BY-SA 4.0</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function Campaign({ onNavigate }) {
  return (
    <section id="campagne" className="relative overflow-hidden border-b border-ink/10 bg-forest-deep py-16 text-cream sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border border-cream/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2 rounded-full border border-ochre/20"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-16">
          <ImageReveal className="min-w-0">
            <figure>
              <div className="photo-frame border-cream/15 bg-forest aspect-[16/10]">
                <img
                  src={discoveryPhoto}
                  alt="Visuel de la campagne Océan du Nord autour du voyage découverte au Congo"
                  width="1600"
                  height="958"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-[0.7rem] font-medium text-cream/60">
                <span>Voyage découverte · Visuel de campagne</span>
                <span className="text-end">Document Océan du Nord</span>
              </figcaption>
            </figure>
          </ImageReveal>

          <Reveal delay={120} className="min-w-0">
            <p className="eyebrow eyebrow-light">Voyage découverte</p>
            <h2 className="mt-4 text-balance font-serif text-[clamp(2.7rem,5vw,4.4rem)] font-normal leading-[0.9] tracking-[-0.035em]">
              Regardez
              <span className="block italic text-ochre-light">par la fenêtre.</span>
            </h2>
            <p className="mt-5 max-w-md text-[0.94rem] leading-relaxed text-cream/75">
              Un virage, un village, un bout de forêt. Sur nos lignes, le paysage change souvent.
              Choisissez un axe. On s’occupe du reste.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Brazzaville', 'Pointe-Noire', 'Oyo', 'Ouesso'].map((city) => (
                <span key={city} className="border border-cream/20 px-2.5 py-1 text-[0.72rem] font-semibold text-cream/80">
                  {city}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <button type="button" onClick={() => onNavigate('voyages')} className="btn-light self-start">
                Préparer un départ
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              <div className="inline-flex w-fit items-center border border-cream/15 bg-white px-3 py-2">
                <img
                  src={oceanLogo}
                  alt="Océan du Nord — Sécurité, confort, fiabilité"
                  width="1461"
                  height="426"
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-auto sm:h-10"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Compagnie({ onNavigate }) {
  return (
    <section id="compagnie" className="border-b border-ink/10 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:items-center lg:gap-16">
          <ImageReveal className="min-w-0">
            <figure>
              <div className="photo-frame aspect-[16/10]">
                <img
                  src={oncCards}
                  alt="Cartes de fidélité ONC Standard, Silver et Gold"
                  width="1600"
                  height="960"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-[0.7rem] font-medium text-muted">
                <span>Cartes ONC Standard, Silver et Gold</span>
                <span className="text-end">Document Océan du Nord</span>
              </figcaption>
            </figure>
          </ImageReveal>

          <Reveal delay={110} className="min-w-0">
            <p className="eyebrow">La compagnie</p>
            <h2 className="mt-4 text-balance font-serif text-[clamp(2.7rem,5vw,4.2rem)] font-normal leading-[0.9] tracking-[-0.035em] text-ink">
              La route,
              <span className="block italic text-forest">on la connaît.</span>
            </h2>
            <p className="mt-5 max-w-md text-[0.94rem] leading-relaxed text-muted">
              Notre siège est à Brazzaville. Nos bus partent vers le nord forestier, descendent à
              Pointe-Noire et s’arrêtent dans huit agences.
            </p>
            <p className="mt-3 max-w-md text-[0.94rem] leading-relaxed text-muted">
              Derrière les horaires, il y a des chauffeurs, des agents et des colis qu’on retrouve.
            </p>

            <div className="mt-6 inline-flex w-fit items-center border border-ink/15 bg-cream px-3 py-2">
              <img
                src={oceanLogo}
                alt="Océan du Nord — Sécurité, confort, fiabilité"
                width="1461"
                height="426"
                loading="lazy"
                decoding="async"
                className="h-8 w-auto sm:h-9"
              />
            </div>

            <button type="button" onClick={() => onNavigate('agences')} className="link-arrow mt-6">
              Voir les agences
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview({ onNavigate }) {
  return (
    <section className="border-b border-ink/10 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-[clamp(2.6rem,5vw,4.2rem)] font-normal leading-[0.92] tracking-[-0.03em] text-ink">
              <WordRise text="Vous voyagez," className="block" stagger={90} />
              <WordRise text="ou vous expédiez." className="block" stagger={90} delay={220} />
            </h2>
          </div>
          <button type="button" onClick={() => onNavigate('services')} className="link-arrow self-start sm:self-auto sm:pb-2">
            Voir les services
          </button>
        </div>

        <div className="mt-10">
          <Features onNavigate={onNavigate} />
        </div>
      </div>
    </section>
  );
}

function Closing({ onNavigate }) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-cream">
      <img
        src={bridgePhoto}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        loading="lazy"
        decoding="async"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-forest-deep/75" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-serif text-[clamp(2.8rem,6vw,5.2rem)] font-normal leading-[0.88] tracking-[-0.035em]">
            <WordRise text="Passez" className="block" stagger={90} />
            <WordRise text="nous voir." className="block" stagger={90} delay={340} />
          </h2>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-cream/75">
            Un billet à prendre, un colis à déposer, un horaire à vérifier. Nos agences ouvrent du
            lundi au samedi, de Brazzaville à Pointe-Noire.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <button type="button" onClick={() => onNavigate('voyages')} className="btn-light">
            Réserver un trajet
          </button>
          <a
            href="tel:+242065874460"
            className="inline-flex items-center justify-center rounded-[2px] border border-cream/30 px-6 py-3 text-[0.8rem] font-semibold text-cream transition-colors duration-150 hover:bg-cream hover:text-forest"
          >
            +242 06 587 44 60
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home({ onNavigate, onExplore }) {
  return (
    <>
      <Hero onNavigate={onNavigate} onExplore={onExplore} />
      <Network onNavigate={onNavigate} onExplore={onExplore} />
      <Journal onExplore={onExplore} />
      <Campaign onNavigate={onNavigate} />
      <Compagnie onNavigate={onNavigate} />
      <ServicesPreview onNavigate={onNavigate} />
      <Closing onNavigate={onNavigate} />
    </>
  );
}
