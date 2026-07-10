import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import '@/styles/manga.css';

interface AnimeDetails {
  id?: number;
  title?: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
  description?: string;
  genres?: string[];
  status?: string;
  format?: string;
  averageScore?: number;
  popularity?: number;
  season?: string;
  seasonYear?: number;
  episodes?: number;
  duration?: number;
  startDate?: { year?: number; month?: number; day?: number };
  studios?: { nodes?: Array<{ name?: string }> };
  nextAiringEpisode?: { episode?: number };
}

const accent = '#f04e35';

function stripHtml(value?: string) {
  if (!value) return 'No synopsis available yet.';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function AnimeInfo() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id?: number; title?: { romaji?: string; english?: string; native?: string }; coverImage?: { large?: string; extraLarge?: string }; bannerImage?: string; format?: string; status?: string; episodes?: number; startDate?: { year?: number } }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const apiBaseUrl = (import.meta.env.VITE_MIRURO_API_URL || '').trim().replace(/\/$/, '');

  const buildApiUrl = (path: string) => {
    const cleanPath = path.replace(/^\/+/, '');
    if (apiBaseUrl) return `${apiBaseUrl}/${cleanPath}`;
    if (typeof window !== 'undefined') return `${window.location.origin}/${cleanPath}`;
    return `/${cleanPath}`;
  };

  const handleSearch = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchLoading(true);
    setSearchError(false);
    setSearchOpen(true);

    try {
      const response = await fetch(buildApiUrl(`search?query=${encodeURIComponent(query)}&page=1&per_page=12`));
      if (!response.ok) throw new Error('Search failed');
      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      setSearchResults(results);
    } catch {
      setSearchError(true);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!params.id) {
      setLoading(false);
      setError(true);
      return;
    }

    let cancelled = false;

    const loadAnime = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(buildApiUrl(`info/${params.id}`));
        if (!response.ok) throw new Error('Anime not found');
        const payload = await response.json();
        if (!cancelled) {
          setAnime(payload);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setAnime(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAnime();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, params.id]);


  const title = useMemo(() => {
    if (!anime) return 'Loading anime';
    return anime.title?.english || anime.title?.romaji || anime.title?.native || 'Untitled Anime';
  }, [anime]);

  const image = anime?.coverImage?.extraLarge || anime?.coverImage?.large || anime?.bannerImage || '';
  const banner = anime?.bannerImage || image;
  const synopsis = useMemo(() => stripHtml(anime?.description), [anime?.description]);
  const metadata = [
    anime?.format,
    anime?.status,
    anime?.episodes ? `${anime.episodes} eps` : null,
    anime?.duration ? `${anime.duration} min` : null,
    anime?.season ? `${anime.season} ${anime.seasonYear || ''}`.trim() : null,
    anime?.startDate?.year ? `${anime.startDate.year}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#faf7f1] text-black">
      <nav className="flex w-full manga-border-bottom bg-white relative z-50 sticky top-0">
        <div className="flex-none px-6 py-4 manga-border-right flex items-center justify-center text-white transition-colors duration-300" style={{ backgroundColor: accent }}>
          <img src="/sitelogo.png" alt="PanelDrop" className="h-10 w-auto" />
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="inline-flex items-center gap-3">
            <span className="font-manga-title text-2xl tracking-widest uppercase">PanelDrop</span>
          </div>
        </div>
        <div className="flex-none px-4 py-4 manga-border-left flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(prev => !prev)}
            className="border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            Search
          </button>
        </div>
      </nav>

      {searchOpen ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 p-4 pt-8 overflow-y-auto">
          <div className="manga-panel w-full max-w-5xl p-4 md:p-6 bg-white shadow-[10px_10px_0_0_rgba(0,0,0,1)]" style={{ backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))' }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="font-manga-title text-3xl uppercase tracking-wider">Search Catalog</h2>
              <button type="button" onClick={() => setSearchOpen(false)} className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Close</button>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search anime, titles, studios..."
                  className="w-full border-4 border-black bg-white px-4 py-3 pr-12 font-manga-body text-base font-bold outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-black">⌕</div>
              </div>
              <button
                type="submit"
                className="border-4 border-black px-5 py-3 font-manga-title text-xl uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
                style={{ backgroundColor: accent }}
              >
                Search
              </button>
            </form>

            {searchLoading ? (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="manga-panel h-[260px] animate-pulse overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200" />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                  </div>
                ))}
              </div>
            ) : searchError ? (
              <p className="mt-4 font-manga-body font-black uppercase tracking-[0.2em] text-sm text-red-600">No results found for that search.</p>
            ) : searchQuery ? (
              searchResults.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {searchResults.map((item, i) => {
                    const title = item.title?.english || item.title?.romaji || item.title?.native || `Result ${i + 1}`;
                    const image = item.coverImage?.large || item.bannerImage || '';
                    const stats = [item.format, item.status, item.episodes ? `${item.episodes} eps` : null, item.startDate?.year ? `${item.startDate.year}` : null].filter(Boolean).join(' • ');
                    return (
                      <button
                        key={item.id ?? `${title}-${i}`}
                        type="button"
                        onClick={() => {
                          if (item.id) {
                            setSearchOpen(false);
                            setLocation(`/anime/${item.id}`);
                          }
                        }}
                        className="manga-panel h-[260px] group cursor-pointer relative overflow-hidden text-left"
                      >
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 border-t-4 border-black">
                          <h3 className="font-manga-title text-xl uppercase leading-tight">{title}</h3>
                          <p className="text-[10px] mt-1 font-black uppercase tracking-[0.2em]">{stats}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 font-manga-body font-black uppercase tracking-[0.2em] text-sm text-red-600">No results found for that search.</p>
              )
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <button
          type="button"
          onClick={() => setLocation('/')}
          className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
        >
          ← Back to catalog
        </button>

        {loading ? (
          <div className="manga-panel mt-6 overflow-hidden">
            <div className="h-72 w-full animate-pulse bg-gray-200" />
            <div className="p-6 md:p-8 space-y-4">
              <div className="h-8 w-2/3 animate-pulse bg-gray-200" />
              <div className="h-4 w-full animate-pulse bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse bg-gray-200" />
              <div className="h-4 w-4/6 animate-pulse bg-gray-200" />
            </div>
          </div>
        ) : error ? (
          <div className="manga-panel mt-6 p-8 text-center">
            <h1 className="font-manga-title text-3xl uppercase tracking-wider">Anime unavailable</h1>
            <p className="mt-3 font-manga-body font-bold uppercase tracking-[0.2em] text-sm">The requested anime could not be loaded right now.</p>
          </div>
        ) : anime ? (
          <div className="manga-panel mt-6 overflow-hidden">
            <div className="relative overflow-hidden min-h-[320px] md:min-h-[420px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner || image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
              <div className="absolute inset-0" style={{ backgroundColor: accent, opacity: 0.16 }} />
              <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
                <div className="inline-block self-start border-2 border-black bg-white px-3 py-2 font-manga-body text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  {anime.format || 'ANIME'}
                </div>
                <h1 className="font-manga-title text-4xl md:text-6xl uppercase tracking-wider mt-3 max-w-4xl" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl border-2 border-black bg-white/90 p-3 font-manga-body font-bold text-sm md:text-base">
                  {synopsis}
                </p>
              </div>
            </div>

            <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div>
                <div className="flex flex-wrap gap-2">
                  {metadata.map((item, index) => (
                    <span key={`${item}-${index}`} className="border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <h2 className="font-manga-title text-2xl uppercase tracking-wide">Synopsis</h2>
                  <p className="mt-3 font-manga-body text-base leading-7 text-gray-800">{synopsis}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => anime?.id && setLocation(`/watch/${anime.id}`)}
                    className="border-4 border-black px-6 py-3 font-manga-title text-xl uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
                    style={{ backgroundColor: accent }}
                  >
                    Watch Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('/')}
                    className="border-2 border-black bg-white px-6 py-3 font-manga-title text-xl uppercase tracking-wide shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  >
                    Browse More
                  </button>
                </div>
              </div>

              <div className="border-4 border-black bg-white p-5 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                <h2 className="font-manga-title text-2xl uppercase tracking-wide">Details</h2>
                <div className="mt-4 space-y-3 text-sm font-manga-body font-bold uppercase tracking-[0.2em] text-gray-800">
                  <div className="flex items-center justify-between border-b border-black/20 pb-2">
                    <span>Status</span>
                    <span>{anime.status || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/20 pb-2">
                    <span>Score</span>
                    <span>{anime.averageScore ? `${anime.averageScore}/100` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/20 pb-2">
                    <span>Popularity</span>
                    <span>{anime.popularity ? `${anime.popularity}` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/20 pb-2">
                    <span>Studio</span>
                    <span>{anime.studios?.nodes?.[0]?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next Ep.</span>
                    <span>{anime.nextAiringEpisode?.episode ? `#${anime.nextAiringEpisode.episode}` : 'TBA'}</span>
                  </div>
                </div>

                {anime.genres?.length ? (
                  <div className="mt-6">
                    <h3 className="font-manga-title text-xl uppercase tracking-wide">Genres</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <span key={genre} className="border-2 border-black bg-[#fff4ed] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <footer className="manga-border-top text-white mt-16 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: accent }}>
        <div className="manga-speedlines opacity-20 mix-blend-overlay" />
        <div className="manga-halftone opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <img src="/sitelogo.png" alt="PanelDrop" className="h-12 w-auto" />
              <h2 className="font-manga-title text-6xl tracking-widest drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">PANELDROP</h2>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Read. Watch. Experience.</p>
              <p className="font-manga-body text-xs mt-2 opacity-80 font-bold">© 2025 elliecodelab. All rights reserved.</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setLocation('/')}
                  className="font-manga-body font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black px-3 py-1 border-2 border-transparent hover:border-black transition-colors"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setLocation('/')}
                  className="font-manga-body font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black px-3 py-1 border-2 border-transparent hover:border-black transition-colors"
                >
                  Anime
                </button>
              </div>
              <div className="bg-white text-black font-manga-title tracking-wider px-4 py-1 border-2 border-black text-sm shadow-[2px_2px_0_0_rgba(0,0,0,1)] transform -rotate-2">
                Built by elliecodelab
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="manga-speech-bubble bg-white text-black font-manga-title text-2xl px-6 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-2">
                elliecodelab
              </div>
              <p className="font-manga-body font-bold text-xs uppercase tracking-widest opacity-80 mt-2">
                Made with passion
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
