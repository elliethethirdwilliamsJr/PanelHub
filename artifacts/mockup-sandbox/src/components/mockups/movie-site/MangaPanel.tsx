import React, { useState } from 'react';
import './_manga-styles.css';

type Category = 'Anime' | 'Manga' | 'Movies' | 'Shows';

const CATEGORIES: Category[] = ['Anime', 'Manga', 'Movies', 'Shows'];

const CATEGORY_DATA: Record<Category, {
  accent: string;
  hero: { title: string; subtitle: string; tag: string; synopsis: string };
  top10: { title: string; views: string }[];
  banner: { text: string; cta: string };
  featured: { title: string; sub: string }[];
  grid: { title: string; badge: string }[];
}> = {
  Anime: {
    accent: '#E63946',
    hero: {
      title: 'JUJUTSU KAISEN',
      subtitle: 'SEASON 3',
      tag: 'STREAMING NOW',
      synopsis: 'The Culling Game begins. Yuji and Megumi enter the barrier to save Tsumiki.',
    },
    top10: [
      { title: 'Solo Leveling', views: '2.4M Views' },
      { title: 'Frieren: Beyond Journey\'s End', views: '1.8M Views' },
      { title: 'One Piece', views: '1.5M Views' },
      { title: 'Attack on Titan', views: '1.2M Views' },
      { title: 'Chainsaw Man', views: '980K Views' },
      { title: 'Demon Slayer', views: '870K Views' },
      { title: 'Spy x Family', views: '760K Views' },
    ],
    banner: { text: 'NEW EPISODES DROP EVERY SATURDAY!', cta: 'Watch Now' },
    featured: [
      { title: 'Demon Slayer', sub: 'Swordsmith Village Arc' },
      { title: 'Vinland Saga', sub: 'Season 2 Complete' },
      { title: 'Spy x Family', sub: 'Code: White Movie' },
    ],
    grid: [
      { title: 'Blue Lock', badge: 'NEW' },
      { title: 'Akira', badge: '4K' },
      { title: 'Cowboy Bebop', badge: 'HD' },
      { title: 'Fullmetal Alchemist', badge: 'HD' },
      { title: 'Neon Genesis Evangelion', badge: 'HD' },
      { title: 'Hunter x Hunter', badge: 'HD' },
      { title: 'Steins;Gate', badge: 'HD' },
      { title: 'Mob Psycho 100', badge: 'NEW' },
    ],
  },
  Manga: {
    accent: '#1D3557',
    hero: {
      title: 'BERSERK',
      subtitle: 'DELUXE EDITION',
      tag: 'CHAPTER 374 OUT NOW',
      synopsis: 'Guts and the Band of the Hawk face their ultimate fate in the Eclipse. Kentaro Miura\'s masterpiece.',
    },
    top10: [
      { title: 'One Piece', views: '3.1M Reads' },
      { title: 'Berserk', views: '2.7M Reads' },
      { title: 'Solo Leveling', views: '2.2M Reads' },
      { title: 'Vagabond', views: '1.9M Reads' },
      { title: 'Dungeon Meshi', views: '1.6M Reads' },
      { title: 'Vinland Saga', views: '1.3M Reads' },
      { title: 'Tokyo Ghoul', views: '1.1M Reads' },
    ],
    banner: { text: 'CHAPTER 124 JUST DROPPED — READ FREE!', cta: 'Read Chapter' },
    featured: [
      { title: 'Solo Leveling', sub: 'Season 2: Arise from the Shadow' },
      { title: 'Dungeon Meshi', sub: 'Delicious in Dungeon Vol. 14' },
      { title: 'Vagabond', sub: 'Inoue\'s Samurai Epic' },
    ],
    grid: [
      { title: 'Berserk', badge: 'CLASSIC' },
      { title: 'Goodnight Punpun', badge: 'MATURE' },
      { title: 'Blue Period', views: 'ART' } as any,
      { title: 'Oyasumi Punpun', badge: 'MATURE' },
      { title: 'I Am a Hero', badge: 'HORROR' },
      { title: 'Golden Kamuy', badge: 'HD' },
      { title: 'Dorohedoro', badge: 'DARK' },
      { title: 'Pluto', badge: 'SCI-FI' },
    ],
  },
  Movies: {
    accent: '#2d2d2d',
    hero: {
      title: 'OPPENHEIMER',
      subtitle: '2023',
      tag: 'AWARD WINNER',
      synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    },
    top10: [
      { title: 'Oppenheimer', views: '4.1M Views' },
      { title: 'Parasite', views: '3.5M Views' },
      { title: 'Blade Runner 2049', views: '2.9M Views' },
      { title: 'Dune: Part Two', views: '2.6M Views' },
      { title: 'Interstellar', views: '2.4M Views' },
      { title: 'Everything Everywhere All at Once', views: '2.1M Views' },
      { title: 'The Grand Budapest Hotel', views: '1.8M Views' },
    ],
    banner: { text: 'DUNE: PART TWO — NOW STREAMING IN 4K IMAX!', cta: 'Watch Now' },
    featured: [
      { title: 'Grave of the Fireflies', sub: 'Studio Ghibli · 1988' },
      { title: 'Parasite', sub: 'Bong Joon-ho · Palme d\'Or' },
      { title: 'Perfect Blue', sub: 'Satoshi Kon · Thriller' },
    ],
    grid: [
      { title: 'Interstellar', badge: '4K' },
      { title: 'Ghost in the Shell', badge: 'CLASSIC' },
      { title: 'The Matrix', badge: '4K' },
      { title: 'Princess Mononoke', badge: 'GHIBLI' },
      { title: 'Your Name', badge: 'ANIME' },
      { title: 'Blade Runner 2049', badge: '4K' },
      { title: 'Akira', badge: 'CLASSIC' },
      { title: 'Spirited Away', badge: 'GHIBLI' },
    ],
  },
  Shows: {
    accent: '#6a0572',
    hero: {
      title: 'THE LAST OF US',
      subtitle: 'SEASON 2',
      tag: 'SERIES PREMIERE',
      synopsis: 'Five years after the events of the first season, Joel and Ellie are drawn into conflict with each other.',
    },
    top10: [
      { title: 'The Last of Us', views: '5.2M Views' },
      { title: 'Severance', views: '4.4M Views' },
      { title: 'Shogun', views: '3.8M Views' },
      { title: 'The Bear', views: '3.3M Views' },
      { title: 'Dark', views: '2.9M Views' },
      { title: 'Succession', views: '2.5M Views' },
      { title: 'Breaking Bad', views: '2.2M Views' },
    ],
    banner: { text: 'SHOGUN SEASON 2 — EPISODES DROP WEEKLY!', cta: 'Start Watching' },
    featured: [
      { title: 'Severance', sub: 'Season 2 · Apple TV+' },
      { title: 'Shogun', sub: 'FX · Historical Drama' },
      { title: 'Dark', sub: 'Netflix · Sci-Fi Thriller' },
    ],
    grid: [
      { title: 'The Bear', badge: 'NEW' },
      { title: 'Succession', badge: 'COMPLETE' },
      { title: 'Breaking Bad', badge: 'CLASSIC' },
      { title: 'Dark', badge: 'SCI-FI' },
      { title: 'Arcane', badge: 'ANIMATED' },
      { title: 'Chernobyl', badge: 'MINISERIES' },
      { title: 'True Detective', badge: 'CRIME' },
      { title: 'Andor', badge: 'SCI-FI' },
    ],
  },
};

