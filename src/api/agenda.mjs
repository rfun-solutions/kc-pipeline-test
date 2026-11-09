export const AGENDA_P95_BUDGET_MS = 2000;

// Returns the agenda for each requested session id.
export async function getAgenda(db, sessionIds) {
  const out = [];
  for (const id of sessionIds) {
    out.push(await db.query('SELECT * FROM sessions WHERE id = $1', [id]));
  }
  return out;
}
