import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import ElectronicTicket from '../components/ticket/ElectronicTicket.jsx';
import TicketActions from '../components/ticket/TicketActions.jsx';
import {
  CITY_NAMES,
  DAYS,
  TRIPS,
  formatFCFA,
  makeReference,
  todayISO,
} from '../data/site.js';
import cornichePhoto from '../assets/photos/brazzaville-corniche.webp';

function RouteArrow() {
  return <ArrowRight aria-hidden="true" className="inline h-4 w-4 text-clay-deep" />;
}

export default function Voyages({ prefill, onAddPoints, onSaveTicket, onOpenTickets }) {
  const [origin, setOrigin] = useState(prefill?.origin || '');
  const [destination, setDestination] = useState(prefill?.destination || '');
  const [date, setDate] = useState(todayISO);
  const [passengers, setPassengers] = useState(1);
  const [booking, setBooking] = useState(null);
  const [ticket, setTicket] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!prefill) return;
    setOrigin(prefill.origin || '');
    setDestination(prefill.destination || '');
  }, [prefill]);

  const travelDate = useMemo(() => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }, [date]);

  const matchingTrips = useMemo(
    () =>
      TRIPS.filter((trip) => {
        if (origin && origin === destination) return false;
        return (
          (!origin || origin === trip.from || origin === trip.to) &&
          (!destination || destination === trip.from || destination === trip.to)
        );
      }),
    [origin, destination],
  );

  const isDialogOpen = Boolean(booking || ticket);

  useEffect(() => {
    if (!isDialogOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setBooking(null);
        setTicket(null);
        return;
      }

      if (event.key !== 'Tab') return;

      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return;
      const focusable = [...dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('dialog-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('dialog-open');
    };
  }, [isDialogOpen]);

  useEffect(() => {
    if (isDialogOpen) {
      closeButtonRef.current?.focus();
      return;
    }

    const trigger = triggerRef.current;
    triggerRef.current = null;
    trigger?.focus();
  }, [isDialogOpen, ticket]);

  function openBooking(trip, trigger) {
    triggerRef.current = trigger || null;
    setBooking({ trip, name: '', phone: '', time: trip.hours[0], payment: 'Mobile Money' });
    setTicket(null);
  }

  function confirmBooking(event) {
    event.preventDefault();
    if (!booking) return;
    const total = booking.trip.price * Number(passengers);
    const newTicket = {
      reference: makeReference(),
      name: booking.name.trim(),
      phone: booking.phone.trim(),
      passengers: Number(passengers),
      from: booking.trip.from,
      to: booking.trip.to,
      date: travelDate.toLocaleDateString('fr-FR'),
      dateISO: date,
      time: booking.time,
      payment: booking.payment,
      total,
      createdAt: new Date().toISOString(),
    };
    onAddPoints(Math.round(total / 100));
    onSaveTicket(newTicket);
    setBooking(null);
    setTicket(newTicket);
  }

  function closeDialog() {
    setBooking(null);
    setTicket(null);
  }

  return (
    <section className="pb-20 pt-36 sm:pt-44 lg:pt-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <PageHeader
          title="Votre prochain"
          accent="départ."
          description="Les tarifs viennent du site d’origine. Un doute sur un horaire ou une place ? Appelez l’agence avant de partir."
          image={cornichePhoto}
          imageAlt="La corniche de Bacongo, à Brazzaville, le long du fleuve Congo"
          imageCredit="Bokoba veroly / CC BY-SA 4.0"
        />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="filter-grid mt-9 border-y border-ink/15 bg-cream px-3 py-4 sm:px-4"
        >
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
            <label className="grid gap-1.5 px-2 pb-1 pt-1">
              <span className="text-[0.72rem] font-semibold text-muted">De</span>
              <select value={origin} onChange={(event) => setOrigin(event.target.value)} className="field">
                <option value="">Ville de départ</option>
                {CITY_NAMES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>

            <span aria-hidden="true" className="hidden items-center justify-center pb-2 text-clay-deep lg:flex">
              <ArrowUpRight className="h-4 w-4" />
            </span>

            <label className="grid gap-1.5 px-2 pb-1 pt-1">
              <span className="text-[0.72rem] font-semibold text-muted">À</span>
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="field"
              >
                <option value="">Destination</option>
                {CITY_NAMES.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 px-2 pb-1 pt-1">
              <span className="text-[0.72rem] font-semibold text-muted">Date</span>
              <input
                type="date"
                min={todayISO()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="field"
              />
            </label>

            <label className="grid gap-1.5 px-2 pb-1 pt-1">
              <span className="text-[0.72rem] font-semibold text-muted">Voyageurs</span>
              <select
                value={passengers}
                onChange={(event) => setPassengers(Number(event.target.value))}
                className="field"
              >
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count} passager{count > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>

        <div className="mt-7 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="text-[0.78rem] font-medium text-muted">
            {matchingTrips.length} trajets disponibles
          </p>
          <p className="hidden text-[0.76rem] font-medium text-muted sm:block">
            {travelDate.toLocaleDateString('fr-FR', { dateStyle: 'full' })}
          </p>
        </div>

        <div
          key={`${origin}-${destination}-${date}-${passengers}`}
          className="mt-6 grid gap-x-8 border-b border-ink/15 sm:grid-cols-2"
        >
          {matchingTrips.length ? (
            matchingTrips.map((trip, index) => {
              const runsToday = trip.days.includes(travelDate.getDay());
              return (
                <article
                  key={`${trip.from}-${trip.to}`}
                  style={{ '--card-index': index }}
                  className="card-index group flex flex-col justify-between border-t border-ink/15 py-5 transition-colors duration-150 hover:border-ink"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 break-words font-serif text-[1.7rem] font-normal leading-[1.02] tracking-[-0.02em] text-ink sm:text-[1.85rem]">
                      <span>{trip.from}</span> <RouteArrow />{' '}
                      <span>{trip.to}</span>
                    </h3>
                    <span
                      className={`shrink-0 border px-2 py-1 text-[0.68rem] font-semibold ${
                        runsToday ? 'border-ochre/55 bg-ochre/10 text-forest-deep' : 'border-ink/15 text-muted'
                      }`}
                    >
                      {runsToday ? 'Départ aujourd’hui' : 'Pas de départ'}
                    </span>
                  </div>

                  <p className="mt-3 text-[0.8rem] font-medium text-muted">
                    {trip.days.length === 7 ? 'Tous les jours' : trip.days.map((day) => DAYS[day]).join(', ')}
                    , {trip.hours.join(' et ')}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/10 pt-4">
                    <div>
                      <p className="text-[1.18rem] font-bold tracking-tight text-ink">{formatFCFA(trip.price)}</p>
                      <p className="mt-0.5 text-[0.7rem] font-medium text-muted">
                        {trip.otherPrice !== trip.price
                          ? `Autre tarif indiqué : ${formatFCFA(trip.otherPrice)}`
                          : 'Tarif affiché par passager'}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!runsToday}
                      onClick={(event) => openBooking(trip, event.currentTarget)}
                      className={`rounded-[2px] px-4 py-2.5 text-[0.78rem] font-semibold transition-colors duration-150 ${
                        runsToday
                          ? 'bg-forest-deep text-cream hover:bg-ink'
                          : 'cursor-not-allowed bg-ink/[0.05] text-muted/60'
                      }`}
                    >
                      Réserver
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="border border-dashed border-ink/20 bg-cream/50 p-10 text-center sm:col-span-2">
              <p className="text-sm font-medium text-muted">
                Aucun trajet direct pour cette combinaison. Essayez une autre ville.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[0.72rem] font-medium text-muted">
          Réservation interactive, paiement fictif, aucun départ confirmé en ligne.
        </p>
      </div>

      {isDialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            style={{ maxHeight: '92dvh', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            className={`modal-panel relative w-full overflow-y-auto border border-ink/15 bg-paper p-6 sm:p-7 ${
              ticket ? 'max-w-2xl' : 'max-w-md'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
              aria-label="Fermer"
              className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-[2px] border border-ink/15 bg-paper text-lg text-muted transition-colors hover:bg-ink hover:text-cream"
            >
              ×
            </button>

            {booking ? (
              <>
                <p className="eyebrow">Encore quelques infos</p>
                <h2
                  id="booking-title"
                  className="mt-3 pe-10 font-serif text-[2.05rem] font-normal leading-[0.95] tracking-[-0.025em] text-ink"
                >
                  {booking.trip.from} <ArrowRight aria-hidden="true" className="inline h-5 w-5 text-clay-deep" />{' '}
                  {booking.trip.to}
                </h2>
                <p className="mt-2 text-[0.8rem] font-medium text-muted">
                  {travelDate.toLocaleDateString('fr-FR', { dateStyle: 'full' })}, {passengers} passager
                  {passengers > 1 ? 's' : ''}
                </p>
                <p className="mt-1 text-[1.1rem] font-bold text-ink">
                  {formatFCFA(booking.trip.price * Number(passengers))}
                </p>

                <form onSubmit={confirmBooking} className="mt-5 grid gap-3">
                  <label className="grid gap-1.5">
                    <span className="text-[0.72rem] font-semibold text-muted">
                      Heure de départ
                    </span>
                    <select
                      value={booking.time}
                      onChange={(event) => setBooking({ ...booking, time: event.target.value })}
                      className="field"
                    >
                      {booking.trip.hours.map((hour) => (
                        <option key={hour}>{hour}</option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[0.72rem] font-semibold text-muted">
                      Nom du passager
                    </span>
                    <input
                      value={booking.name}
                      onChange={(event) => setBooking({ ...booking, name: event.target.value })}
                      autoComplete="name"
                      required
                      className="field"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="text-[0.72rem] font-semibold text-muted">
                      Téléphone
                    </span>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={booking.phone}
                      onChange={(event) => setBooking({ ...booking, phone: event.target.value })}
                      placeholder="+242 06 000 00 00"
                      autoComplete="tel"
                      required
                      className="field"
                    />
                  </label>

                  <fieldset className="mt-1">
                    <legend className="text-[0.72rem] font-semibold text-muted">
                      Règlement (simulation)
                    </legend>
                    <div className="mt-2 flex gap-2">
                      {['Mobile Money', 'En agence'].map((method) => (
                        <label
                          key={method}
                          className={`flex flex-1 cursor-pointer items-center gap-2 rounded-[2px] border px-3 py-2.5 text-[0.78rem] font-medium transition-colors ${
                            booking.payment === method ? 'accent-clay border-clay bg-clay/[0.06]' : 'border-ink/15 bg-cream'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={booking.payment === method}
                            onChange={() => setBooking({ ...booking, payment: method })}
                            className="accent-forest-deep"
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <p className="text-[0.7rem] leading-relaxed text-muted">
                    Aucune transaction ni demande n’est transmise à la compagnie.
                  </p>

                  <button type="submit" className="btn-primary mt-1 w-full py-3.5">
                    Générer mon billet (démo)
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="eyebrow">Émis et enregistré sur cet appareil</p>
                <h2
                  id="booking-title"
                  className="mt-3 pe-10 font-serif text-[2.05rem] font-normal leading-[0.95] tracking-[-0.025em] text-ink"
                >
                  Votre billet électronique
                </h2>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">
                  Il est conservé dans « Billet » et peut être téléchargé en PDF à tout moment.
                </p>

                <div className="ticket-issued mt-5">
                  <ElectronicTicket ticket={ticket} className="ticket-swap" />
                </div>

                <p className="mt-4 text-[0.66rem] leading-relaxed text-muted">
                  Billet de démonstration : il n’est pas valable pour voyager et n’a pas été transmis à la
                  compagnie.
                </p>

                <TicketActions
                  ticket={ticket}
                  onSecondary={onOpenTickets}
                  secondaryLabel="Voir mes billets"
                  onClose={closeDialog}
                />
              </>
            )}
          </section>
        </div>
      )}
    </section>
  );
}