export function MangaPanel() {
  const [active, setActive] = useState<Category>('Anime');
  const data = CATEGORY_DATA[active];
  const accent = data.accent;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-manga-body text-black selection:text-white" style={{ '--accent': accent } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=DM+Sans:opsz,wght@9..40,400;500;700;900&display=swap');
      `}} />

      {/* Navigation */}
      <nav className="flex w-full manga-border-bottom bg-white relative z-20 sticky top-0">
        <div className="flex-none px-6 py-4 manga-border-right flex items-center justify-center text-white transition-colors duration-300" style={{ backgroundColor: accent }}>
          <span className="font-manga-title text-2xl tracking-widest uppercase">PanelDrop</span>
        </div>
        <div className="flex-1 flex overflow-x-auto">
          {CATEGORIES.map((tab, i) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                onClick={() => setActive(tab)}
                className={`flex-1 min-w-[80px] px-4 py-4 font-manga-title text-xl uppercase transition-all duration-200 relative ${i !== CATEGORIES.length - 1 ? 'manga-border-right' : ''}`}
                style={{
                  backgroundColor: isActive ? accent : 'white',
                  color: isActive ? 'white' : 'black',
                }}
              >
                {tab}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 w-full h-1"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex-none px-4 py-4 manga-border-left flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 flex flex-col gap-4">

        {/* Row 1: Hero + Top 10 */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[460px]">

          {/* Hero Panel */}
          <div className="manga-panel flex-[2] group cursor-pointer h-[380px] lg:h-full flex flex-col justify-end p-8 relative overflow-hidden">
            <div className="manga-speedlines opacity-30 group-hover:opacity-50 transition-opacity" />
            <div
              className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              style={{ backgroundColor: accent }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />

            <div className="relative z-10 flex flex-col items-start gap-2">
              <div
                className="manga-speech-bubble px-4 py-2 mb-1 -rotate-2 font-manga-title text-lg"
                style={{ backgroundColor: accent, color: 'white', borderColor: 'black' }}
              >
                {data.hero.tag}
              </div>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest" style={{ color: accent }}>
                {data.hero.subtitle}
              </p>
              <h1 className="font-manga-title text-6xl md:text-7xl leading-none text-black">
                {data.hero.title}
              </h1>
              <p className="font-manga-body font-bold text-base max-w-lg bg-black text-white p-2 mt-1">
                {data.hero.synopsis}
              </p>
              <button
                className="mt-3 font-manga-title text-xl px-6 py-2 border-4 border-black text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: accent }}
              >
                Watch Now
              </button>
            </div>
          </div>

          {/* Top 10 Panel */}
          <div className="manga-panel flex-1 h-auto lg:h-full flex flex-col">
            <div className="manga-halftone" />
            <div className="manga-border-bottom p-4 text-white relative z-10" style={{ backgroundColor: accent }}>
              <h2 className="font-manga-title text-2xl">TOP 10 THIS WEEK</h2>
            </div>
            <div className="flex-1 overflow-y-auto relative z-10 flex flex-col">
              {data.top10.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 hover:text-white transition-colors cursor-pointer manga-border-bottom last:border-b-0"
                  style={{ ['--hover-bg' as any]: accent }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = accent; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
                >
                  <div className="font-manga-title text-3xl w-10 text-center opacity-60">{i + 1}</div>
                  <div className="flex-1 pl-2">
                    <div className="font-bold text-base leading-tight">{item.title}</div>
                    <div className="text-xs opacity-60 mt-0.5">{item.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div
          className="manga-panel w-full text-white p-5 relative overflow-hidden transform -skew-x-3 scale-x-105"
          style={{ backgroundColor: accent }}
        >
          <div className="manga-shading absolute inset-0 opacity-20" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between transform skew-x-3 gap-3">
            <h2 className="font-manga-title text-3xl md:text-4xl uppercase">{data.banner.text}</h2>
            <button className="border-4 border-black bg-white text-black font-manga-title text-xl px-6 py-2 hover:bg-black hover:text-white transition-colors uppercase whitespace-nowrap">
              {data.banner.cta}
            </button>
          </div>
        </div>

        {/* Featured Row */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-3xl uppercase">Featured {active}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.featured.map((item, i) => (
              <div key={i} className="manga-panel h-[220px] group cursor-pointer relative flex items-end p-4 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-25 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />
                <div className="manga-speedlines opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="manga-halftone opacity-30" />
                <div className="relative z-10 bg-white border-4 border-black p-3 translate-y-1 group-hover:-translate-y-1 transition-transform w-full">
                  <h3 className="font-manga-title text-2xl uppercase leading-none">{item.title}</h3>
                  <p className="font-manga-body font-bold text-xs mt-1 text-white inline-block px-2 py-0.5" style={{ backgroundColor: accent }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-8 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-3xl uppercase">Browse {active}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.grid.map((item, i) => (
              <div key={i} className="manga-panel aspect-[3/4] group cursor-pointer relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                  style={{ backgroundColor: accent }}
                />
                <div className="manga-shading opacity-10 group-hover:opacity-20 transition-opacity absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t-4 border-black bg-white z-10">
                  <h4 className="font-manga-title text-xl uppercase leading-none truncate">{item.title}</h4>
                </div>
                <div className="absolute top-2 right-2 z-10 bg-white border-2 border-black font-manga-body text-xs font-black px-2 py-0.5">
                  {item.badge ?? 'HD'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="manga-border-top text-white p-8 mt-10 text-center relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: accent }}>
        <div className="manga-speedlines opacity-10" />
        <div className="relative z-10 flex flex-col items-center justify-center">
          <h2 className="font-manga-title text-5xl tracking-widest">PANELDROP</h2>
          <div className="flex gap-6 mt-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="font-manga-body font-black text-sm uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="font-manga-body text-xs mt-4 opacity-50 uppercase tracking-widest">Read. Watch. Experience.</p>
        </div>
      </footer>
    </div>
  );
}
