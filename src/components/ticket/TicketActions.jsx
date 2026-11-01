import React, { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Trash2 } from 'lucide-react';
import { downloadTicketPdf } from '../../lib/ticketPdf.js';

export default function TicketActions({ ticket, onSecondary, secondaryLabel, onClose, onRemove }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const confirmRef = useRef(null);
  const removeRef = useRef(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirmRemove) {
      wasConfirming.current = true;
      confirmRef.current?.focus();
    } else if (wasConfirming.current) {
      wasConfirming.current = false;
      removeRef.current?.focus();
    }
  }, [confirmRemove]);

  useEffect(() => {
    setStatus('idle');
    setError('');
    setCopied(false);
    setConfirmRemove(false);
  }, [ticket.reference]);

  async function handleDownload() {
    setStatus('loading');
    setError('');
    try {
      await downloadTicketPdf(ticket);
      setStatus('done');
      window.setTimeout(() => setStatus('idle'), 2400);
    } catch {
      setStatus('idle');
      setError('Le PDF n’a pas pu être généré. Réessayez depuis un navigateur récent.');
    }
  }

  async function copyReference() {
    setError('');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ticket.reference);
      } else {
        const input = document.createElement('textarea');
        input.value = ticket.reference;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('La référence n’a pas pu être copiée. Sélectionnez-la manuellement.');
    }
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          aria-live="polite"
          className="btn-primary flex-1 py-3.5 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'loading' ? (
            <>
              <span aria-hidden="true" className="download-spinner" />
              Préparation du PDF…
            </>
          ) : status === 'done' ? (
            'PDF téléchargé'
          ) : (
            'Télécharger le PDF'
          )}
          {status === 'done' && <Check aria-hidden="true" className="h-4 w-4" />}
          {status === 'idle' && <Download aria-hidden="true" className="h-4 w-4" />}
        </button>
        {onSecondary && (
          <button type="button" onClick={onSecondary} className="btn-secondary flex-1 py-3.5">
            {secondaryLabel}
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="btn-secondary px-5 py-3.5">
            Fermer
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 border-s-2 border-clay ps-2.5 text-[0.74rem] leading-relaxed text-clay-deep">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={copyReference}
          className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-muted underline decoration-ink/35 underline-offset-4 transition-colors hover:text-ink"
        >
          {copied ? <Check aria-hidden="true" className="h-3 w-3" /> : <Copy aria-hidden="true" className="h-3 w-3" />}
          {copied ? 'Référence copiée' : 'Copier la référence'}
        </button>

        {onRemove &&
          (confirmRemove ? (
            <span className="flex flex-wrap items-center gap-4">
              <span className="text-[0.72rem] font-semibold text-clay-deep">
                Retirer ce billet ?
              </span>
              <button
                type="button"
                onClick={onRemove}
                aria-label="Confirmer le retrait du billet"
                className="text-[0.72rem] font-semibold text-clay-deep underline decoration-clay-deep/40 underline-offset-4"
              >
                Oui, retirer
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={() => setConfirmRemove(false)}
                aria-label="Annuler le retrait du billet"
                className="text-[0.72rem] font-medium text-muted underline decoration-ink/35 underline-offset-4"
              >
                Annuler
              </button>
            </span>
          ) : (
            <button
              ref={removeRef}
              type="button"
              onClick={() => setConfirmRemove(true)}
              className="inline-flex items-center gap-1.5 text-[0.72rem] font-medium text-muted underline decoration-ink/35 underline-offset-4 transition-colors hover:text-clay-deep"
            >
              <Trash2 aria-hidden="true" className="h-3 w-3" />
              Retirer de l’appareil
            </button>
          ))}
      </div>
    </div>
  );
}
