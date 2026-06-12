import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_DATA, Category } from '@/data/content';
import '@/styles/manga.css';

export default function Home() {
  const [active, setActive] = useState<Category>('Anime');
  const data = CATEGORY_DATA[active];
  const accent = data.accent;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-manga-body text-black selection:text-white" style={{ '--accent': accent } as React.CSSProperties}>
      
      {/* Navigation */}
      <nav className="flex w-full manga-border-bottom bg-white relative z-50 sticky top-0">
        <div className="flex-none px-6 py-4 manga-border-right flex items-center justify-center text-white transition-colors duration-300" style={{ backgroundColor: accent }}>
          <span className="font-manga-title text-2xl tracking-widest uppercase">PanelDrop</span>
        </div>
        <div className="flex-1 flex overflow-x-auto no-scrollbar">
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
        <div className="flex-none px-4 py-4 manga-border-left flex items-center justify-center hover:bg-gray-100 cursor-pointer transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 flex flex-col gap-6 mt-4">

        {/* Row 1: Hero + Top 10 */}
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[460px]">

          {/* Hero Panel */}
          <div className="manga-panel flex-[2] group cursor-pointer min-h-[400px] lg:min-h-full flex flex-col justify-end p-8 relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${data.hero.image})` }}
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
                {data.hero.tag}
              </div>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-white px-2 py-0.5 border-2 border-black" style={{ color: accent }}>
                {data.hero.subtitle}
              </p>
              <h1 className="font-manga-title text-5xl sm:text-6xl md:text-7xl leading-none text-black mt-1" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
                {data.hero.title}
              </h1>
              <p className="font-manga-body font-bold text-base max-w-lg bg-black text-white p-3 mt-2 border-2 border-black border-l-4 border-b-4">
                {data.hero.synopsis}
              </p>
              <button
                className="mt-4 font-manga-title text-xl px-8 py-3 border-4 border-black text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                style={{ backgroundColor: accent }}
              >
                Watch Now
              </button>
            </div>
          </div>

          {/* Top 10 Panel */}
          <div className="manga-panel flex-1 h-[400px] lg:h-full flex flex-col">
            <div className="manga-halftone" />
            <div className="manga-border-bottom p-4 text-white relative z-10" style={{ backgroundColor: accent }}>
              <h2 className="font-manga-title text-2xl tracking-wide">TOP 10 THIS WEEK</h2>
            </div>
            <div className="flex-1 overflow-y-auto relative z-10 flex flex-col bg-white/90">
              {data.top10.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center p-3 hover:text-white transition-colors cursor-pointer manga-border-bottom last:border-b-0 group"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = accent; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = ''; }}
                >
                  <div className="font-manga-title text-3xl w-10 text-center opacity-60 group-hover:opacity-100 transition-opacity">{i + 1}</div>
                  <div className="flex-1 pl-2">
                    <div className="font-bold text-base leading-tight uppercase tracking-tight">{item.title}</div>
                    <div className="text-xs opacity-60 mt-0.5 font-bold uppercase">{item.views}</div>
                  </div>
                </div>
              ))}
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

        {/* Featured Row */}
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">Featured {active}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.featured.map((item, i) => (
              <div key={i} className="manga-panel h-[240px] group cursor-pointer relative flex items-end p-4 overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow">
                
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-70 mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300 mix-blend-multiply"
                  style={{ backgroundColor: accent }}
                />
                
                <div className="manga-speedlines opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="relative z-10 bg-white border-4 border-black p-3 translate-y-1 group-hover:-translate-y-1 transition-transform w-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <h3 className="font-manga-title text-2xl uppercase leading-none">{item.title}</h3>
                  <p className="font-manga-body font-black text-xs mt-2 text-white inline-block px-2 py-1 uppercase tracking-wider border-2 border-black" style={{ backgroundColor: accent }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-10 border-4 border-black" style={{ backgroundColor: accent }} />
            <h2 className="font-manga-title text-4xl uppercase tracking-wider">Browse {active}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.grid.map((item, i) => (
              <div key={i} className="manga-panel aspect-[2/3] group cursor-pointer relative overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                
                <div 
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 opacity-80 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-300 mix-blend-multiply"
                  style={{ backgroundColor: accent }}
                />
                
                <div className="manga-shading opacity-30 group-hover:opacity-50 transition-opacity absolute inset-0" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t-4 border-black bg-white z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-manga-title text-xl uppercase leading-none truncate">{item.title}</h4>
                </div>
                
                <div className="absolute top-2 right-2 z-10 bg-white border-2 border-black font-manga-body text-xs font-black px-2 py-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                  {item.badge ?? 'HD'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="manga-border-top text-white mt-16 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: accent }}>
        <div className="manga-speedlines opacity-20 mix-blend-overlay" />
        <div className="manga-halftone opacity-30" />
        
        <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Left */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
              <h2 className="font-manga-title text-6xl tracking-widest drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">PANELDROP</h2>
              <p className="font-manga-body font-black text-sm uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Read. Watch. Experience.</p>
              <p className="font-manga-body text-xs mt-2 opacity-80 font-bold">© 2025 elliecodelab. All rights reserved.</p>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className="font-manga-body font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black px-3 py-1 border-2 border-transparent hover:border-black transition-colors"
                  >
                    {cat}
                  </button>
                ))}
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
