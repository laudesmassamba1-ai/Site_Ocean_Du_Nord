import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import ElectronicTicket from '../components/ticket/ElectronicTicket.jsx';
import TicketActions from '../components/ticket/TicketActions.jsx';
import { ImageReveal } from '../components/ui/Motion.jsx';
import riverPhoto from '../assets/photos/congo-river-kinshasa.webp';

function EmptyTicket({ onNavigate }) {
  return (
    <div className="relative overflow-hidden bg-forest-deep px-6 py-10 text-cream sm:px-8 sm:py-14">
      <svg aria-hidden="true" viewBox="0 0 400 200" className="pointer-events-none absolute inset-0 h-full w-full text-cream opacity-[0.12]" fill="none">
        {[0, 1, 2, 3, 4].map((index) => (
          <path key={index} d={`M-20 ${50 + index * 26} C 70 ${10 + index * 26}, 150 ${110 + index * 26}, 230 ${50 + index * 26} S 360 ${0 + index * 26}, 430 ${60 + index * 26}`} stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>
      <div className="relative max-w-md">
        <p className="text-[0.72rem] font-semibold text-cream/65">Aucun billet sélectionné</p>
        <p className="mt-4 text-balance font-serif text-[2.35rem] font-normal leading-[0.95] tracking-[-0.025em] sm:text-[2.7rem]">
          Aucun billet
          <span className="block italic">pour l’instant.</span>
        </p>
        <p className="mt-4 text-[0.82rem] leading-relaxed text-cream/65">
          Choisissez une ville de départ. Le billet, le QR code et le PDF apparaîtront ici.
        </p>
        <button type="button" onClick={() => onNavigate('voyages')} className="btn-light mt-6">
          Choisir un voyage
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function TicketSpace({ tickets, onRemoveTicket, onNavigate }) {
  const [selectedRef, setSelectedRef] = useState(() => tickets[0]?.reference || null);
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const selected = useMemo(
    () => tickets.find((ticket) => ticket.reference === selectedRef) || null,
    [tickets, selectedRef],
  );

  useEffect(() => {
    if (tickets.some((ticket) => ticket.reference === selectedRef)) return;
    setSelectedRef(tickets[0]?.reference || null);
  }, [tickets, selectedRef]);

  function handleSearch(event) {
    event.preventDefault();
    setError('');
    const wanted = reference.trim().toUpperCase();
    const found = tickets.find((ticket) => ticket.reference.toUpperCase() === wanted);

    if (!found) {
      setError('Aucun billet avec cette référence sur cet appareil.');
      return;
    }

    const enteredPhone = phone.replace(/\D/g, '');
    const storedPhone = String(found.phone || '').replace(/\D/g, '');

    if (enteredPhone && enteredPhone.length < 6) {
      setError('Entrez un numéro complet, ou laissez le champ téléphone vide.');
      return;
    }

    const phoneMatches =
      !enteredPhone ||
      (Boolean(storedPhone) &&
        (storedPhone.endsWith(enteredPhone) || enteredPhone.endsWith(storedPhone)));

    if (!phoneMatches) {
      setError('La référence existe, mais le téléphone ne correspond pas.');
      return;
    }

    setSelectedRef(found.reference);
    setReference('');
    setPhone('');
    document.getElementById('ticket-view')?.scrollIntoView({ block: 'start' });
  }

  function handleRemove(ticket) {
    onRemoveTicket(ticket.reference);
  }

  return (
    <section className="pb-20 pt-36 sm:pt-44 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-6 border-b border-ink/15 pb-6 sm:pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow">Billet électronique</p>
              <p className="text-[0.72rem] font-medium text-muted lg:hidden">
                {tickets.length} {tickets.length === 1 ? 'billet enregistré' : 'billets enregistrés'}
              </p>
            </div>
            <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.8rem] font-normal leading-[0.92] tracking-[-0.03em] text-ink sm:text-[3.9rem]">
              Vos billets
              <span className="block italic text-forest">restent ici.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[0.9rem] leading-relaxed text-muted">
              Ils sont enregistrés dans ce navigateur. Ouvrez-en un, montrez le QR code au départ,
              ou gardez le PDF.
            </p>
            <button
              type="button"
              onClick={() =>
                document.getElementById('retrouver')?.scrollIntoView({ block: 'start' })
              }
              className="link-arrow mt-3 lg:hidden"
            >
              Retrouver un billet
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden border-s-2 border-clay/60 ps-4 lg:block">
            <p className="text-[0.72rem] font-medium text-muted">Billets enregistrés</p>
            <p className="mt-1 font-serif text-[2.7rem] leading-none text-ink">
              {tickets.length}
            </p>
            <p className="mt-1 text-[0.74rem] font-medium text-muted">Sur cet appareil uniquement</p>
          </div>
        </div>

        <ImageReveal delay={80} className="mt-6">
          <figure>
            <div className="photo-frame aspect-[16/6] max-h-[220px] sm:aspect-[21/6]">
              <img
                src={riverPhoto}
                alt="Le fleuve Congo et Kinshasa vus depuis Brazzaville"
                width="1920"
                height="1440"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-[0.7rem] font-medium text-muted">
              <span>Le fleuve Congo, face à Kinshasa</span>
              <span className="text-end">Photo : Marcel1977 / CC BY-SA 3.0</span>
            </figcaption>
          </figure>
        </ImageReveal>

        <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1.28fr)_minmax(0,0.72fr)] lg:items-start">
          <div id="ticket-view" className="min-w-0">
            {selected ? (
              <>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Billet sélectionné</p>
                    <p className="mt-1 text-[0.74rem] font-medium text-muted">Enregistré sur cet appareil</p>
                  </div>
                  <span className="hidden text-[0.72rem] font-medium text-muted sm:block">
                    {selected.from} <ArrowRight aria-hidden="true" className="inline h-3 w-3" /> {selected.to}
                  </span>
                </div>

                <ElectronicTicket key={selected.reference} ticket={selected} className="ticket-swap" />

                <TicketActions
                  ticket={selected}
                  onSecondary={() => onNavigate('voyages')}
                  secondaryLabel="Réserver un voyage"
                  onRemove={() => handleRemove(selected)}
                />

                <div className="mt-6 grid gap-4 border-t border-ink/10 pt-4 text-[0.74rem] leading-relaxed text-muted sm:grid-cols-2">
                  <p>
                    <span className="font-semibold text-ink">Le QR code</span> reprend la référence, le trajet,
                    la date et le passager. Il n’est relié à aucun serveur de validation.
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Le PDF</span> est généré dans votre navigateur.
                    Aucune donnée n’est envoyée à la compagnie.
                  </p>
                </div>
              </>
            ) : (
              <EmptyTicket onNavigate={onNavigate} />
            )}
          </div>
          <aside className="min-w-0">
            <form
              id="retrouver"
              onSubmit={handleSearch}
              className="border border-ink/15 bg-cream p-5"
            >
              <p className="text-[0.74rem] font-semibold text-clay-deep">Retrouver un billet</p>
              <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">
                Saisissez la référence du billet et le téléphone utilisé lors de la réservation.
              </p>

              <label className="mt-4 grid gap-1.5">
                <span className="text-[0.72rem] font-semibold text-muted">Référence</span>
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="ONC-XXXX"
                  autoComplete="off"
                  required
                  className="field font-mono uppercase"
                />
              </label>

              <label className="mt-3 grid gap-1.5">
                <span className="text-[0.72rem] font-semibold text-muted">
                  Téléphone <span className="font-normal text-muted">(facultatif)</span>
                </span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+242 06 000 00 00"
                  autoComplete="tel"
                  className="field"
                />
              </label>

              <button type="submit" className="btn-primary mt-4 w-full py-3">
                Afficher mon billet
              </button>

              {error && (
                <p role="alert" className="mt-3 text-[0.72rem] leading-relaxed text-clay-deep">
                  {error}
                </p>
              )}

              <p className="mt-4 border-t border-ink/10 pt-3 text-[0.7rem] leading-relaxed text-muted">
                Démonstration : les billets restent dans ce navigateur et ne sont pas valables pour voyager.
              </p>
            </form>

            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[0.72rem] font-medium text-muted">
                  Billets enregistrés
                </p>
                <span className="text-[0.68rem] font-semibold text-muted">{tickets.length}</span>
              </div>

              <div className="mt-3 border-b border-ink/15">
                {tickets.length ? (
                  tickets.map((ticket) => {
                    const active = selected?.reference === ticket.reference;
                    return (
                      <button
                        key={ticket.reference}
                        type="button"
                        onClick={() => {
                          setSelectedRef(ticket.reference);
                          if (window.matchMedia('(max-width: 1023px)').matches) {
                            document
                              .getElementById('ticket-view')
                              ?.scrollIntoView({ block: 'start' });
                          }
                        }}
                        aria-current={active ? 'true' : undefined}
                        className={`block w-full border-t px-3 py-3 text-start transition-colors duration-150 ${
                          active
                            ? 'border-s-2 border-clay bg-cream'
                            : 'border-ink/15 hover:border-ink hover:bg-cream/60'
                        }`}
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 break-words font-sans text-[1.05rem] font-semibold leading-tight text-ink">
                            {ticket.from} <ArrowRight aria-hidden="true" className="inline h-3.5 w-3.5 text-clay-deep" /> {ticket.to}
                          </span>
                          <span className="shrink-0 font-mono text-[0.62rem] font-semibold tracking-[0.06em] text-muted">
                            {ticket.reference}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-[0.7rem] font-medium text-muted">
                          {ticket.date}, {ticket.time}, {ticket.name}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="border-t border-ink/15 py-5 text-[0.74rem] leading-relaxed text-muted">
                    Aucun billet pour l’instant. Votre prochaine réservation apparaîtra ici automatiquement.
                  </p>
                )}
              </div>
            </div>
          </aside>


        </div>
      </div>
    </section>
  );
}
