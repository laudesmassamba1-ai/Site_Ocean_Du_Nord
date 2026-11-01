import React from 'react';
import { WordRise } from '../ui/Motion.jsx';

export default function PageHeader({ title, accent, description, image, imageAlt, imageCredit, children }) {
  return (
    <header className="border-b border-ink/10 pb-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-end">
        <div className="min-w-0">
          <h1 className="text-balance font-serif text-[clamp(2.8rem,5.6vw,4.8rem)] font-normal leading-[0.9] tracking-[-0.03em] text-ink">
            <WordRise text={accent ? `${title} ${accent}` : title} stagger={80} />
          </h1>
        </div>
        <div className="min-w-0 max-w-md lg:justify-self-end">
          {description && <p className="text-pretty text-[0.95rem] leading-relaxed text-muted">{description}</p>}
          {children}
        </div>
      </div>

      {image && (
        <figure className="mt-8">
          <div className="photo-frame aspect-[16/9] max-h-[260px] sm:aspect-[21/9]">
            <img src={image} alt={imageAlt || ''} loading="lazy" decoding="async" />
          </div>
          {imageCredit && (
            <figcaption className="mt-2 text-end text-[0.7rem] font-medium text-muted">
              Photo : {imageCredit}
            </figcaption>
          )}
        </figure>
      )}
    </header>
  );
}
