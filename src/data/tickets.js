const STORAGE_KEY = 'onc-demo-tickets-v1';
const MAX_TICKETS = 30;

const isTicket = (ticket) =>
  ticket &&
  typeof ticket.reference === 'string' &&
  typeof ticket.name === 'string' &&
  typeof ticket.from === 'string' &&
  typeof ticket.to === 'string' &&
  typeof ticket.date === 'string' &&
  typeof ticket.time === 'string' &&
  Number.isFinite(Number(ticket.passengers)) &&
  Number.isFinite(Number(ticket.total));

export const safeLoadTickets = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(value)) {
      return value.filter(isTicket).slice(0, MAX_TICKETS).map((ticket) => ({
        ...ticket,
        payment: ticket.payment || 'Mobile Money',
        createdAt: ticket.createdAt || new Date().toISOString(),
      }));
    }
  } catch {
    /* Stockage indisponible : les billets restent utilisables en mémoire. */
  }
  return [];
};

export const saveTickets = (tickets) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets.slice(0, MAX_TICKETS)));
  } catch {
    /* Stockage plein ou indisponible : on conserve la session en mémoire. */
  }
};
