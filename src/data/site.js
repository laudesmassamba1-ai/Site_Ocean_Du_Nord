export const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
export const CITY_NAMES = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Sibiti', 'Oyo', 'Ouesso', 'Okoyo', 'Kéllé'];

export const TRIPS = [
  { from: 'Brazzaville', to: 'Pointe-Noire', price: 9000, otherPrice: 9000, days: ALL_DAYS, hours: ['06h00', '18h00'] },
  { from: 'Brazzaville', to: 'Ouesso', price: 9000, otherPrice: 9000, days: ALL_DAYS, hours: ['07h00'] },
  { from: 'Brazzaville', to: 'Nkayi', price: 7000, otherPrice: 6000, days: ALL_DAYS, hours: ['07h30', '13h00'] },
  { from: 'Brazzaville', to: 'Oyo', price: 6000, otherPrice: 6000, days: ALL_DAYS, hours: ['08h00', '14h00'] },
  { from: 'Brazzaville', to: 'Okoyo', price: 10000, otherPrice: 10000, days: [3, 5], hours: ['06h30'] },
  { from: 'Brazzaville', to: 'Kéllé', price: 15000, otherPrice: 12000, days: [2, 6], hours: ['06h00'] },
  { from: 'Pointe-Noire', to: 'Sibiti', price: 10000, otherPrice: 10000, days: [2, 6], hours: ['07h00'] },
  { from: 'Pointe-Noire', to: 'Nkayi', price: 6000, otherPrice: 6000, days: ALL_DAYS, hours: ['08h30'] },
];

export const AGENCIES = [
  { name: 'Angola libre', axis: 'Nord', address: 'Avenue de l’OUA, Brazzaville', phones: ['00242067048874'] },
  { name: 'Bétou', axis: 'Nord', address: 'Grande avenue, entre le grand marché et la banque postale', phones: ['00242050811966', '00242066733435'] },
  { name: 'Bouansa', axis: 'Sud', address: 'En face de la station Total, au monastère', phones: ['00242065117807', '00242054403045'] },
  { name: 'Boundji', axis: 'Nord', address: 'Adresse à confirmer auprès de la compagnie', phones: ['00242065090852'] },
  { name: 'Diata', axis: 'Nord', address: 'Avenue du 5 Février, Brazzaville', phones: ['00242067048873'] },
  { name: 'Direction générale · Mikalou', axis: 'Nord', address: '1, rue Ango, avenue de la Tsiémé', phones: ['00242065874460'] },
  { name: 'Djambala', axis: 'Nord', address: 'Rond-point, avenue Fulbert-Youlou', phones: ['00242065958486'] },
  { name: 'Dolisie', axis: 'Sud', address: '04 rue Jolie, grand marché', phones: ['00242065002798', '00242050720238'] },
];

export const SAMPLE_PARCELS = { 'ONC-1001': 3, 'ONC-1002': 5, 'ONC-1003': 2 };
export const PARCEL_STEPS = ['Reçu', 'Chargé', 'En route', 'À destination', 'Retiré'];
export const TIERS = [['Découverte', 0], ['Habitué', 100], ['Fidèle', 300]];

export const formatFCFA = (amount) => `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;

export const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const makeReference = () => `ONC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const safeLoadLoyalty = () => {
  try {
    const value = JSON.parse(localStorage.getItem('onc-demo') || 'null');
    if (value && Number.isFinite(value.points) && typeof value.name === 'string') return value;
  } catch {
    /* Stockage indisponible : la démonstration reste utilisable en mémoire. */
  }
  return { points: 0, name: '' };
};
