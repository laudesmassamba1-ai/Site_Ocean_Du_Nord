import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PARCEL_STEPS, SAMPLE_PARCELS } from '../../data/site.js';
import { useReducedMotion } from './Motion.jsx';

export default function ParcelTracker() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(null);
  const reduced = useReducedMotion();

  function track(event) {
    event.preventDefault();
    setStatus(SAMPLE_PARCELS[code.trim().toUpperCase()] ?? 0);
  }

  return (
    <div className="relative overflow-hidden bg-forest-deep p-6 text-cream sm:p-9">
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-end">
        <div className="min-w-0">
          <h2 className="font-serif text-[clamp(2.2rem,4.5vw,3rem)] font-normal leading-[0.9] tracking-[-0.03em] sm:text-[2.5rem]">
            Où est{' '}
            <span className="block italic">mon colis ?</span>
          </h2>
          <p className="mt-4 max-w-sm text-[0.86rem] leading-relaxed text-cream/65">
            Entrez une référence de démonstration :{' '}
            <span className="font-semibold text-cream/85">ONC-1001</span>,{' '}
            <span className="font-semibold text-cream/85">ONC-1002</span> ou{' '}
            <span className="font-semibold text-cream/85">ONC-1003</span>.
          </p>
        </div>

        <div className="min-w-0">
          <form onSubmit={track} className="flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="parcel-code">
              Référence du reçu
            </label>
            <input
              id="parcel-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Numéro de reçu, ex. ONC-1001"
              autoComplete="off"
              className="w-full min-w-0 rounded-[2px] border border-cream/25 bg-cream/[0.07] px-4 py-3 text-base font-medium text-cream outline-none transition-colors duration-150 placeholder:text-cream/60 focus:border-cream"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[2px] bg-cream px-5 py-3 text-base font-semibold text-forest-deep transition-colors duration-150 hover:bg-sand"
            >
              <Search aria-hidden="true" className="h-4 w-4" />
              Suivre
            </button>
          </form>

          <div aria-live="polite">
            {status !== null && (
              <div key={status} className={`parcel-result mt-5 border-t border-cream/20 pt-4 ${reduced ? 'is-reduced' : ''}`}>
                {status ? (
                  <>
                    <div className="flex items-center justify-between gap-4 text-[0.74rem] font-semibold text-cream/65">
                      <span>Colis {code.trim().toUpperCase()}</span>
                      <span className="text-cream/85">Étape {status} sur 5</span>
                    </div>
                    <div className="parcel-bar mt-3 flex items-start gap-1.5" style={{ '--step': status }}>
                      {PARCEL_STEPS.map((step, index) => (
                        <div key={step} className="flex-1">
                          <div className={`h-1 ${index < status ? 'bg-ochre' : 'bg-cream/15'}`} />
                          <span
                            className={`mt-2 flex items-center gap-1.5 text-[0.66rem] font-medium ${
                              index < status ? 'text-cream/85' : 'text-cream/55'
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[0.86rem] text-cream/65">
                    Référence introuvable. Vérifiez le code du reçu.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
