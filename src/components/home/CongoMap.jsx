import React, { useEffect, useMemo, useState } from 'react';
import { useInView, useReducedMotion } from '../ui/Motion.jsx';
import CONGO from '../../data/congo.geo.json';

const CITY_COORDS = {
  Brazzaville: [15.2663, -4.2634],
  'Pointe-Noire': [11.8635, -4.7761],
  Dolisie: [12.6667, -4.1983],
  Nkayi: [13.2833, -4.1833],
  Sibiti: [13.35, -3.6833],
  Oyo: [15.9, -1.1333],
  Ouesso: [16.05, 1.6136],
  Okoyo: [15.0667, -1.4667],
  Kéllé: [14.45, -0.9],
};

const LABELS = {
  Brazzaville: { dx: 11, dy: 4, anchor: 'start' },
  'Pointe-Noire': { dx: 10, dy: 4, anchor: 'start' },
  Dolisie: { dx: 9, dy: -7, anchor: 'start' },
  Nkayi: { dx: 9, dy: 11, anchor: 'start' },
  Sibiti: { dx: -9, dy: -7, anchor: 'end' },
  Oyo: { dx: 10, dy: -7, anchor: 'start' },
  Ouesso: { dx: 10, dy: -7, anchor: 'start' },
  Okoyo: { dx: -9, dy: -7, anchor: 'end' },
  Kéllé: { dx: 10, dy: -7, anchor: 'start' },
};

const ROUTES = [
  ['Brazzaville', 'Pointe-Noire'],
  ['Brazzaville', 'Ouesso'],
  ['Brazzaville', 'Nkayi'],
  ['Brazzaville', 'Oyo'],
  ['Brazzaville', 'Okoyo'],
  ['Brazzaville', 'Kéllé'],
  ['Pointe-Noire', 'Sibiti'],
  ['Pointe-Noire', 'Nkayi'],
];

const RIVER = [
  [16.2, 2.1], [16.05, 1.61], [16.0, 0.8], [15.72, -0.35], [15.42, -1.5], [15.35, -2.8],
  [15.27, -4.26], [14.4, -4.62], [13.2, -4.96], [12.2, -4.98], [11.86, -4.78], [11.6, -4.5],
];

const VIEW = { west: 10.2, east: 19.0, south: -5.5, north: 4.2, width: 580, height: 640 };

function createProjection(view) {
  const lonScale = Math.cos((((view.south + view.north) / 2) * Math.PI) / 180);
  const scale = Math.min(
    view.width / ((view.east - view.west) * lonScale),
    view.height / (view.north - view.south),
  );
  const mapWidth = (view.east - view.west) * lonScale * scale;
  const mapHeight = (view.north - view.south) * scale;
  const offsetX = (view.width - mapWidth) / 2;
  const offsetY = (view.height - mapHeight) / 2;
  return ([longitude, latitude]) => [
    offsetX + (longitude - view.west) * lonScale * scale,
    offsetY + (view.north - latitude) * scale,
  ];
}

const project = createProjection(VIEW);

function geometryPath(feature) {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates]
    : feature.geometry.type === 'MultiPolygon' ? feature.geometry.coordinates : [];
  return polygons.flatMap((polygon) => polygon.map((ring) => `${ring.map((coordinate, index) => {
    const [x, y] = project(coordinate);
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ')} Z`)).join(' ');
}

function smoothPath(points) {
  if (points.length < 2) return '';
  const projected = points.map(project);
  let path = `M${projected[0][0].toFixed(1)},${projected[0][1].toFixed(1)}`;
  for (let index = 0; index < projected.length - 1; index += 1) {
    const current = projected[index];
    const next = projected[index + 1];
    const previous = projected[index - 1] || current;
    const afterNext = projected[index + 2] || next;
    const controlOne = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const controlTwo = [next[0] - (afterNext[0] - current[0]) / 6, next[1] - (afterNext[1] - current[1]) / 6];
    path += ` C${controlOne[0].toFixed(1)},${controlOne[1].toFixed(1)} ${controlTwo[0].toFixed(1)},${controlTwo[1].toFixed(1)} ${next[0].toFixed(1)},${next[1].toFixed(1)}`;
  }
  return path;
}

const COUNTRY = CONGO.features[0];
const COUNTRY_PATH = geometryPath(COUNTRY);
const RIVER_PATH = smoothPath(RIVER);

