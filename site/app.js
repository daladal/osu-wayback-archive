(() => {
  'use strict';
  const WB = 'https://web.archive.org/web/';
  const CHUNK = 300;
  const MODE_LABEL = { osu: 'osu!', taiko: 'taiko', fruits: 'catch', mania: 'mania' };
  const MODE_ALIAS = { catch: 'fruits', ctb: 'fruits', std: 'osu', standard: 'osu', 'osu!': 'osu' };
  const SRC_LABEL = { puush: 'puush', pomf: 'pomf', upppy: 'up.ppy.sh' };
  const KIND_LABEL = { replay_archive: 'replays', nested_archive: 'beatmaps/skins' };

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fold = s => String(s == null ? '' : s).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
  const fmtInt = n => n == null ? '' : Number(n).toLocaleString('en-US');
  const size = r => r.sz == null ? '' : r.sz >= 1048576 ? (r.sz / 1048576).toFixed(1) + ' MB' : r.sz >= 1024 ? Math.round(r.sz / 1024) + ' KB' : r.sz + ' B';
  const safeWb = p => /^[\w./-]*$/.test(String(p == null ? '' : p)) ? String(p) : '';
  const link = r => {
    let h = `<a href="${esc(WB + safeWb(r.wb))}" title="${esc(r.fn || '')}" rel="noopener">download</a>`;
    (r.copies || []).forEach((c, i) => { h += ` <a class="tag" href="${esc(WB + safeWb(c))}" title="another archived copy" rel="noopener">alt${i + 1}</a>`; });
    return h;
  };
  const partial = r => r.partial ? ' <span class="tag" title="archive listing incomplete: only part of it could be read">(partial)</span>' : '';

  const TABS = {
    replays: {
      file: 'data/replays.json', yearField: 'date',
      search: ['player', 'map', 'fn', 'mods'],
      aliases: { beatmap: 'map', name: 'player', user: 'player', file: 'fn', filename: 'fn', source: 'src', mod: 'mods', version: 'ver' },
      columns: [
        { key: 'player', label: 'Player', render: r => r.player ? esc(r.player) : '<span class="muted">(unknown)</span>' },
        { key: 'map', label: 'Beatmap', render: r => r.map ? esc(r.map) : `<span class="muted">${esc(r.fn)}</span>` },
        { key: 'mode', label: 'Mode', render: r => MODE_LABEL[r.mode] || esc(r.mode) },
        { key: 'mods', label: 'Mods' },
        { key: 'score', label: 'Score', num: true, render: r => fmtInt(r.score) },
        { key: 'combo', label: 'Combo', num: true, render: r => fmtInt(r.combo) + (r.fc ? ' <span class="tag" title="perfect combo">FC</span>' : '') },
        { key: 'acc', label: 'Acc %', num: true, render: r => r.acc == null ? '' : r.acc.toFixed(2) },
        { key: 'miss', label: 'Miss', num: true },
        { key: 'date', label: 'Played', render: r => `<span title="date from ${esc(r.date_src || 'unknown')}">${esc((r.date || '').slice(0, 10))}</span>` },
        { key: 'ver', label: 'Client', num: true, title: 'osu! client version that recorded the replay' },
        { key: 'src', label: 'Source', render: r => SRC_LABEL[r.src] || esc(r.src) },
        { key: 'sz', label: 'Size', num: true, render: size },
        { key: 'arc', label: 'Archived' },
        { key: 'wb', label: 'Link', sortable: false, render: link },
      ],
    },
    beatmaps: {
      file: 'data/beatmaps.json', yearField: 'arc',
      search: ['artist', 'title', 'creator', 'diffs', 'fn', 'tags'],
      aliases: { mapper: 'creator', diff: 'diffs', difficulty: 'diffs', version: 'diffs', file: 'fn', filename: 'fn', source: 'src', type: 'ct', setid: 'set' },
      columns: [
        { key: 'artist', label: 'Artist' },
        { key: 'title', label: 'Title', render: r => r.title ? esc(r.title) : `<span class="muted">${esc(r.fn)}</span>` },
        { key: 'creator', label: 'Creator' },
        { key: 'diffs', label: 'Difficulties', render: r => esc(r.diffs) + partial(r), wrap: true },
        { key: 'set', label: 'Set', num: true, render: r => r.set ? `<a href="https://osu.ppy.sh/beatmapsets/${r.set}" rel="noopener">${r.set}</a>` : '' },
        { key: 'ct', label: 'Type' },
        { key: 'src', label: 'Source', render: r => SRC_LABEL[r.src] || esc(r.src) },
        { key: 'sz', label: 'Size', num: true, render: size },
        { key: 'arc', label: 'Archived' },
        { key: 'fn', label: 'File', render: r => `<span title="${esc(r.fn)}">${esc(r.fn)}</span>` },
        { key: 'wb', label: 'Link', sortable: false, render: link },
      ],
    },
    skins: {
      file: 'data/skins.json', yearField: 'arc',
      search: ['name', 'author', 'fn'],
      aliases: { skin: 'name', creator: 'author', file: 'fn', filename: 'fn', source: 'src', type: 'ct' },
      columns: [
        { key: 'name', label: 'Skin', render: r => r.name ? esc(r.name) : '<span class="muted">(no skin.ini read)</span>' },
        { key: 'author', label: 'Author' },
        { key: 'fn', label: 'File', render: r => `<span title="${esc(r.fn)}">${esc(r.fn)}</span>` + partial(r) },
        { key: 'entries', label: 'Files', num: true, render: r => fmtInt(r.entries) },
        { key: 'ct', label: 'Type' },
        { key: 'src', label: 'Source', render: r => SRC_LABEL[r.src] || esc(r.src) },
        { key: 'sz', label: 'Size', num: true, render: size },
        { key: 'arc', label: 'Archived' },
        { key: 'wb', label: 'Link', sortable: false, render: link },
      ],
    },
    archives: {
      file: 'data/archives.json', yearField: 'arc',
      search: ['fn', 'contents', 'kind'],
      aliases: { file: 'fn', filename: 'fn', source: 'src', type: 'ct', inside: 'contents' },
      columns: [
        { key: 'fn', label: 'File', render: r => `<span title="${esc(r.fn)}">${esc(r.fn)}</span>` + partial(r) },
        { key: 'kind', label: 'Contains', render: r => KIND_LABEL[r.kind] || esc(r.kind) },
        { key: 'contents', label: 'osu! files inside', wrap: true, render: r => esc((r.contents || '').split('\n').join(' · ')) },
        { key: 'ct', label: 'Type' },
        { key: 'src', label: 'Source', render: r => SRC_LABEL[r.src] || esc(r.src) },
        { key: 'sz', label: 'Size', num: true, render: size },
        { key: 'arc', label: 'Archived' },
        { key: 'wb', label: 'Link', sortable: false, render: link },
      ],
    },
  };

  const $ = id => document.getElementById(id);
  const els = { tabs: $('tabs'), q: $('q'), src: $('src'), mode: $('mode'), count: $('count'), thead: $('table').tHead,
    tbody: $('table').tBodies[0], sentinel: $('sentinel'), status: $('status'), footer: $('footer'), fields: $('fields') };
  const cache = {};
  const state = { tab: 'replays', q: '', src: '', mode: '', sort: '', dir: 'desc', rows: [], shown: 0 };

  async function load(tab) {
    if (cache[tab]) return cache[tab];
    els.status.textContent = 'loading…';
    const res = await fetch(TABS[tab].file);
    if (!res.ok) throw new Error(res.status + ' loading ' + TABS[tab].file);
    const { cols, rows } = await res.json();
    const fields = TABS[tab].search;
    const out = rows.map(a => {
      const r = {};
      cols.forEach((c, i) => { r[c] = a[i]; });
      r._h = fold(fields.map(f => r[f]).filter(Boolean).join(' \n '));
      return r;
    });
    cache[tab] = out;
    return out;
  }

  function parseQuery(q) {
    const terms = [];
    const re = /(-)?(?:([A-Za-z_]+):)?(?:"([^"]*)"|(\S+))/g;
    let m;
    while ((m = re.exec(q))) {
      const value = fold(m[3] != null ? m[3] : m[4]);
      if (value) terms.push({ neg: !!m[1], field: m[2] ? m[2].toLowerCase() : null, value });
    }
    return terms;
  }

  function matcher(tab, terms) {
    const cfg = TABS[tab];
    const tests = terms.map(t => {
      let test;
      if (!t.field) test = r => r._h.includes(t.value);
      else if (t.field === 'year') test = r => String(r[cfg.yearField] || r.arc || '').startsWith(t.value);
      else if (t.field === 'mode') { const v = MODE_ALIAS[t.value] || t.value; test = r => r.mode === v; }
      else if (t.field === 'src' || t.field === 'source') test = r => r.src === t.value;
      else {
        const f = cfg.aliases[t.field] || t.field;
        test = r => fold(r[f]).includes(t.value);
      }
      return t.neg ? r => !test(r) : test;
    });
    return r => tests.every(f => f(r));
  }

  function apply() {
    const all = cache[state.tab] || [];
    const cfg = TABS[state.tab];
    const ok = matcher(state.tab, parseQuery(state.q));
    let rows = all.filter(r => ok(r) && (!state.src || r.src === state.src) && (!state.mode || r.mode === state.mode));
    if (state.sort) {
      const k = state.sort, col = cfg.columns.find(c => c.key === k) || {};
      const dir = state.dir === 'asc' ? 1 : -1;
      const cmp = col.num
        ? (a, b) => (a[k] == null) - (b[k] == null) || dir * ((a[k] || 0) - (b[k] || 0))
        : (a, b) => (!a[k]) - (!b[k]) || dir * String(a[k] || '').localeCompare(String(b[k] || ''), undefined, { numeric: true, sensitivity: 'base' });
      rows = rows.slice().sort(cmp);
    }
    state.rows = rows;
    state.shown = 0;
    els.tbody.innerHTML = '';
    els.count.textContent = `${fmtInt(rows.length)} of ${fmtInt(all.length)}`;
    renderHead();
    renderMore();
    writeHash();
  }

  function renderHead() {
    const cfg = TABS[state.tab];
    els.thead.innerHTML = '<tr>' + cfg.columns.map(c =>
      `<th data-key="${c.key}" class="${c.num ? 'num' : ''}${state.sort === c.key ? ' sorted ' + state.dir : ''}"${c.sortable === false ? ' data-nosort="1"' : ''}${c.title ? ` title="${esc(c.title)}"` : ''}>${esc(c.label)}</th>`).join('') + '</tr>';
  }

  function renderMore() {
    const cfg = TABS[state.tab];
    const end = Math.min(state.rows.length, state.shown + CHUNK);
    let html = '';
    for (let i = state.shown; i < end; i++) {
      const r = state.rows[i];
      html += '<tr>' + cfg.columns.map(c => `<td class="${c.num ? 'num' : ''}${c.wrap ? ' wrap' : ''}">${c.render ? c.render(r) : esc(r[c.key])}</td>`).join('') + '</tr>';
    }
    els.tbody.insertAdjacentHTML('beforeend', html);
    state.shown = end;
    els.status.textContent = state.rows.length === 0 ? 'no matches'
      : end < state.rows.length ? `showing ${fmtInt(end)} of ${fmtInt(state.rows.length)}, scroll for more` : `${fmtInt(end)} rows`;
  }

  function writeHash() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.src) p.set('src', state.src);
    if (state.mode) p.set('mode', state.mode);
    if (state.sort) { p.set('sort', state.sort); p.set('dir', state.dir); }
    const h = '#' + state.tab + (p.toString() ? '?' + p.toString() : '');
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  function readHash() {
    const [tab, qs] = location.hash.slice(1).split('?');
    const p = new URLSearchParams(qs || '');
    state.tab = TABS[tab] ? tab : 'replays';
    state.q = p.get('q') || '';
    state.src = p.get('src') || '';
    state.mode = p.get('mode') || '';
    state.sort = p.get('sort') || '';
    state.dir = p.get('dir') === 'asc' ? 'asc' : 'desc';
  }

  async function show() {
    const cfg = TABS[state.tab];
    els.tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
    els.q.value = state.q; els.src.value = state.src; els.mode.value = state.mode;
    els.mode.hidden = state.tab !== 'replays';
    if (els.fields) els.fields.textContent = cfg.columns.filter(c => c.sortable !== false && c.key !== 'wb').map(c => c.key).join(', ');
    try { await load(state.tab); } catch (e) { els.status.textContent = 'failed to load data: ' + e.message; return; }
    apply();
  }

  els.tabs.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.tab = b.dataset.tab; state.sort = ''; state.mode = '';
    show();
  });
  let timer;
  els.q.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { state.q = els.q.value.trim(); apply(); }, 150); });
  els.src.addEventListener('change', () => { state.src = els.src.value; apply(); });
  els.mode.addEventListener('change', () => { state.mode = els.mode.value; apply(); });
  els.thead.addEventListener('click', e => {
    const th = e.target.closest('th'); if (!th || th.dataset.nosort) return;
    const k = th.dataset.key;
    if (state.sort === k) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
    else { state.sort = k; state.dir = TABS[state.tab].columns.find(c => c.key === k).num ? 'desc' : 'asc'; }
    apply();
  });
  const nearEnd = () => els.sentinel.getBoundingClientRect().top < window.innerHeight + 600;
  const more = () => { if (state.shown < state.rows.length && nearEnd()) renderMore(); };
  new IntersectionObserver(more, { rootMargin: '600px' }).observe(els.sentinel);
  window.addEventListener('scroll', more, { passive: true });
  window.addEventListener('resize', more);
  window.addEventListener('hashchange', () => { readHash(); show(); });

  fetch('data/meta.json').then(r => r.json()).then(m => {
    const f = m.files || {};
    const n = k => fmtInt((f[k] || {}).rows);
    els.footer.innerHTML = `${n('replays')} replays · ${n('beatmaps')} beatmaps · ${n('skins')} skins · ${n('archives')} other archives. ` +
      `Built ${esc((m.built_at || '').slice(0, 10))}. Files download from the Internet Archive's Wayback Machine; ` +
      `dates and names come from filenames and file headers, so treat them as best effort. ` +
      `<a href="https://github.com/daladal/osu-puush-archive-index" rel="noopener">More information on GitHub</a>.`;
  }).catch(() => {});

  readHash();
  show();
})();
