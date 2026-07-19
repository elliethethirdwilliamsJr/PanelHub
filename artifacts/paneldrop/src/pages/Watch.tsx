import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import '@/styles/manga.css';
import '@/styles/kv-player.css';

interface AnimeDetails {
  id?: number;
  title?: { romaji?: string; english?: string; native?: string };
  coverImage?: { large?: string; extraLarge?: string };
  bannerImage?: string;
}

interface EpisodeItem {
  id?: string;
  number?: number;
  title?: string;
  image?: string;
  airDate?: string;
  duration?: number;
  filler?: boolean;
}

interface StreamPayload {
  streams?: Array<{ url?: string; type?: string; quality?: string }>;
  subtitles?: Array<{ file?: string; label?: string }>;
  intro?: { start?: number; end?: number };
  outro?: { start?: number; end?: number };
}

const accent = '#f04e35';

function stripHtml(value?: string) {
  if (!value) return 'No synopsis available yet.';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseEpisodeId(episodeId?: string) {
  const normalized = (episodeId || '').replace(/^\/+/, '').replace(/^watch\//, '');
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length < 4) {
    return { provider: '', anilistId: '', category: '', slug: '' };
  }

  return {
    provider: parts[0],
    anilistId: parts[1],
    category: parts[2],
    slug: parts.slice(3).join('/'),
  };
}

export default function Watch() {
  const params = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodesPayload, setEpisodesPayload] = useState<any>(null);
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sub');
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeItem | null>(null);
  const [streamData, setStreamData] = useState<StreamPayload | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id?: number; title?: { romaji?: string; english?: string; native?: string }; coverImage?: { large?: string; extraLarge?: string }; bannerImage?: string; format?: string; status?: string; episodes?: number; startDate?: { year?: number } }>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [skipIntro, setSkipIntro] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [selectedSubtitle, setSelectedSubtitle] = useState('');
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
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

  function normalizeStreamPayload(payload: any): StreamPayload | null {
    if (!payload) return null;
    if (Array.isArray((payload as any).streams)) return payload as StreamPayload;
    // payload sometimes comes wrapped under a provider key (e.g. { ssub: { streams: [...] } })
    const vals = Object.values(payload);
    for (const v of vals) {
      if (v && Array.isArray((v as any).streams)) return v as StreamPayload;
    }
    return null;
  }

  const streamUrl = useMemo(() => {
    const streams = streamData?.streams || [];
    if (selectedQuality !== 'auto') {
      const selected = streams.find((item) => item.quality === selectedQuality);
      return selected?.url || '';
    }
    const stream = streams.find((item) => item.url) || streams[0];
    return stream?.url || '';
  }, [selectedQuality, streamData]);

  useEffect(() => {
    if (!params.id) {
      setError('No anime selected.');
      return;
    }

    let cancelled = false;

    const loadAnime = async () => {
      try {
        const response = await fetch(buildApiUrl(`info/${params.id}`));
        if (!response.ok) throw new Error('Anime not found');
        const payload = await response.json();
        if (!cancelled) {
          setAnime(payload);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load anime details.');
        }
      }
    };

    const loadEpisodes = async () => {
      try {
        const response = await fetch(buildApiUrl(`episodes/${params.id}`));
        if (!response.ok) throw new Error('Episodes not found');
        const payload = await response.json();
        if (!cancelled) {
          setEpisodesPayload(payload);
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load episode list.');
        }
      }
    };

    void loadAnime();
    void loadEpisodes();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, params.id]);

  useEffect(() => {
    if (!episodesPayload || !episodesPayload.providers) return;

    // Filter to only providers that have at least one episode in any category
    const providerNames = Object.keys(episodesPayload.providers).filter((name) => {
      const eps = episodesPayload.providers[name]?.episodes;
      if (!eps || typeof eps !== 'object') return false;
      return Object.values(eps).some((list: any) => Array.isArray(list) && list.length > 0);
    });
    if (!providerNames.length) {
      setProviders([]);
      setSelectedProvider('');
      setEpisodes([]);
      setSelectedEpisode(null);
      return;
    }

    const nextProvider = providerNames.includes(selectedProvider) ? selectedProvider : providerNames[0];
    const categoryMap = episodesPayload.providers[nextProvider]?.episodes || {};
    const categoryNames = Object.keys(categoryMap).filter(
      (cat) => Array.isArray(categoryMap[cat]) && categoryMap[cat].length > 0
    );
    const nextCategory = categoryNames.includes(selectedCategory) ? selectedCategory : categoryNames[0] || 'sub';
    const list = categoryMap[nextCategory] || [];

    setProviders(providerNames);
    setSelectedProvider(nextProvider);
    setSelectedCategory(nextCategory);
    setEpisodes(list);
    setSelectedEpisode((current) => {
      if (current && list.some((item: EpisodeItem) => item.id === current.id)) return current;
      return list[0] || null;
    });
  }, [episodesPayload, selectedCategory, selectedProvider]);

  useEffect(() => {
    if (!params.id || !selectedEpisode?.id) {
      setStreamData(null);
      setVideoLoading(false);
      return;
    }

    let cancelled = false;

    const loadStream = async () => {
      setVideoLoading(true);
      setError(null);

      const parsed = parseEpisodeId(selectedEpisode.id);
      const watchUrl = buildApiUrl(`watch/${parsed.provider}/${params.id}/${parsed.category}/${parsed.slug}`);

      try {
        const response = await fetch(watchUrl);
        if (!response.ok) throw new Error('Stream unavailable');
        const payload = await response.json();
        const normalized = normalizeStreamPayload(payload);
        if (!cancelled) {
          setStreamData(normalized);
          setSelectedQuality('auto');
          setSelectedSubtitle('');
        }
      } catch {
        // Try fallback `/sources` with a single retry
        const fallbackUrl = buildApiUrl(`sources?episodeId=${encodeURIComponent(selectedEpisode.id || '')}&provider=${parsed.provider}&anilistId=${params.id || ''}&category=${parsed.category}`);
        let got = false;
        for (let attempt = 0; attempt < 2 && !got; attempt++) {
          try {
            if (attempt) await new Promise((r) => setTimeout(r, 400));
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) throw new Error('fallback failed');
            const fallbackPayload = await fallbackResponse.json();
            const normalizedFallback = normalizeStreamPayload(fallbackPayload);
            if (!cancelled) {
              setStreamData(normalizedFallback);
              setSelectedQuality('auto');
              setSelectedSubtitle('');
            }
            got = true;
            break;
          } catch (e) {
            // continue to try other providers
          }
        }

        if (!got) {
          // Attempt other providers automatically by matching episode number
          const allProviders = Object.keys(episodesPayload?.providers || {});
          for (const otherProv of allProviders) {
            if (otherProv === parsed.provider) continue;
            const candidateList = (episodesPayload?.providers?.[otherProv]?.episodes || {})[parsed.category] || [];
            const matching = candidateList.find((ep: any) => ep.number === selectedEpisode.number);
            if (!matching) continue;
            const otherParsed = parseEpisodeId(matching.id);
            const tryUrl = buildApiUrl(`watch/${otherProv}/${params.id}/${otherParsed.category}/${otherParsed.slug}`);
            try {
              const r = await fetch(tryUrl);
              if (!r.ok) throw new Error('provider try failed');
              const p = await r.json();
              const norm = normalizeStreamPayload(p);
              if (!cancelled) {
                setStreamData(norm);
                setSelectedProvider(otherProv);
                setSelectedQuality('auto');
                setSelectedSubtitle('');
              }
              got = true;
              break;
            } catch (_) {
              continue;
            }
          }
        }

        if (!got) {
          if (!cancelled) {
            setStreamData(null);
            setError('Unable to load stream data for this episode. Try a different provider.');
          }
        }
      } finally {
        if (!cancelled) {
          setVideoLoading(false);
        }
      }
    };

    void loadStream();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, params.id, selectedEpisode]);

  // The reference player script manages playback events; avoid attaching listeners here to prevent duplication.

  // We do not attach Hls here; the reference player script will handle HLS sources.

  const title = useMemo(() => {
    return anime?.title?.english || anime?.title?.romaji || anime?.title?.native || 'Watch anime';
  }, [anime]);

  const qualityOptions = useMemo(() => {
    const streams = streamData?.streams || [];
    return Array.from(new Set(streams.map((item) => item.quality).filter(Boolean))) as string[];
  }, [streamData]);

  const subtitleOptions = streamData?.subtitles || [];

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const handleSkipIntro = () => {
    const video = videoRef.current;
    if (!video || !streamData?.intro) return;
    const start = streamData.intro.start || 0;
    const end = streamData.intro.end || 0;
    if (video.currentTime >= start && video.currentTime < end) {
      video.currentTime = end;
      setCurrentTime(end);
    }
  };

  const handleVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (video.requestFullscreen) {
      void video.requestFullscreen();
    }
  };

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value <= 0) return '00:00';
    const totalSeconds = Math.floor(value);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    // expose API base for the shim
    try {
      (window as any).__MIRURO_API_URL__ = apiBaseUrl || '';
      // verify the remote proxy exists before assigning it; fallback to '' if missing
      (async () => {
        try {
          // Probe a small, public VPS endpoint to check API reachability instead
          const probeUrl = buildApiUrl('spotlight');
          const probe = await fetch(probeUrl, { method: 'GET' });
          // Many servers may not implement HEAD correctly; accept 200 or 405 as reachable
          if (probe.ok || probe.status === 405) {
            (window as any).PROXY_BASE = buildApiUrl('proxy/hls');
          } else {
            (window as any).PROXY_BASE = '';
          }
        } catch (e) {
          (window as any).PROXY_BASE = '';
        }
      })();
    } catch {}

    // ensure URL contains ?id= so the reference script can read animeId
    try {
      const url = new URL(window.location.href);
      const qs = url.searchParams;
      if (!qs.get('id') && params.id) {
        qs.set('id', params.id);
        if (selectedEpisode?.number) qs.set('ep', String(selectedEpisode.number));
        const newPath = url.pathname + '?' + qs.toString();
        window.history.replaceState({}, '', newPath);
      }
    } catch {}

    const loadScript = (src: string) => new Promise<void>((res) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => res();
      s.onerror = () => res();
      document.body.appendChild(s);
    });

    void loadScript('https://cdn.jsdelivr.net/npm/hls.js@latest')
      .then(() => loadScript('/js/kurovexa-shim.js'))
      .then(() => loadScript('/js/anime.js'))
      .then(() => loadScript('/js/anime.full.js'))
      .then(() => setScriptsLoaded(true));

    // Cleanup function to stop video when component unmounts
    return () => {
      try {
        // Stop all video elements
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
          video.pause();
          video.src = '';
          video.load();
        });
        
        // Destroy HLS instance if exists
        if ((window as any).hlsInstance) {
          try {
            (window as any).hlsInstance.destroy();
            (window as any).hlsInstance = null;
          } catch (e) {
            console.warn('Failed to destroy HLS instance', e);
          }
        }
        
        // Clear player area
        const playerArea = document.getElementById('player-area');
        if (playerArea) {
          playerArea.innerHTML = '';
        }
      } catch (e) {
        console.warn('Cleanup error', e);
      }
    };
  }, [apiBaseUrl, params.id, selectedEpisode?.number]);

  // When a playable stream URL is available, instruct the reference player to play it.
  useEffect(() => {
    if (!streamUrl || !scriptsLoaded) return;
    
    // Setup error handler for automatic server switching
    const handlePlaybackError = async () => {
      console.log('[PanelDrop] Playback error detected, attempting to switch servers...');
      
      // Get all available providers
      const allProviders = Object.keys(episodesPayload?.providers || {});
      const currentProvider = selectedProvider;
      
      // Try each provider that isn't the current one
      for (const otherProv of allProviders) {
        if (otherProv === currentProvider) continue;
        
        const candidateList = (episodesPayload?.providers?.[otherProv]?.episodes || {})[selectedCategory] || [];
        const matching = candidateList.find((ep: any) => ep.number === selectedEpisode?.number);
        
        if (!matching) continue;
        
        const otherParsed = parseEpisodeId(matching.id);
        const tryUrl = buildApiUrl(`watch/${otherProv}/${params.id}/${otherParsed.category}/${otherParsed.slug}`);
        
        try {
          const r = await fetch(tryUrl);
          if (!r.ok) continue;
          const p = await r.json();
          const norm = normalizeStreamPayload(p);
          
          if (norm && norm.streams && norm.streams.length > 0) {
            console.log(`[PanelDrop] Successfully switched to provider: ${otherProv}`);
            setStreamData(norm);
            setSelectedProvider(otherProv);
            setSelectedQuality('auto');
            return; // Success! Stop trying other providers
          }
        } catch (err) {
          console.log(`[PanelDrop] Failed to switch to provider: ${otherProv}`, err);
          continue;
        }
      }
      
      // If we get here, all providers failed
      setError('All available servers failed to load. Please try again later.');
    };
    
    // Expose the error handler globally so the video player scripts can call it
    (window as any).__PANELDROP_SWITCH_SERVER = handlePlaybackError;
    
    try {
      const K = (window as any).Kurovexa || (window as any).KV_REF;
      if (K && typeof K.play === 'function') {
        K.play(streamUrl);
      } else if (K && typeof K.playStream === 'function') {
        K.playStream(streamUrl);
      } else {
        console.warn('Reference player API not ready yet');
      }
    } catch (e) {
      console.warn('Failed to call reference player API', e);
    }

    try {
      const R = (window as any).KV_REF;
      if (R && typeof R.renderIntroOutro === 'function') {
        R.renderIntroOutro(streamData?.intro || null, streamData?.outro || null);
      }
    } catch (e) {
      console.warn('Failed to render intro/outro markers', e);
    }
  }, [streamUrl, streamData, scriptsLoaded, episodesPayload, selectedProvider, selectedCategory, selectedEpisode, params.id]);

  // The reference player script will create and manage the player DOM and HLS instance.
  // We intentionally do not mount a second <video> or attach Hls here to avoid duplicate players.

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
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard! Share it with your friends 🎉');
              }).catch(() => {
                prompt('Copy this link:', url);
              });
            }}
            className="border-2 border-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            title="Share this anime"
          >
            Share
          </button>
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

      <main className="mx-auto max-w-[1500px] p-4 md:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setLocation(`/anime/${params.id || ''}`)}
            className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
          >
            ← Back to anime
          </button>
          <div className="border-2 border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            <span className="mr-2" style={{ color: accent }}>Now watching</span>
            <span className="font-manga-body">{title}</span>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-4">
            <div className="manga-panel overflow-hidden">
              <div className="kv-player relative aspect-video w-full bg-black">
                <div className={`kv-buffering ${videoLoading ? 'active' : ''}`}><div className="kv-spinner" /></div>
                <div id="player-area" style={{ width: '100%', height: '100%' }} />
                {videoLoading && !streamUrl ? (
                  <div className="absolute inset-0 animate-pulse bg-gray-800" />
                ) : null}
              </div>
            </div>

            <div className="manga-panel p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-manga-body text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
                    Episode {selectedEpisode?.number || '?'}
                  </p>
                  <h1 className="font-manga-title text-3xl uppercase tracking-wider mt-1">{selectedEpisode?.title || title}</h1>
                </div>
                <label className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  <input type="checkbox" checked={skipIntro} onChange={() => setSkipIntro((value) => !value)} />
                  Auto skip intro
                </label>
              </div>

              {error ? (
                <div className="mt-4 rounded border-2 border-black bg-[#fff5f1] p-3 text-sm font-bold uppercase tracking-[0.2em] text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded border-2 border-black bg-[#fff4ed] p-3">
                    <h2 className="font-manga-title text-xl uppercase tracking-wide">Server</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {providers.map((provider) => (
                        <button
                          key={provider}
                          type="button"
                          onClick={() => setSelectedProvider(provider)}
                          className={`border-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${selectedProvider === provider ? 'border-black bg-black text-white' : 'border-black bg-white text-black'}`}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.keys(episodesPayload?.providers?.[selectedProvider]?.episodes || {}).map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`border-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${selectedCategory === category ? 'border-black bg-black text-white' : 'border-black bg-white text-black'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded border-2 border-black bg-white p-3">
                    <h2 className="font-manga-title text-xl uppercase tracking-wide">Subtitles</h2>
                    {subtitleOptions.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {subtitleOptions.map((subtitle) => (
                          <button
                            key={subtitle.file || subtitle.label}
                            type="button"
                            onClick={() => setSelectedSubtitle(subtitle.label || 'Subtitle')}
                            className={`border-2 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${selectedSubtitle === (subtitle.label || 'Subtitle') ? 'border-black bg-black text-white' : 'border-black bg-white text-black'}`}
                          >
                            {subtitle.label || 'Subtitle'}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-gray-600">No subtitles available.</p>
                    )}
                  </div>
                </div>

                <div className="rounded border-2 border-black bg-white p-3">
                  <h2 className="font-manga-title text-xl uppercase tracking-wide">Current anime</h2>
                  <p className="mt-3 font-manga-body text-sm leading-7 text-gray-800">{stripHtml(anime?.title?.romaji || '')}</p>
                  <div className="mt-4 space-y-2 text-sm font-manga-body font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center justify-between border-b border-black/20 pb-2">
                      <span>Server</span>
                      <span>{selectedProvider || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-black/20 pb-2">
                      <span>Audio</span>
                      <span>{selectedCategory || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Episode</span>
                      <span>{selectedEpisode?.number || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="manga-panel overflow-hidden">
              <div className="border-b-4 border-black bg-[#111111] p-4 text-white">
                <p className="font-manga-body text-[10px] font-black uppercase tracking-[0.2em]">Episode list</p>
                <h2 className="font-manga-title text-2xl uppercase tracking-wider mt-1">Watch queue</h2>
              </div>
              <div className="max-h-[580px] overflow-y-auto p-3">
                {episodes.map((episode, idx) => (
                  <button
                    key={`${episode.id ?? episode.number ?? 'ep'}-${idx}`}
                    type="button"
                    onClick={() => setSelectedEpisode(episode)}
                    className={`mb-2 flex w-full items-start gap-3 border-2 p-3 text-left shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${selectedEpisode?.id === episode.id ? 'border-black bg-[#fff4ed]' : 'border-black bg-white'}`}
                  >
                    <div className="min-w-[44px] rounded border-2 border-black bg-black px-2 py-1 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      {episode.number || '•'}
                    </div>
                    <div className="flex-1">
                      <p className="font-manga-body text-sm font-black uppercase leading-tight">{episode.title || `Episode ${episode.number || ''}`}</p>
                      {episode.airDate ? <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">{episode.airDate}</p> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="manga-border-top text-white mt-8 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: accent }}>
        <div className="manga-speedlines opacity-20 mix-blend-overlay" />
        <div className="manga-halftone opacity-30" />
        <div className="max-w-[1500px] mx-auto px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <img src="/sitelogo.png" alt="PanelDrop" className="h-12 w-auto" />
              <h2 className="font-manga-title text-6xl tracking-widest drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">PANELDROP</h2>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Read. Watch. Experience.</p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                <button type="button" onClick={() => setLocation('/')} className="border-2 border-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">Home</button>
                <button type="button" onClick={() => setLocation(`/anime/${params.id || ''}`)} className="border-2 border-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors">Anime</button>
              </div>
              <div className="bg-white text-black font-manga-title tracking-wider px-4 py-1 border-2 border-black text-sm shadow-[2px_2px_0_0_rgba(0,0,0,1)] transform -rotate-2">
                Built by elliecodelab
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="manga-speech-bubble bg-white text-black font-manga-title text-2xl px-6 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transform rotate-2">
                PanelDrop
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
