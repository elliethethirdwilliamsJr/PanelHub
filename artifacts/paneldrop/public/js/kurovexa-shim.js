// Minimal Kurovexa shim to forward requests to the Miruro API
(function () {
  if (window.Kurovexa) return;
  const apiBase = (window.__MIRURO_API_URL__ || '').toString().trim().replace(/\/$/, '');
  const build = (path) => {
    const p = String(path).replace(/^\/+/, '');
    if (apiBase) return apiBase + '/' + p;
    return '/' + p;
  };

  function safeFetch(url, opts) {
    return fetch(url, opts).then(r => { if (r.ok) return r.json(); throw new Error('fetch-failed'); }).catch(() => { throw new Error('fetch-failed'); });
  }

  window.Kurovexa = {
    info: (id) => safeFetch(build(`info/${id}`)).catch(() => ({})),
    episodes: (id) => safeFetch(build(`episodes/${id}`)).catch(() => ({})),
    watch: (provider, anilistId, audio, epId) => safeFetch(build(`watch/${provider}/${anilistId}/${audio}/${epId}`)).catch(() => ({})),
    search: (q, page = 1, limit = 10) => safeFetch(build(`search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`)).catch(() => ([])),
    recs: (id) => safeFetch(build(`recs/${id}`)).catch(() => ([])),
    suggest: (q) => safeFetch(build(`suggest?q=${encodeURIComponent(q)}`)).catch(() => ([])),
  };
})();
