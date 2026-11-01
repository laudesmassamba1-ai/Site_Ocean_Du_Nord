import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { formatFCFA } from '../../data/site.js';
import { ticketQrPayload } from '../../lib/ticketPdf.js';

function TicketQr({ ticket, className = '' }) {
  const payload = useMemo(() => ticketQrPayload(ticket), [ticket]);
  const [source, setSource] = useState('');

  useEffect(() => {
    let active = true;
    import('qrcode')
      .then((module) => {
        const QRCode = module.default || module;
        return QRCode.toDataURL(payload, {
          errorCorrectionLevel: 'M',
          margin: 1,
          width: 420,
          color: { dark: '#123126', light: '#fcfaf5' },
        });
      })
      .then((url) => {
        if (active) setSource(url);
      })
      .catch(() => {
        if (active) setSource('');
      });
    return () => {
      active = false;
    };
  }, [payload]);

  return (
    <div className={`qr-in relative shrink-0 bg-cream p-1.5 ${className}`}>
      {source ? (
        <img
          src={source}
          alt={`QR code du billet ${ticket.reference}`}
          className="h-full w-full"
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-sand/60">
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted">QR</span>
        </div>
      )}
    </div>
  );
}

const Field = ({ label, value, strong = false }) => (
  <div className="min-w-0">
    <dt className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-muted">{label}</dt>
    <dd
      className={`mt-1 break-words text-[0.82rem] leading-snug ${
        strong ? 'font-bold text-ink' : 'font-semibold text-ink'
      }`}
    >
      {value}
    </dd>
  </div>
);

export default function ElectronicTicket({ ticket, className = '' }) {
  const issued = new Date(ticket.createdAt || Date.now());
  const issuedLabel = Number.isNaN(issued.getTime())
    ? ticket.date
    : issued.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <article
      className={`relative overflow-hidden border border-ink/15 bg-cream text-ink ${className}`}
      data-ticket-reference={ticket.reference}
    >
      <div className="relative overflow-hidden bg-forest-deep px-5 pb-5 pt-5 text-cream sm:px-7 sm:pb-6 sm:pt-6">
        <svg
          aria-hidden="true"
          viewBox="0 0 800 200"
          className="ticket-wave pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[36rem] text-cream"
          fill="none"
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <path
              key={index}
              d={`M-40 ${52 + index * 24} C 120 ${8 + index * 24}, 250 ${120 + index * 24}, 400 ${58 + index * 24} S 640 ${4 + index * 24}, 840 ${72 + index * 24}`}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.14"
            />
          ))}
        </svg>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div className="min-w-0">
            <p className="text-[0.64rem] font-bold uppercase tracking-[0.24em] text-cream/65">
              Billet électronique · Démo
            </p>
            <p className="mt-1.5 font-serif text-[2rem] leading-none tracking-[-0.02em]">Océan du Nord</p>
            <p className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-cream/70">
              Compagnie de transport · République du Congo
            </p>
          </div>
          <div className="shrink-0 text-start sm:text-end">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-cream/65">Référence</p>
            <p className="mt-1 font-mono text-[0.78rem] font-bold tracking-[0.06em] text-cream sm:text-[0.84rem]">
              {ticket.reference}
            </p>
            <span className="mt-1.5 inline-block border border-cream/35 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-cream/80">
              Non valable
            </span>
          </div>
        </div>
      </div>

      <span aria-hidden="true" className="ticket-notch ticket-notch-start" />
      <span aria-hidden="true" className="ticket-notch ticket-notch-end" />

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <p className="eyebrow">Votre trajet</p>
        <h3 className="mt-3 break-words text-balance font-serif text-[2.35rem] font-normal leading-[0.95] tracking-[-0.025em] text-ink sm:text-[2.85rem]">
          {ticket.from} <ArrowRight aria-hidden="true" className="accent-clay inline h-7 w-7 text-clay-deep" />{' '}
          {ticket.to}
        </h3>

        <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-ink/10 pt-4 sm:grid-cols-4">
          <Field label="Date" value={ticket.date} />
          <Field label="Départ" value={ticket.time} />
          <Field label="Passager" value={ticket.name} strong />
          <Field label="Voyageurs" value={`${ticket.passengers} personne${Number(ticket.passengers) > 1 ? 's' : ''}`} />
        </dl>

        <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-dashed border-ink/20 pt-4 sm:grid-cols-4">
          <Field label="Classe" value="Standard" />
          <Field label="Paiement" value={ticket.payment || 'Mobile Money'} />
          <Field label="Montant" value={formatFCFA(ticket.total)} strong />
          <Field label="Émis le" value={issuedLabel} />
        </dl>
      </div>

      <div className="relative border-t border-dashed border-ink/25 bg-cream">
        <div className="flex items-start justify-between gap-5 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-muted">Contrôle</p>
            <p className="mt-1.5 font-serif text-[1.55rem] leading-tight text-ink">Présentez ce QR code.</p>
            <p className="mt-2 max-w-[15rem] text-[0.72rem] leading-relaxed text-muted">
              À l’agence ou au départ. Le PDF reprend les mêmes informations.
            </p>
            <p className="mt-3 font-mono text-[0.68rem] font-semibold tracking-[0.08em] text-ink">
              {ticket.reference}
            </p>
          </div>
          <TicketQr ticket={ticket} className="h-24 w-24 sm:h-28 sm:w-28" />
        </div>
      </div>

      <div className="border-t border-ink/10 bg-paper px-5 py-2.5 text-center text-[0.68rem] font-semibold leading-snug text-muted sm:px-7">
        Billet de démonstration, non valable pour voyager
      </div>
    </article>
  );
}
