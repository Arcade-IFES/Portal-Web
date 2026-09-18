/* =========================================================
   RECREIO ARCADE — Ícones SVG (stroke = currentColor)
   Centralizados aqui para não repetir markup em cada página.
   ========================================================= */

const ICONS = {
  medal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/><path d="M8.5 13.5 6 21l6-3 6 3-2.5-7.5"/></svg>`,

  podium: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V13h4v8"/><path d="M10 21V9h4v12"/><path d="M16 21v-6h4v6"/></svg>`,

  uploadArrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/><path d="M5 21h14"/></svg>`,

  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M6 21V10"/><path d="M12 21V5"/><path d="M18 21v-8"/><path d="m4 9 5-4 4 3 6-6"/></svg>`,

  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>`,

  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,

  checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>`,

  xCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m9 9 6 6M15 9l-6 6"/></svg>`,

  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.7" r="0.9" fill="currentColor" stroke="none"/></svg>`,

  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.6 6.1 20.6l1.3-6.6-4.9-4.6 6.6-.8Z"/></svg>`,

  gamepad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="10.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="18.2" cy="13" r="0.9" fill="currentColor" stroke="none"/></svg>`,

  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c.7-3.2 3.2-5 6.2-5s5.5 1.8 6.2 5"/><circle cx="17.5" cy="8.8" r="2.5"/><path d="M16 15.3c2.3.4 4 1.9 4.6 4.7"/></svg>`,

  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 5 5.8v5.6c0 4.6 3 7.8 7 9.4 4-1.6 7-4.8 7-9.4V5.8Z"/><path d="m9.2 12.2 2 2 3.6-3.8"/></svg>`,

  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.3 2"/></svg>`,

  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 5-7 7 7 7"/></svg>`,

  chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.5 5 7 7-7 7"/></svg>`,

  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.7 4.2 6 4.2 9.5s-1.4 6.8-4.2 9.5c-2.8-2.7-4.2-6-4.2-9.5S9.2 5.2 12 2.5Z"/></svg>`,

  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>`,

  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>`,

  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.2" r="3.7"/><path d="M4.5 20c1-4 4-6.2 7.5-6.2S18.5 16 19.5 20"/></svg>`,

  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,

  zip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M12 3v3M12 8v2M12 12v2M12 16v2"/></svg>`,

  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`
};