export default function CongoMap({ origin, destination, onSelectRoute }) {
  const [compact, setCompact] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [figureRef, inView] = useInView({ threshold: 0.22, once: compact });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (inView) setDrawn(true);
  }, [inView]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  const positions = useMemo(
    () => Object.fromEntries(Object.entries(CITY_COORDS).map(([city, coords]) => [city, project(coords)])),
    [],
  );

  return (
    <figure ref={figureRef} className={`map-figure border border-ink/15 bg-sand ${drawn ? 'is-drawn' : ''}`}>
      <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[0.72rem] font-semibold text-clay-deep">République du Congo</p>
          <p className="mt-1 font-serif text-[1.55rem] leading-none text-ink">Touchez une ville.</p>
        </div>
        <p className="shrink-0 text-end text-[0.72rem] font-medium text-moss">
          9 villes
          <span className="block text-ink">8 axes</span>
        </p>
      </div>

      <div className="px-2 py-3 sm:px-4 sm:py-4">
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="h-auto w-full" role="img" aria-label="Carte de la République du Congo avec les villes desservies et les axes réguliers.">
          <defs>
            <linearGradient id="land-fill" x1="0" y1="0" x2="0.8" y2="1">
              <stop offset="0" stopColor="#26543f" />
              <stop offset="1" stopColor="#17392b" />
            </linearGradient>
            <pattern id="map-lines" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M0 26 26 0" stroke="#f5f1e8" strokeWidth="0.5" opacity="0.07" />
            </pattern>
            <filter id="land-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#123126" floodOpacity="0.22" />
            </filter>
          </defs>

          <rect width={VIEW.width} height={VIEW.height} fill="#e8ddc9" />
          <rect width={VIEW.width} height={VIEW.height} fill="url(#map-lines)" />

          <g opacity="0.45">
            {[0, 1, 2, 3, 4].map((index) => (
              <line key={`h-${index}`} x1="0" y1={90 + index * 110} x2={VIEW.width} y2={90 + index * 110} stroke="#182018" strokeWidth="0.45" strokeDasharray="2 6" />
            ))}
            {[0, 1, 2, 3, 4].map((index) => (
              <line key={`v-${index}`} x1={80 + index * 105} y1="0" x2={80 + index * 105} y2={VIEW.height} stroke="#182018" strokeWidth="0.45" strokeDasharray="2 6" />
            ))}
          </g>

          <path d={COUNTRY_PATH} fill="url(#land-fill)" stroke="#123126" strokeWidth="2" filter={compact ? undefined : 'url(#land-shadow)'} pointerEvents="none" />
          <path d={COUNTRY_PATH} fill="url(#map-lines)" stroke="none" pointerEvents="none" />
          <path d={RIVER_PATH} fill="none" stroke="#8db6b0" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" pathLength="1000" className="map-river" pointerEvents="none" />

          <g className="pointer-events-none">
            {ROUTES.map(([from, to], index) => {
              const start = positions[from];
              const end = positions[to];
              const bend = index % 2 ? 14 : -14;
              const path = `M${start[0].toFixed(1)},${start[1].toFixed(1)} Q${((start[0] + end[0]) / 2 + bend).toFixed(1)},${((start[1] + end[1]) / 2 - bend).toFixed(1)} ${end[0].toFixed(1)},${end[1].toFixed(1)}`;
              const forward = origin === from && destination === to;
              const active = forward || (origin === to && destination === from);
              return (
                <path key={`${from}-${to}`} id={`map-route-${index}`} d={path} fill="none" stroke={active ? '#f5f1e8' : '#d3a04a'} strokeWidth={active ? 2.4 : 1.2} strokeLinecap="round" opacity={active ? 1 : 0.78} vectorEffect="non-scaling-stroke" pathLength="1000" className={`map-route ${active ? 'is-active' : ''}`} style={{ '--route-index': index }} />
              );
            })}
          </g>

          {!reduced && !compact && inView && (
            <g className="map-bus">
              {(() => {
                let busIndex = 0;
                let forward = true;
                ROUTES.forEach(([from, to], index) => {
                  if (origin === from && destination === to) { busIndex = index; forward = true; }
                  else if (origin === to && destination === from) { busIndex = index; forward = false; }
                });
                const keyPoints = forward ? '0;1' : '1;0';
                return (
                  <g key={`bus-${busIndex}-${forward}`}>
                    <circle r="3.6" fill="#fcfaf5" stroke="#b8862f" strokeWidth="1.4" vectorEffect="non-scaling-stroke">
                      <animateMotion dur="6.5s" repeatCount="indefinite" calcMode="linear" keyPoints={keyPoints} keyTimes="0;1">
                        <mpath xlinkHref={`#map-route-${busIndex}`} />
                      </animateMotion>
                    </circle>
                  </g>
                );
              })()}
            </g>
          )}

          <g>
            {Object.entries(positions).map(([city, [x, y]]) => {
              const label = LABELS[city];
              const capital = city === 'Brazzaville';
              const active = city === origin || city === destination;
              return (
                <g key={city} className="group cursor-pointer" pointerEvents="bounding-box" onClick={() => onSelectRoute(city)} role="button" tabIndex="0" aria-label={`Préparer un départ depuis ${city}`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelectRoute(city); }}>
                  <circle cx={x} cy={y} r={capital ? 5 : 3.6} className={active ? 'fill-ochre' : 'fill-cream group-hover:fill-ochre'} />
                  <circle cx={x} cy={y} r="13" fill="transparent" />
                  <text x={x + label.dx} y={y + label.dy} textAnchor={label.anchor} className={active ? 'fill-ochre' : 'fill-cream group-hover:fill-ochre'} fontSize={capital ? 12.5 : 11} fontWeight={capital ? 700 : 500} letterSpacing="0.01em">{city}</text>
                </g>
              );
            })}
          </g>

          <text x="26" y="485" fill="#4f6350" fontSize="8" fontWeight="700" letterSpacing="0.22em" transform="rotate(-90 26 485)">OCÉAN ATLANTIQUE</text>
          <g transform="translate(520 44)" opacity="0.7">
            <path d="M0 18 6 0l6 18" fill="none" stroke="#182018" strokeWidth="1" />
            <text x="6" y="30" textAnchor="middle" fill="#182018" fontSize="8" fontWeight="700" letterSpacing="0.12em">N</text>
          </g>
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink/10 px-5 py-3 text-[0.7rem] font-medium text-moss sm:px-6">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cream ring-1 ring-ink/40" /> Ville desservie</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-px w-5 bg-ochre" /> Axe régulier</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-px w-5 bg-[#8db6b0]" /> Fleuve Congo</span>
        <span className="ms-auto hidden text-forest sm:inline">Départ au choix</span>
      </figcaption>
    </figure>
  );
}
