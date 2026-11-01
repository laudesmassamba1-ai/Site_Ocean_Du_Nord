import { formatFCFA } from '../data/site.js';
import instrumentSerifUrl from '../assets/fonts/instrument-serif-normal-latin.ttf?url';

const PAPER = [245, 241, 232];
const CREAM = [252, 250, 245];
const INK = [24, 32, 24];
const FOREST = [31, 70, 53];
const DEEP = [18, 49, 38];
const CLAY = [192, 91, 54];
const OCHRE = [211, 160, 74];
const MUTED = [108, 106, 93];
const SAND = [232, 221, 201];
const RIVER = [141, 182, 176];

const SERIF_FILE = 'InstrumentSerif-Regular.ttf';
let serifBase64Promise;

const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
};

const loadSerifBase64 = () => {
  if (!serifBase64Promise) {
    serifBase64Promise = fetch(instrumentSerifUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Font unavailable');
        return response.arrayBuffer();
      })
      .then(toBase64)
      .catch(() => null);
  }
  return serifBase64Promise;
};

export const ticketQrPayload = (ticket) =>
  JSON.stringify({
    v: 1,
    demo: true,
    r: ticket.reference,
    n: ticket.name,
    f: ticket.from,
    t: ticket.to,
    d: ticket.date,
    h: ticket.time,
    p: Number(ticket.passengers),
    a: Number(ticket.total),
  });

const clean = (value) =>
  String(value ?? '')
    .replace(/\u202F|\u00A0/g, ' ')
    .replace(/→/g, '-');

const money = (amount) => clean(formatFCFA(amount));

