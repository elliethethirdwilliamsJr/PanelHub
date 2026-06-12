import React, { useEffect, useState } from 'react';
import './_hud.css';

export function HUD() {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const feedItems = [
    { title: 'Demon Slayer Ep 12', type: 'anime', color: '#00f5d4', progress: 100 },
    { title: 'Solo Leveling Ch. 198', type: 'manga', color: '#7b2fff', progress: 100 },
    { title: 'Dune: Part Two', type: 'film', color: '#ff3a6e', progress: 45 },
    { title: 'The Bear S3', type: 'series', color: '#ffffff', progress: 82 },
    { title: 'Jujutsu Kaisen Ep 45', type: 'anime', color: '#00f5d4', progress: 12 },
    { title: 'Oppenheimer', type: 'film', color: '#ff3a6e', progress: 100 },
    { title: 'Severance S2', type: 'series', color: '#ffffff', progress: 5 },
  ];

  const categories = [
    {
      id: 'ANIME',
      title: '// ANIME DATABASE //',
      items: [
        { title: 'ATTACK ON TITAN', year: '2013', genre: 'ACTION', rating: '9.0' },
        { title: 'CHAINSAW MAN', year: '2022', genre: 'ACTION', rating: '8.5' },
        { title: 'BLUE LOCK', year: '2022', genre: 'SPORTS', rating: '8.4' },
        { title: 'SPY X FAMILY', year: '2022', genre: 'COMEDY', rating: '8.4' },
        { title: 'VINLAND SAGA', year: '2019', genre: 'DRAMA', rating: '8.8' },
      ]
    },
    {
      id: 'MANGA',
      title: '// MANGA DATABASE //',
      items: [
        { title: 'SOLO LEVELING', year: '2018', genre: 'ACTION', rating: '8.7' },
        { title: 'BERSERK', year: '1989', genre: 'DARK FANTASY', rating: '9.4' },
        { title: 'ONE PIECE', year: '1997', genre: 'ADVENTURE', rating: '9.2' },
        { title: 'VAGABOND', year: '1998', genre: 'HISTORICAL', rating: '9.0' },
        { title: 'DUNGEON MESHI', year: '2014', genre: 'FANTASY', rating: '8.5' },
      ]
    },
    {
      id: 'FILMS',
      title: '// FILMS DATABASE //',
      items: [
        { title: 'OPPENHEIMER', year: '2023', genre: 'BIOGRAPHY', rating: '8.4' },
        { title: 'PARASITE', year: '2019', genre: 'THRILLER', rating: '8.5' },
        { title: 'INTERSTELLAR', year: '2014', genre: 'SCI-FI', rating: '8.7' },
        { title: 'BLADE RUNNER 2049', year: '2017', genre: 'SCI-FI', rating: '8.0' },
        { title: 'GRAVE OF THE FIREFLIES', year: '1988', genre: 'DRAMA', rating: '8.5' },
      ]
    },
    {
      id: 'SERIES',
      title: '// SERIES DATABASE //',
      items: [
        { title: 'THE LAST OF US', year: '2023', genre: 'DRAMA', rating: '8.8' },
        { title: 'SEVERANCE', year: '2022', genre: 'THRILLER', rating: '8.7' },
        { title: 'SHOGUN', year: '2024', genre: 'DRAMA', rating: '8.8' },
        { title: 'THE BEAR', year: '2022', genre: 'DRAMA', rating: '8.6' },
        { title: 'DARK', year: '2017', genre: 'SCI-FI', rating: '8.7' },
      ]
    }
  ];

  return (
    <div className="hud-theme">
      <div className="hud-grid-bg" />
      <div className="hud-scanlines" />

      <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-8 max-w-7xl mx-auto gap-6">
        
        {/* TOP NAV BAR */}
        <header className="flex items-center justify-between border-b border-[#00f5d4]/30 pb-4">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold text-[#00f5d4] hud-font-display tracking-widest flex items-center">
              NEXUS<span className="hud-cursor ml-2"></span>
            </div>
            
            <nav className="hidden md:flex gap-6 text-sm">
              {['ANIME', 'MANGA', 'FILMS', 'SERIES'].map((tab, i) => (
                <button key={tab} className={`relative px-2 py-1 tracking-wider hover:text-[#00f5d4] transition-colors ${i === 0 ? 'text-[#00f5d4] hud-text-glow' : 'text-[#c8e6f5]/70'}`}>
                  [{tab}]
                  {i === 0 && <div className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-[#00f5d4] hud-glow-primary" />}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-4 text-xs tracking-widest text-[#00f5d4]">
            <div className="flex items-end gap-1 h-4">
              <div className="w-1 h-2 bg-[#00f5d4]"></div>
              <div className="w-1 h-3 bg-[#00f5d4]"></div>
              <div className="w-1 h-4 bg-[#00f5d4]"></div>
              <div className="w-1 h-4 bg-[#00f5d4] opacity-50"></div>
            </div>
            <span>99.7% ONLINE</span>
            <span className="text-[#c8e6f5]/50 ml-4 hidden sm:inline">{time}</span>
          </div>
        </header>

        {/* MAIN CONTENT ROW */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* HERO PANEL */}
          <div className="flex-1 hud-panel border border-[#00f5d4]/50 p-8 hud-pulse-border relative">
            <div className="hud-brackets" />
            <div className="hud-brackets-inner" />
            
            <div className="flex flex-col gap-6 h-full justify-center relative z-10">
              <div className="text-[#ff3a6e] text-sm tracking-[0.3em] font-bold">
                ► PRIMARY TARGET ACQUIRED
              </div>
              
              <h1 className="text-4xl md:text-6xl text-white hud-font-display font-bold leading-none tracking-wider hud-text-glow">
                JUJUTSU KAISEN<br/>
                <span className="text-3xl md:text-4xl text-[#00f5d4] mt-2 block">— SEASON 3</span>
              </h1>
              
              <div className="flex flex-col gap-2 border-l-2 border-[#00f5d4] pl-4 text-sm md:text-base text-[#c8e6f5]/80">
                <p>&gt; CLASSIFICATION: <span className="text-white">ANIME</span></p>
                <p>&gt; STUDIO: <span className="text-white">MAPPA</span></p>
                <p>&gt; EPISODES: <span className="text-white">21</span></p>
                <p>&gt; STATUS: <span className="text-[#00f5d4]">AIRING</span></p>
              </div>
              
              <button className="hud-cta border border-[#00f5d4] text-[#00f5d4] px-8 py-4 w-fit mt-4 text-lg tracking-widest font-bold transition-all relative group overflow-hidden">
                <span className="relative z-10">[ ACCESS NOW ]</span>
              </button>
            </div>
          </div>

          {/* SIDE DATA PANEL */}
          <div className="w-full lg:w-[35%] hud-panel border border-[#7b2fff]/40 p-6 hud-panel-secondary flex flex-col relative">
            <div className="hud-brackets" />
            <div className="hud-brackets-inner" />
            
            <div className="text-[#7b2fff] text-sm tracking-[0.2em] font-bold mb-4 border-b border-[#7b2fff]/30 pb-2">
              ACTIVE FEED // PRIORITY QUEUE
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto hud-scrollbar flex-1 max-h-[300px] lg:max-h-full pr-2">
              {feedItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                      <span className="text-[#c8e6f5] truncate">{item.title}</span>
                    </div>
                    <span className="text-[#c8e6f5]/50">{item.progress}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-[#050d13] relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out" style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORY GRID */}
        <div className="flex flex-col gap-8 mt-4">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="text-[#00f5d4] tracking-widest text-sm whitespace-nowrap">
                  {category.title}
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#00f5d4]/50 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {category.items.map((item, i) => (
                  <div key={i} className="hud-panel border border-[#00f5d4]/30 p-4 hover:border-[#00f5d4] transition-colors cursor-pointer group relative">
                    <div className="hud-brackets opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="hud-brackets-inner opacity-30 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="text-xs text-[#00f5d4]/50 mb-2">ENTRY #{i.toString().padStart(4, '0')}</div>
                    <div className="font-bold text-white tracking-wider mb-4 truncate group-hover:hud-text-glow">{item.title}</div>
                    
                    <div className="flex flex-col gap-1 text-[10px] text-[#c8e6f5]/60">
                      <div className="flex justify-between">
                        <span>YR: {item.year}</span>
                        <span>RT: {item.rating}</span>
                      </div>
                      <div>GN: {item.genre}</div>
                    </div>
                    
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-[#00f5d4]/0 group-hover:bg-[#00f5d4]/5 transition-colors pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* FOOTER STATUS BAR */}
      <footer className="fixed bottom-0 w-full bg-[#050d13] border-t border-[#00f5d4]/30 p-1 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-[#00f5d4]/70 tracking-widest px-4">
          <span>NEXUS v4.2.1 | CONNECTED TO 8,412,333 TITLES</span>
          <span className="hidden sm:inline">LAST SYNC: 00:00:04 AGO | ALL SYSTEMS NOMINAL</span>
        </div>
      </footer>
    </div>
  );
}
