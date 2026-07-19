import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { CATEGORY_DATA } from '@/data/content';
import FeedbackSection from '@/components/FeedbackSection';
import WhatsNewPopup from '@/components/WhatsNewPopup';
import AdSettingsModal from '@/components/AdSettingsModal';
import OfflineModal from '@/components/OfflineModal';
import '@/styles/manga.css';

interface LiveAnimeItem {
  id?: number;
  title?: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
  genres?: string[];
  status?: string;
  format?: string;
  averageScore?: number;
  popularity?: number;
  season?: string;
  seasonYear?: number;
  episodes?: number;
  duration?: number;
  description?: string;
  startDate?: { year?: number };
  studios?: { nodes?: Array<{ name?: string }> };
}

interface LiveAnimeState {
  hero: { id?: number; title: string; subtitle: string; tag: string; synopsis: string; image: string } | null;
  top10: Array<{ id?: number; title: string; views: string }> | null;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [liveAnime, setLiveAnime] = useState<LiveAnimeState>({ hero: null, top10: null });
  const [popularAnime, setPopularAnime] = useState<LiveAnimeItem[]>([]);
  const [browseAnime, setBrowseAnime] = useState<LiveAnimeItem[]>([]);
  const [browsePage, setBrowsePage] = useState(1);
  const [browseHasNextPage, setBrowseHasNextPage] = useState(false);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [popularPage, setPopularPage] = useState(1);
  const [popularHasNextPage, setPopularHasNextPage] = useState(false);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState(false);
  const [upcomingAnime, setUpcomingAnime] = useState<LiveAnimeItem[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [scheduleAnime, setScheduleAnime] = useState<LiveAnimeItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [recentAnime, setRecentAnime] = useState<LiveAnimeItem[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LiveAnimeItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [coverStyle, setCoverStyle] = useState<'grayscale' | 'color'>('color');
  const [adModalOpen, setAdModalOpen] = useState(false);
  const popularScrollRef = useRef<HTMLDivElement | null>(null);
  const popularLoaderRef = useRef<(page: number, append?: boolean) => Promise<void>>(() => Promise.resolve());
  const popularLoadingRef = useRef(false);
  const popularHasNextPageRef = useRef(false);
  const data = CATEGORY_DATA.Anime;
  const accent = data.accent;
  const apiBaseUrl = (import.meta.env.VITE_MIRURO_API_URL || '').trim().replace(/\/$/, '');

  const buildApiUrl = (path: string) => {
    const cleanPath = path.replace(/^\/+/, '');
    if (apiBaseUrl) {
      return `${apiBaseUrl}/${cleanPath}`;
    }

    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${cleanPath}`;
    }

    return `/${cleanPath}`;
  };

  const loadBrowsePage = async (page = 1) => {
    setBrowseLoading(true);
    try {
      const response = await fetch(buildApiUrl(`trending?page=${page}&per_page=8`));
      if (!response.ok) throw new Error('Failed to load browse anime');

      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      setBrowseAnime(results);
      setBrowsePage(page);
      setBrowseHasNextPage(Boolean(payload?.hasNextPage));
    } catch {
      setBrowseAnime([]);
      setBrowseHasNextPage(false);
    } finally {
      setBrowseLoading(false);
    }
  };

  const loadUpcoming = async () => {
    setUpcomingLoading(true);
    try {
      const response = await fetch(buildApiUrl('upcoming?page=1&per_page=10'));
      if (!response.ok) throw new Error('Failed to load upcoming anime');

      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      setUpcomingAnime(results);
    } catch {
      setUpcomingAnime([]);
    } finally {
      setUpcomingLoading(false);
    }
  };

  const loadSchedule = async () => {
    setScheduleLoading(true);
    try {
      const response = await fetch(buildApiUrl('schedule?page=1&per_page=10'));
      if (!response.ok) throw new Error('Failed to load schedule');

      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      setScheduleAnime(results);
    } catch {
      setScheduleAnime([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  const loadRecent = async () => {
    setRecentLoading(true);
    try {
      const response = await fetch(buildApiUrl('recent?page=1&per_page=10'));
      if (!response.ok) throw new Error('Failed to load recent anime');

      const payload = await response.json();
      const results = Array.isArray(payload?.results) ? payload.results : [];
      setRecentAnime(results);
    } catch {
      setRecentAnime([]);
    } finally {
      setRecentLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const setHeroFromResults = (results: LiveAnimeItem[]) => {
      const first = results[0];
      const hero = first
        ? {
            id: first.id,
            title: first.title?.english || first.title?.romaji || first.title?.native || 'Miruro Spotlight',
            subtitle: first.format || 'LIVE FROM MIRURO',
            tag: 'STREAMING NOW',
            synopsis: [first.status, first.genres?.slice(0, 3).join(' • ')].filter(Boolean).join(' • ') || 'Trending anime from your Miruro API.',
            image: first.coverImage?.large || first.bannerImage || data.hero.image,
          }
        : null;

      const top10 = results.slice(0, 10).map((item: LiveAnimeItem, index: number) => ({
        id: item.id,
        title: item.title?.english || item.title?.romaji || item.title?.native || `Anime ${index + 1}`,
        views: item.averageScore ? `${item.averageScore}/100` : `${index + 1}`,
      }));

      if (!cancelled) {
        setLiveAnime({ hero, top10: top10.length ? top10 : null });
      }
    };

    const loadSpotlight = async () => {
      try {
        const response = await fetch(buildApiUrl('spotlight'));
        if (!response.ok) throw new Error('Failed to load spotlight data');

        const payload = await response.json();
        const results = Array.isArray(payload?.results) ? payload.results : [];
        if (results.length) {
          setHeroFromResults(results as LiveAnimeItem[]);
          if (!cancelled) {
            setHeroLoading(false);
          }
          return;
        }
      } catch {
        // fall through to popular fallback
      }

      try {
        const response = await fetch(buildApiUrl('popular?page=1&per_page=10'));
        if (!response.ok) throw new Error('Failed to load popular fallback');

        const payload = await response.json();
        const results = Array.isArray(payload?.results) ? payload.results : [];
        if (results.length) {
          setHeroFromResults(results as LiveAnimeItem[]);
        } else if (!cancelled) {
          setLiveAnime({ hero: null, top10: null });
        }
      } catch {
        if (!cancelled) {
          setLiveAnime({ hero: null, top10: null });
        }
      } finally {
        if (!cancelled) {
          setHeroLoading(false);
        }
      }
    };

    const loadPopular = async (page = 1, append = false) => {
      if (popularLoadingRef.current && append) return;
      if (page > 1 && !popularHasNextPageRef.current) return;

      popularLoadingRef.current = true;
      setPopularLoading(true);
      setPopularError(false);

      try {
        const response = await fetch(buildApiUrl(`popular?page=${page}&per_page=20`));
        if (!response.ok) throw new Error('Failed to load popular anime');

        const payload = await response.json();
        const results = Array.isArray(payload?.results) ? payload.results : [];

        if (!cancelled) {
          const nextResults = Array.isArray(results) ? results : [];
          setPopularAnime(prev => (append ? [...prev, ...nextResults] : nextResults));
          setPopularPage(page);
          popularHasNextPageRef.current = Boolean(payload?.hasNextPage);
          setPopularHasNextPage(popularHasNextPageRef.current);
        }
      } catch {
        if (!cancelled) {
          setPopularError(true);
        }
      } finally {
        if (!cancelled) {
          popularLoadingRef.current = false;
          setPopularLoading(false);
        }
      }
    };

    popularLoaderRef.current = loadPopular;
    void loadSpotlight();
    void loadPopular(1, false);
    void loadBrowsePage(1);
    void loadUpcoming();
    void loadSchedule();
    void loadRecent();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, data.hero.image]);

  useEffect(() => {
    const container = popularScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const nearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 320;
      if (nearEnd && popularHasNextPage && !popularLoading) {
        void popularLoaderRef.current(popularPage + 1, true);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [popularHasNextPage, popularLoading, popularPage]);

  useEffect(() => {
    void loadBrowsePage(browsePage);
  }, [browsePage]);

  const heroData = liveAnime.hero || data.hero;
  const top10Data = liveAnime.top10 || data.top10;
  const showHeroSkeleton = heroLoading;
  const showPopularSkeleton = popularLoading;
  const coverImageClass = coverStyle === 'grayscale' ? 'grayscale contrast-125 opacity-80 mix-blend-multiply' : 'opacity-90';

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
      setSearchResults(results as LiveAnimeItem[]);
    } catch {
      setSearchError(true);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-manga-body text-black selection:text-white" style={{ '--accent': accent } as React.CSSProperties}>
      
      {/* What's New Popup */}
      <WhatsNewPopup />
      
      {/* Ad Settings Modal */}
      <AdSettingsModal isOpen={adModalOpen} onClose={() => setAdModalOpen(false)} />
      
      {/* Offline/Error Detection Modal */}
      <OfflineModal />
      
      {/* Navigation */}
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
            onClick={() => setCoverStyle(prev => prev === 'grayscale' ? 'color' : 'grayscale')}
            className="border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            {coverStyle === 'grayscale' ? 'Color' : 'Mono'}
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(prev => !prev)}
            className="flex items-center justify-center border-2 border-black p-2 bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            aria-label="Open search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
                    const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                    const studio = item.studios?.nodes?.[0]?.name;
                    const stats = [item.format, item.status, item.episodes ? `${item.episodes} eps` : null, item.startDate?.year ? `${item.startDate.year}` : null].filter(Boolean).join(' • ');
                    return (
                      <button
                        type="button"
                        key={item.id ?? `${title}-${i}`}
                        onClick={() => {
                          if (item.id) {
                            setLocation(`/anime/${item.id}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="manga-panel h-[260px] group cursor-pointer relative overflow-hidden text-left"
                      >
                        <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${coverImageClass}`} style={{ backgroundImage: `url(${image})` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 border-t-4 border-black">
                          <h3 className="font-manga-title text-xl uppercase leading-tight">{title}</h3>
                          <p className="text-[10px] mt-1 font-black uppercase tracking-[0.2em]" style={{ color: accent }}>{stats}</p>
                          {studio ? <p className="text-[10px] mt-1 text-gray-700 font-bold uppercase">{studio}</p> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 font-manga-body font-black uppercase tracking-[0.2em] text-sm">Try a broader title like “Attack on Titan” or “Demon Slayer”.</p>
              )
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {['Demon Slayer', 'One Piece', 'Jujutsu', 'Spy x Family'].map((chip) => (
                  <button key={chip} type="button" onClick={() => { setSearchQuery(chip); void handleSearch(); }} className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <main className="max-w-[1400px] mx-auto p-4 flex flex-col gap-6 mt-4">

        {/* Row 1: Hero + Top 10 */}
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[460px]">

          {/* Hero Panel */}
          {showHeroSkeleton ? (
            <div className="manga-panel flex-[2] min-h-[400px] lg:min-h-full flex flex-col justify-end p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
              <div className="relative z-10 flex flex-col items-start gap-3">
                <div className="h-10 w-36 animate-pulse rounded border-2 border-black bg-white" />
                <div className="h-6 w-48 animate-pulse rounded border-2 border-black bg-white" />
                <div className="h-16 w-3/4 animate-pulse rounded border-2 border-black bg-white" />
                <div className="h-20 w-full max-w-lg animate-pulse rounded border-2 border-black bg-white" />
                <div className="h-12 w-36 animate-pulse rounded border-4 border-black bg-gray-300" />
              </div>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (heroData.id) {
                  setLocation(`/anime/${heroData.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (heroData.id) {
                    setLocation(`/anime/${heroData.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="manga-panel flex-[2] group cursor-pointer min-h-[400px] lg:min-h-full flex flex-col justify-end p-8 relative overflow-hidden"
            >
              {/* Background Image */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${coverImageClass}`}
                style={{ backgroundImage: `url(${heroData.image})` }}
              />
              
              <div className="manga-speedlines opacity-40 group-hover:opacity-60 transition-opacity" />
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity duration-500 mix-blend-multiply"
                style={{ backgroundColor: accent }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />

              <div className="relative z-10 flex flex-col items-start gap-2">
                <div
                  className="manga-speech-bubble px-4 py-2 mb-1 -rotate-2 font-manga-title text-lg"
                  style={{ backgroundColor: accent, color: 'white', borderColor: 'black' }}
                >
                  {heroData.tag}
                </div>
                <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-white px-2 py-0.5 border-2 border-black" style={{ color: accent }}>
                  {heroData.subtitle}
                </p>
                <h1 className="font-manga-title text-5xl sm:text-6xl md:text-7xl leading-none text-black mt-1" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
                  {heroData.title}
                </h1>
                <p className="font-manga-body font-bold text-base max-w-lg bg-black text-white p-3 mt-2 border-2 border-black border-l-4 border-b-4">
                  {heroData.synopsis}
                </p>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (heroData.id) {
                      setLocation(`/anime/${heroData.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="mt-4 font-manga-title text-xl px-8 py-3 border-4 border-black text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                  style={{ backgroundColor: accent }}
                >
                  Watch Now
                </button>
              </div>
            </div>
          )}

          {/* Top 10 Panel */}
          <div className="manga-panel flex-1 h-[400px] lg:h-full flex flex-col">
            <div className="manga-halftone" />
            <div className="manga-border-bottom p-4 text-white relative z-10" style={{ backgroundColor: accent }}>
              <h2 className="font-manga-title text-2xl tracking-wide">TOP 10 THIS WEEK</h2>
            </div>
            <div className="flex-1 manga-scrollbar-thin overflow-y-auto relative z-10 flex flex-col bg-white/90">
              {showHeroSkeleton ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 manga-border-bottom last:border-b-0">
                    <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))
              ) : (
                top10Data.map((item, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => {
                      if (item.id) {
                        setLocation(`/anime/${item.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center p-3 hover:text-white transition-colors cursor-pointer manga-border-bottom last:border-b-0 group text-left"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = accent; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
                  >
                    <div className="font-manga-title text-3xl w-10 text-center opacity-60 group-hover:opacity-100 transition-opacity">{i + 1}</div>
                    <div className="flex-1 pl-2">
                      <div className="font-manga-title text-base uppercase leading-tight">{item.title}</div>
                      <div className="text-xs opacity-60 mt-0.5 font-bold uppercase">{item.views}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div
          className="manga-panel w-full text-white p-6 relative overflow-hidden transform -skew-x-3 scale-x-105 my-2"
          style={{ backgroundColor: accent }}
        >
          <div className="manga-shading absolute inset-0 opacity-30" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between transform skew-x-3 gap-4 px-4">
            <h2 className="font-manga-title text-3xl md:text-4xl uppercase tracking-wider text-center sm:text-left drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{data.banner.text}</h2>
            <button className="border-4 border-black bg-white text-black font-manga-title text-xl px-8 py-3 hover:bg-black hover:text-white transition-colors uppercase whitespace-nowrap shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
              {data.banner.cta}
            </button>
          </div>
        </div>

        {/* Popular Row */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">Most Popular</h2>
          </div>
          <div
            ref={popularScrollRef}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory manga-scrollbar-thin"
          >
            {showPopularSkeleton ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="manga-panel min-w-[220px] max-w-[220px] h-[320px] animate-pulse overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                </div>
              ))
            ) : popularAnime.length > 0 ? (
              popularAnime.map((item, i) => {
                const title = item.title?.english || item.title?.romaji || item.title?.native || `Anime ${i + 1}`;
                const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                const meta = [item.format, item.season, item.startDate?.year].filter(Boolean).join(' • ');

                return (
                  <button
                    type="button"
                    key={item.id ?? `${title}-${i}`}
                    onClick={() => item.id && setLocation(`/anime/${item.id}`)}
                    className="manga-panel min-w-[220px] max-w-[220px] h-[320px] group cursor-pointer relative flex items-end p-3 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start text-left"
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${coverImageClass}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                    <div className="manga-speedlines opacity-25 group-hover:opacity-45 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="relative z-10 bg-white border-4 border-black p-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <p className="font-manga-body font-black text-[10px] uppercase tracking-[0.2em] text-white inline-block px-2 py-1 border-2 border-black" style={{ backgroundColor: accent }}>
                        #{i + 1}
                      </p>
                      <h3 className="font-manga-title text-xl uppercase leading-tight mt-2">{title}</h3>
                      {meta ? <p className="text-xs mt-1 text-gray-700 font-bold uppercase">{meta}</p> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              data.featured.map((item, i) => (
                <button key={i} type="button" className="manga-panel min-w-[220px] max-w-[220px] h-[320px] group cursor-pointer relative flex items-end p-3 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start text-left">
                  <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${coverImageClass}`} style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                  <div className="manga-speedlines opacity-25 group-hover:opacity-45 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="relative z-10 bg-white border-4 border-black p-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    <h3 className="font-manga-title text-xl uppercase leading-tight">{item.title}</h3>
                    <p className="font-manga-body font-black text-[10px] mt-2 text-white inline-block px-2 py-1 uppercase tracking-[0.2em] border-2 border-black" style={{ backgroundColor: accent }}>
                      {item.sub}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
          {popularError ? (
            <p className="mt-2 text-sm font-bold uppercase tracking-wider text-red-600">Unable to load more popular anime right now.</p>
          ) : null}
        </div>

        {/* Upcoming Anime Section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">Upcoming Releases</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory manga-scrollbar-thin">
            {upcomingLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="manga-panel min-w-[220px] max-w-[220px] h-[320px] animate-pulse overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                </div>
              ))
            ) : upcomingAnime.length > 0 ? (
              upcomingAnime.map((item, i) => {
                const title = item.title?.english || item.title?.romaji || item.title?.native || `Anime ${i + 1}`;
                const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                const meta = [item.format, item.season, item.seasonYear].filter(Boolean).join(' • ');

                return (
                  <button
                    type="button"
                    key={item.id ?? `${title}-${i}`}
                    onClick={() => item.id && setLocation(`/anime/${item.id}`)}
                    className="manga-panel min-w-[220px] max-w-[220px] h-[320px] group cursor-pointer relative flex items-end p-3 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start text-left"
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${coverImageClass}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                    <div className="manga-speedlines opacity-25 group-hover:opacity-45 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="relative z-10 bg-white border-4 border-black p-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <p className="font-manga-body font-black text-[10px] uppercase tracking-[0.2em] text-white inline-block px-2 py-1 border-2 border-black mb-2" style={{ backgroundColor: accent }}>
                        Coming Soon
                      </p>
                      <h3 className="font-manga-title text-xl uppercase leading-tight">{title}</h3>
                      {meta ? <p className="text-xs mt-1 text-gray-700 font-bold uppercase">{meta}</p> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">No upcoming anime available</p>
            )}
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">Airing Schedule</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory manga-scrollbar-thin">
            {scheduleLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="manga-panel min-w-[220px] max-w-[220px] h-[320px] animate-pulse overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                </div>
              ))
            ) : scheduleAnime.length > 0 ? (
              scheduleAnime.map((item, i) => {
                const title = item.title?.english || item.title?.romaji || item.title?.native || `Anime ${i + 1}`;
                const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                const meta = [item.format, item.episodes ? `Ep ${item.episodes}` : null].filter(Boolean).join(' • ');

                return (
                  <button
                    type="button"
                    key={item.id ?? `${title}-${i}`}
                    onClick={() => item.id && setLocation(`/anime/${item.id}`)}
                    className="manga-panel min-w-[220px] max-w-[220px] h-[320px] group cursor-pointer relative flex items-end p-3 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start text-left"
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${coverImageClass}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                    <div className="manga-speedlines opacity-25 group-hover:opacity-45 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="relative z-10 bg-white border-4 border-black p-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <p className="font-manga-body font-black text-[10px] uppercase tracking-[0.2em] text-white inline-block px-2 py-1 border-2 border-black mb-2" style={{ backgroundColor: accent }}>
                        On Air
                      </p>
                      <h3 className="font-manga-title text-xl uppercase leading-tight">{title}</h3>
                      {meta ? <p className="text-xs mt-1 text-gray-700 font-bold uppercase">{meta}</p> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">No schedule available</p>
            )}
          </div>
        </div>

        {/* Recent/This Season Section */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">This Season</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory manga-scrollbar-thin">
            {recentLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="manga-panel min-w-[220px] max-w-[220px] h-[320px] animate-pulse overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                </div>
              ))
            ) : recentAnime.length > 0 ? (
              recentAnime.map((item, i) => {
                const title = item.title?.english || item.title?.romaji || item.title?.native || `Anime ${i + 1}`;
                const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                const meta = [item.format, item.status, item.season].filter(Boolean).join(' • ');

                return (
                  <button
                    type="button"
                    key={item.id ?? `${title}-${i}`}
                    onClick={() => item.id && setLocation(`/anime/${item.id}`)}
                    className="manga-panel min-w-[220px] max-w-[220px] h-[320px] group cursor-pointer relative flex items-end p-3 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] snap-start text-left"
                  >
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ${coverImageClass}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                    <div className="manga-speedlines opacity-25 group-hover:opacity-45 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="relative z-10 bg-white border-4 border-black p-3 w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <p className="font-manga-body font-black text-[10px] uppercase tracking-[0.2em] text-white inline-block px-2 py-1 border-2 border-black mb-2" style={{ backgroundColor: accent }}>
                        New
                      </p>
                      <h3 className="font-manga-title text-xl uppercase leading-tight">{title}</h3>
                      {meta ? <p className="text-xs mt-1 text-gray-700 font-bold uppercase">{meta}</p> : null}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-sm font-bold uppercase tracking-wider text-gray-600">No recent anime available</p>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
              <h2 className="font-manga-title text-4xl uppercase tracking-wider">Browse</h2>
            </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setBrowsePage(prev => Math.max(prev - 1, 1))}
                  className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
                  disabled={browsePage === 1}
                >
                  &lt;
                </button>
                <span className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Page {browsePage}</span>
                <button
                  type="button"
                  onClick={() => setBrowsePage(prev => prev + 1)}
                  className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50"
                  disabled={!browseHasNextPage || browseLoading}
                >
                  &gt;
                </button>
              </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {browseLoading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="manga-panel aspect-[2/3] animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-white/90 border-t-4 border-black" />
                </div>
              ))
            ) : browseAnime.length > 0 ? (
              browseAnime.map((item, i) => {
                const title = item.title?.english || item.title?.romaji || item.title?.native || `Browse ${i + 1}`;
                const image = item.coverImage?.large || item.bannerImage || data.hero.image;
                const studio = item.studios?.nodes?.[0]?.name;
                const stats = [item.format, item.status, item.episodes ? `${item.episodes} eps` : null, item.startDate?.year ? `${item.startDate.year}` : null].filter(Boolean).join(' • ');
                return (
                  <button
                    type="button"
                    key={item.id ?? `${title}-${i}`}
                    onClick={() => item.id && setLocation(`/anime/${item.id}`)}
                    className="manga-panel aspect-[2/3] group cursor-pointer relative overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all text-left w-full"
                  >
                    <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${coverImageClass}`} style={{ backgroundImage: `url(${image})` }} />
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                    <div className="manga-shading opacity-30 group-hover:opacity-50 transition-opacity absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 p-3 border-t-4 border-black bg-white/95 z-10">
                      <h4 className="font-manga-title text-lg sm:text-xl uppercase leading-tight">{title}</h4>
                      <p className="text-[10px] mt-1 font-black uppercase tracking-[0.2em]" style={{ color: accent }}>{stats}</p>
                      {studio ? <p className="text-[10px] mt-1 text-gray-700 font-bold uppercase">{studio}</p> : null}
                    </div>
                    <div className="absolute top-2 right-2 z-10 bg-white border-2 border-black font-manga-body text-xs font-black px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      {item.format || 'HD'}
                    </div>
                  </button>
                );
              })
            ) : (
              data.grid.map((item, i) => (
                <button key={i} type="button" className="manga-panel aspect-[2/3] group cursor-pointer relative overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all text-left w-full">
                  <div className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${coverImageClass}`} style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-300 mix-blend-multiply" style={{ backgroundColor: accent }} />
                  <div className="manga-shading opacity-30 group-hover:opacity-50 transition-opacity absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-3 border-t-4 border-black bg-white/95 z-10">
                    <h4 className="font-manga-title text-lg sm:text-xl uppercase leading-none">{item.title}</h4>
                  </div>
                  <div className="absolute top-2 right-2 z-10 bg-white border-2 border-black font-manga-body text-xs font-black px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    {item.badge ?? 'HD'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </main>

      {/* Feedback Section - Moved above footer */}
      <FeedbackSection />

      {/* Footer */}
      <footer className="manga-border-top text-white mt-16 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: accent }}>
        <div className="manga-speedlines opacity-20 mix-blend-overlay" />
        <div className="manga-halftone opacity-30" />
        
        {/* Ad Support Section */}
        <div className="max-w-[1400px] mx-auto px-6 py-8 relative z-10 border-b-2 border-white/20">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-manga-title text-2xl uppercase tracking-wide mb-2 flex items-center justify-center md:justify-start gap-2">
                  Why We Show Ads
                </h3>
                <p className="font-manga-body text-sm leading-relaxed opacity-90">
                  PanelDrop is <strong>completely free</strong> to use! To keep our servers running and provide you with high-quality anime streaming, 
                  we display small, non-intrusive ads. Your support through ads helps us maintain and improve the platform. 
                  You can disable ads anytime, but we'd appreciate your support!
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAdModalOpen(true)}
                  className="border-4 border-white bg-black text-white px-6 py-3 font-manga-title text-lg uppercase tracking-wide shadow-[4px_4px_0_0_rgba(255,255,255,0.3)] hover:shadow-[6px_6px_0_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all"
                >
                  Ad Settings
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <h2 className="font-manga-title text-6xl tracking-widest drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">PANELDROP</h2>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Read. Watch. Experience.</p>
              <p className="font-manga-body text-xs mt-2 opacity-80 font-bold">© 2026 elliecodelab. All rights reserved.</p>
            </div>

            {/* Center */}
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

            {/* Right */}
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