const issuedLabel = (ticket) => {
  const date = new Date(ticket.createdAt || Date.now());
  if (Number.isNaN(date.getTime())) return clean(ticket.date);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

const truncate = (doc, text, maxWidth) => {
  let value = clean(text);
  if (doc.getTextWidth(value) <= maxWidth) return value;
  while (value.length > 1 && doc.getTextWidth(`${value}...`) > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value.trim()}...`;
};

const setStyle = (doc, family, style, size, color) => {
  doc.setFont(family, style);
  doc.setFontSize(size);
  doc.setTextColor(...color);
};

const label = (doc, text, x, y, options = {}) => {
  setStyle(doc, 'helvetica', 'bold', options.size || 5.4, options.color || MUTED);
  doc.text(clean(text).toUpperCase(), x, y, {
    align: options.align || 'left',
    charSpace: options.charSpace ?? 0.28,
  });
};

const drawWave = (doc, x, y, width, amplitude, rows = 3) => {
  doc.setDrawColor(...RIVER);
  doc.setLineWidth(0.35);
  const segments = 28;
  for (let row = 0; row < rows; row += 1) {
    const base = y + row * 2.1;
    for (let index = 0; index < segments; index += 1) {
      const x1 = x + (width / segments) * index;
      const x2 = x + (width / segments) * (index + 1);
      const y1 = base + Math.sin(index / 3.8) * amplitude;
      const y2 = base + Math.sin((index + 1) / 3.8) * amplitude;
      doc.line(x1, y1, x2, y2);
    }
  }
};

export async function downloadTicketPdf(ticket) {
  const [{ jsPDF }, qrModule, serifBase64] = await Promise.all([
    import('jspdf'),
    import('qrcode'),
    loadSerifBase64(),
  ]);
  const QRCode = qrModule.default || qrModule;
  const qrDataUrl = await QRCode.toDataURL(ticketQrPayload(ticket), {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 560,
    color: { dark: '#123126', light: '#fcfaf5' },
  });

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  if (serifBase64) {
    doc.addFileToVFS(SERIF_FILE, serifBase64);
    doc.addFont(SERIF_FILE, 'InstrumentSerif', 'normal');
  }
  const serif = serifBase64 ? 'InstrumentSerif' : 'times';
  doc.setProperties({
    title: `Billet ${ticket.reference} - Océan du Nord`,
    subject: `${ticket.from} - ${ticket.to} · ${ticket.date}`,
    author: 'Océan du Nord',
    keywords: 'billet, transport, Congo, démonstration',
    creator: 'Océan du Nord',
  });

  doc.setFillColor(...PAPER);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setFillColor(...FOREST);
  doc.rect(0, 0, 210, 36, 'F');
  drawWave(doc, 15, 32.5, 180, 0.7, 2);

  setStyle(doc, serif, 'normal', 22, CREAM);
  doc.text('Océan du Nord', 15, 18);
  label(doc, 'Compagnie de transport · République du Congo', 15, 25, {
    color: [231, 235, 225],
    size: 5.5,
    charSpace: 0.2,
  });
  label(doc, 'Billet électronique · Démonstration', 15, 30, {
    color: OCHRE,
    size: 5.6,
    charSpace: 0.3,
  });

  label(doc, 'Référence', 195, 14, { color: [205, 216, 205], align: 'right', charSpace: 0.3 });
  setStyle(doc, 'courier', 'bold', 10, CREAM);
  doc.text(clean(ticket.reference), 195, 21, { align: 'right' });
  label(doc, 'Émis le', 195, 27, { color: [205, 216, 205], align: 'right', charSpace: 0.3 });
  setStyle(doc, 'helvetica', 'normal', 6.5, CREAM);
  doc.text(clean(issuedLabel(ticket)), 195, 31.5, { align: 'right' });

  const x = 15;
  const y = 47;
  const width = 180;
  const height = 128;
  const divider = 141;

  doc.setFillColor(...CREAM);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.3);
  doc.rect(x, y, width, height, 'FD');

  label(doc, 'Votre trajet', 23, y + 12, { color: CLAY, size: 5.8, charSpace: 0.35 });
  const route = clean(`${ticket.from} - ${ticket.to}`);
  let routeSize = 19;
  setStyle(doc, serif, 'normal', routeSize, INK);
  while (doc.getTextWidth(route) > 112 && routeSize > 11) {
    routeSize -= 0.5;
    doc.setFontSize(routeSize);
  }
  doc.text(route, 23, y + 25);
  doc.setDrawColor(...CLAY);
  doc.setLineWidth(0.45);
  doc.line(23, y + 30, 132, y + 30);

  const details = [
    ['Date', ticket.date],
    ['Départ', ticket.time],
    ['Passager', ticket.name],
    ['Voyageurs', `${ticket.passengers} personne${Number(ticket.passengers) > 1 ? 's' : ''}`],
    ['Classe', 'Standard'],
    ['Paiement', ticket.payment || 'Mobile Money'],
    ['Montant', money(ticket.total)],
    ['Émis le', issuedLabel(ticket)],
  ];

  details.forEach(([key, value], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const cellX = 23 + column * 56;
    const cellY = y + 41 + row * 17.5;
    label(doc, key, cellX, cellY, { size: 5.2, charSpace: 0.24 });
    const isAmount = key === 'Montant';
    setStyle(
      doc,
      isAmount ? serif : 'helvetica',
      isAmount ? 'normal' : 'normal',
      isAmount ? 11.5 : 8.4,
      isAmount ? DEEP : INK,
    );
    doc.text(truncate(doc, value, 51), cellX, cellY + 6.2);
  });

  doc.setFillColor(...CREAM);
  doc.rect(divider, y, width - (divider - x), height, 'F');
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.3);
  doc.rect(x, y, width, height, 'S');

  doc.setDrawColor(...SAND);
  doc.setLineWidth(0.4);
  doc.setLineDashPattern([1.5, 1.4], 0);
  doc.line(divider, y + 3, divider, y + height - 3);
  doc.setLineDashPattern([], 0);

  doc.setFillColor(...PAPER);
  doc.circle(divider, y, 3.4, 'F');
  doc.circle(divider, y + height, 3.4, 'F');

  doc.addImage(qrDataUrl, 'PNG', divider + 11, y + 13, 32, 32);
  label(doc, 'Référence', divider + 27, y + 51, { align: 'center', size: 5, charSpace: 0.24 });
  setStyle(doc, 'courier', 'bold', 7.4, INK);
  doc.text(clean(ticket.reference), divider + 27, y + 56, { align: 'center' });
  label(doc, 'À présenter à l’embarquement', divider + 27, y + 63, {
    align: 'center',
    size: 4.5,
    charSpace: 0.16,
  });
  label(doc, 'Billet de démonstration', divider + 27, y + 75, {
    align: 'center',
    color: CLAY,
    size: 4.8,
    charSpace: 0.18,
  });

  doc.setFillColor(243, 226, 188);
  doc.rect(x, y + height - 12, width, 12, 'F');
  setStyle(doc, 'helvetica', 'bold', 5.6, DEEP);
  doc.text('BILLET DE DÉMONSTRATION — NON VALABLE POUR VOYAGER', 105, y + height - 4.8, {
    align: 'center',
    charSpace: 0.24,
  });

  label(doc, 'Après la réservation', 15, 190, { color: CLAY, size: 5.8, charSpace: 0.35 });
  setStyle(doc, serif, 'normal', 17, INK);
  doc.text('Un billet simple, à garder sur soi.', 15, 199);
  setStyle(doc, 'helvetica', 'normal', 8, MUTED);
  const intro = doc.splitTextToSize(
    'Présentez le QR code à l’agence ou au départ. Le PDF reprend les mêmes informations que votre billet électronique. Ce document est une démonstration et ne permet pas de voyager.',
    180,
  );
  doc.text(intro, 15, 207);

  const steps = [
    ['01', 'Vérifiez', 'Contrôlez le trajet, la date, l’heure et le nombre de passagers.'],
    ['02', 'Présentez', 'Montrez le QR code ou le PDF au guichet avant le départ.'],
    ['03', 'Conservez', 'Gardez une copie sur votre téléphone pendant tout le voyage.'],
  ];

  steps.forEach(([number, title, body], index) => {
    const stepX = 15 + index * 61;
    doc.setDrawColor(...SAND);
    doc.setLineWidth(0.35);
    doc.line(stepX, 222, stepX + 53, 222);
    label(doc, number, stepX, 229, { color: CLAY, size: 6, charSpace: 0.2 });
    setStyle(doc, 'helvetica', 'bold', 8.5, INK);
    doc.text(title, stepX, 235);
    setStyle(doc, 'helvetica', 'normal', 7, MUTED);
    doc.text(doc.splitTextToSize(body, 51), stepX, 240);
  });

  drawWave(doc, 118, 252, 77, 1.1, 3);

  doc.setDrawColor(...SAND);
  doc.setLineWidth(0.35);
  doc.line(15, 263, 195, 263);
  setStyle(doc, 'helvetica', 'bold', 7.4, INK);
  doc.text('Océan du Nord · Avenue de l’OUA, Brazzaville', 15, 270);
  setStyle(doc, 'helvetica', 'normal', 7.2, MUTED);
  doc.text('+242 06 587 44 60 · contact@oceandunord.com', 195, 270, { align: 'right' });
  setStyle(doc, 'helvetica', 'normal', 5.8, MUTED);
  doc.text(
    'Prototype non officiel : ce billet est simulé et ne constitue pas un titre de transport.',
    15,
    277,
  );
  setStyle(doc, 'courier', 'normal', 5.6, MUTED);
  doc.text(clean(ticket.reference), 195, 277, { align: 'right' });

  doc.save(`billet-ocean-du-nord-${clean(ticket.reference)}.pdf`);
}
