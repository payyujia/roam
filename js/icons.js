/* ===== ICONS: path data + the ic() builder, plus tiny DOM helpers ===== */
const I={'arrow-left':'<path d="M19 12H5M12 19l-7-7 7-7"/>',check:'<path d="M20 6L9 17l-5-5"/>',x:'<path d="M18 6L6 18M6 6l12 12"/>','map-pin':'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>','calendar-sync':'<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8.7 15.9a3.7 3.7 0 0 1 6.4-1.5M15.1 12.9v1.8h-1.8M15.3 17.1a3.7 3.7 0 0 1-6.4 1.5M8.9 20.1v-1.8h1.8"/>',search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
'message-circle':'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z"/>','thumbs-up':'<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>','thumbs-down':'<path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
navigation:'<path d="M3 11l19-9-9 19-2-8-8-2z"/>','log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',plus:'<path d="M12 5v14M5 12h14"/>',truck:'<rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
'chevron-right':'<path d="M9 18l6-6-6-6"/>',coffee:'<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"/>',cpu:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',bag:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',box:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',smile:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',anchor:'<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/>',
sun:'<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
'more':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',vote:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',trash:'<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
map:'<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16"/>',home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',brief:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',compass:'<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'};

Object.assign(I,{plane:'<path d="M21 3L3 10l7 3 3 7zM10 13L21 3"/>',film:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/>','tab-map':'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>','tab-map-filled':'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" fill="currentColor" stroke="none"/><path d="M9 4v14M15 6v14" fill="none" stroke="var(--bg)" stroke-width="1.8"/>','tab-chat':'<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'});
Object.assign(I,{star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',dots:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>'});
/* v3 icons (fork flow, profile, map) */
Object.assign(I,{'git-branch':'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',route:'<circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 19h8a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h8"/>','cloud-rain':'<line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>','alert-triangle':'<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>','chevron-down':'<path d="M6 9l6 6 6-6"/>',camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',minus:'<path d="M5 12h14"/>','arrow-right':'<path d="M5 12h14M12 5l7 7-7 7"/>'});

/* View alternatives: vector-traced from the user-supplied forked arrow icon.
   Scoped to this new icon key; existing route and branch icons stay intact. */
I['route-split']='<path d="M5.77,1.12L5.34,1.31L2.06,4.59L1.88,5.02L1.88,5.44L2.06,5.86L5.48,9.23L5.77,9.33L6.47,9.23L6.89,8.86L7.08,8.44L6.98,7.73L5.72,6.33L7.03,6.42L8.53,7.03L9.05,7.41L10.17,8.67L10.55,9.42L10.88,10.78L10.88,21.94L10.97,22.22L11.34,22.64L11.77,22.83L12.19,22.83L12.56,22.69L12.89,22.36L13.08,21.94L13.08,10.78L13.22,9.98L13.55,9.09L14.48,7.78L15.42,7.03L16.73,6.47L18.23,6.33L16.97,7.73L16.88,8.44L17.06,8.86L17.48,9.23L17.77,9.33L18.47,9.23L21.89,5.86L22.08,5.44L22.08,5.02L21.89,4.59L18.61,1.31L18.19,1.12L17.77,1.12L17.48,1.22L17.06,1.59L16.88,2.02L16.88,2.44L17.06,2.86L18.28,4.08L16.27,4.31L14.58,4.97L13.41,5.77L11.95,7.36L11.44,6.66L10.55,5.77L9.38,4.97L7.69,4.31L5.67,4.08L6.89,2.86L7.08,2.44L7.08,2.02L6.89,1.59L6.47,1.22Z" fill="currentColor" stroke="none"/>';

/* Full-width X for the Map trip pill: visually balanced with route-split
   at the same 20px icon size, without changing close icons elsewhere. */
I['map-close']='<path d="M2.5 2.5L21.5 21.5M21.5 2.5L2.5 21.5"/>';
const ic=(n,s=24,f='none')=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]||''}</svg>`;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* Reels tab: a clear play-triangle silhouette. */
Object.assign(I,{play:'<path d="M8 5v14l11-7z"/>'});

/* Travel-mode icons for live navigation (same 24px / 1.9 stroke family as the set above). */
Object.assign(I,{
 walk:'<circle cx="13" cy="4.5" r="1.7"/><path d="M12.5 8.5L10 12l-3 .8M12.5 8.5l2.4 2.3 3.1.6M11.2 12.5l.8 3.5-2.4 5.5M12 16l3 1.8.4 3.7"/>',
 car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
 train:'<path d="M8 3.1V7a4 4 0 0 0 8 0V3.1M9 15l-1-1M15 15l1-1"/><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5z"/><path d="M8 19l-2 3M16 19l2 3"/>'
});

/* Keep the Components Library heart for shared uses. The Reels Like action
   uses a fuller silhouette so its 24px icon has the same visual weight as
   the neighbouring bookmark and share icons. */
Object.assign(I,{
 heart:'<path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/>',
 'reel-heart':'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
});

/* Activity category icons shared by filters, voting, saved places, itineraries,
   and activity details. Keep the existing 24px outline/2px stroke system. */
Object.assign(I,{
 'layout-grid':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 utensils:'<path d="M4 2v7a3 3 0 0 0 6 0V2M7 2v20M18 22V2c-3 2.7-5 6.8-5 11h5"/>',
 store:'<path d="M3 10v11h18V10M3 4h18l2 6H1l2-6zM9 21v-7h6v7"/>',
 ticket:'<path d="M3 7a2 2 0 0 0-2 2v2a2.5 2.5 0 0 1 0 5v2a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-2a2.5 2.5 0 0 1 0-5V9a2 2 0 0 0-2-2H3zM14 7v13" />',
 theater:'<path d="M4 3h16v8c0 6-3.5 10-8 10S4 17 4 11V3zM8 9h.01M16 9h.01M8.5 14c2 2 5 2 7 0"/>'
});
