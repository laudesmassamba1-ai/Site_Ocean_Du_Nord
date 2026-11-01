import React from 'react';
import PageHeader from '../components/layout/PageHeader.jsx';
import { AnimatedNumber, ImageReveal, Reveal, TiltCard } from '../components/ui/Motion.jsx';
import { TIERS } from '../data/site.js';
import aerialPhoto from '../assets/photos/brazzaville-aerial.webp';
import bridgePhoto from '../assets/photos/brazzaville-bridge-night.webp';
import oncCards from '../assets/photos/onc-cards.jpg';

function WavePattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 200"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]"
      fill="none"
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          d={`M-20 ${60 + index * 26} C 60 ${20 + index * 26}, 140 ${110 + index * 26}, 220 ${60 + index * 26} S 360 ${10 + index * 26}, 430 ${70 + index * 26}`}
          stroke="#fcfaf5"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default function Loyalty({ loyalty, setLoyalty }) {
  const currentIndex = TIERS.reduce((index, item, current) => (loyalty.points >= item[1] ? current : index), 0);
  const tier = TIERS[currentIndex];
  const nextTier = TIERS[currentIndex + 1];
  const progress = nextTier
    ? Math.min(100, Math.round(((loyalty.points - tier[1]) / (nextTier[1] - tier[1])) * 100))
    : 100;

  function updateName(event) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('member-name').trim();
    setLoyalty((current) => ({ ...current, name: value }));
  }

  return (
    <section className="pb-20 pt-36 sm:pt-44 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <PageHeader
          title="Votre carte"
          accent="ONC."
          description="Prenez le bus, cumulez des points. Cette carte est une démonstration locale : les points ne sont pas officiels."
          image={aerialPhoto}
          imageAlt="Vue aérienne de Brazzaville"
          imageCredit="Africany / CC0"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <TiltCard className="relative overflow-hidden bg-forest-deep p-7 text-cream sm:p-9">
            <img
              src={bridgePhoto}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
              loading="lazy"
              decoding="async"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-forest-deep/90 via-forest-deep/80 to-forest/70" />
            <WavePattern />

            <div className="relative flex flex-col items-start gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-cream/65">Océan du Nord</p>
                <p className="mt-1 font-serif text-[1.6rem] italic leading-none text-cream">carte de démonstration</p>
              </div>
              <span className="shrink-0 border border-cream/25 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-cream/85">
                {tier[0]}
              </span>
            </div>

            <div className="relative mt-14 sm:mt-20">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-cream/65">Solde</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-[3.4rem] font-bold leading-none tracking-[-0.05em]">
                  <AnimatedNumber value={loyalty.points} />
                </span>
                <span className="text-[0.82rem] font-medium text-cream/65">points</span>
              </p>
            </div>

            <div className="relative mt-10 border-t border-cream/15 pt-5">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-cream/65">Titulaire</p>
              <p className="mt-1 text-[0.9rem] font-semibold tracking-tight text-cream/90">
                {loyalty.name || 'Votre nom ici'}
              </p>
            </div>
          </TiltCard>

          <div className="flex flex-col gap-6">
            <div className="border border-ink/15 bg-cream p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[0.74rem] font-semibold text-muted">Progression</p>
                <p className="text-[0.76rem] font-semibold text-clay-deep">{progress}%</p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden bg-ink/[0.08]">
                <div className="progress-fill h-full" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-[0.8rem] font-medium text-muted">
                Palier <span className="font-semibold text-ink">{tier[0]}</span>
                {nextTier
                  ? `, encore ${Math.max(0, nextTier[1] - loyalty.points)} points pour ${nextTier[0]}`
                  : ', maximum atteint'}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {TIERS.map(([name, threshold], index) => (
                  <div
                    key={name}
                    className={`flex items-center justify-between border px-2.5 py-2.5 transition-colors sm:block sm:text-center ${
                      index <= currentIndex
                        ? 'border-forest/30 bg-forest/[0.06] text-forest'
                        : 'border-ink/10 bg-paper/50 text-muted'
                    }`}
                  >
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em]">{name.split(' · ')[0]}</p>
                    <p className="mt-0.5 text-[0.68rem] font-medium">{threshold} pts</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={updateName} className="border border-ink/15 bg-cream p-6">
              <label htmlFor="member-name" className="text-[0.74rem] font-semibold text-muted">
                Personnaliser la carte
              </label>
              <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="member-name"
                  name="member-name"
                  placeholder="Nom et prénoms"
                  defaultValue={loyalty.name}
                  required
                  autoComplete="name"
                  className="field"
                />
                <button type="submit" className="btn-primary shrink-0 px-5 py-3 text-[0.76rem]">
                  Enregistrer
                </button>
              </div>
              <p className="mt-3 text-[0.7rem] leading-relaxed text-muted">
                Démonstration locale enregistrée sur cet appareil uniquement.
              </p>
            </form>
          </div>
        </div>

        <Reveal delay={80} className="mt-6">
          <figure className="border border-ink/15 bg-cream p-4 sm:p-5">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:gap-8">
              <ImageReveal className="min-w-0">
                <div className="photo-frame aspect-[16/10]">
                  <img
                    src={oncCards}
                    alt="Visuel officiel des cartes de fidélité ONC Standard, Silver et Gold"
                    width="1600"
                    height="960"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </ImageReveal>
              <div className="min-w-0">
                <p className="eyebrow">Le programme ONC</p>
                <h2 className="mt-3 text-balance font-serif text-[2rem] leading-[0.95] tracking-[-0.025em] text-ink sm:text-[2.35rem]">
                  Standard, Silver, Gold.
                </h2>
                <p className="mt-4 max-w-md text-[0.86rem] leading-relaxed text-muted">
                  Le visuel présente les trois niveaux. Ici, la carte reste une démo. Pas de compte
                  client, pas de points officiels.
                </p>
                <p className="mt-4 text-[0.7rem] font-medium text-muted">
                  Visuel officiel des cartes ONC · Document Océan du Nord
                </p>
              </div>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
