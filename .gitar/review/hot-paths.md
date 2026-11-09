Generated from Dash0 at 2026-11-08T12:00Z (FAKE test numbers): /api/agenda p95 2.1 s (budget 500 ms).

Rule: any change to src/api/agenda.mjs must not call the database inside a loop and must keep the exported constant AGENDA_P95_BUDGET_MS at 500 or lower. Quote this rule's header in the review finding when it applies.
