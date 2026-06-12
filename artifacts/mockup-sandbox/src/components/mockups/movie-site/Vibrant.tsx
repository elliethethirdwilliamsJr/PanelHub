import React from "react";
import { Play, Info, Flame, ChevronRight, Star, Clock, Heart } from "lucide-react";
import "./_vibrant.css";
// @ts-ignore
import heroImg from "../../../assets/images/vibrant-hero.png";

const CONTENT_SECTIONS = [
  {
    title: "Trending Now",
    icon: <Flame className="w-6 h-6 text-[#ff5e00]" />,
    items: [
      { title: "Spy x Family", type: "Anime", rating: "9.8", color: "pink", imgId: 101 },
      { title: "Solo Leveling", type: "Manga", rating: "9.9", color: "blue", imgId: 102 },
      { title: "Severance", type: "Show", rating: "9.5", color: "purple", imgId: 103 },
      { title: "Blue Lock", type: "Anime", rating: "9.4", color: "blue", imgId: 104 },
      { title: "Dune: Part Two", type: "Movie", rating: "9.6", color: "orange", imgId: 105 },
    ]
  },
  {
    title: "New Releases",
    icon: <Clock className="w-6 h-6 text-[#00f3ff]" />,
    items: [
      { title: "My Hero Academia", type: "Anime", rating: "9.2", color: "blue", imgId: 201 },
      { title: "Interstellar", type: "Movie", rating: "9.7", color: "purple", imgId: 202 },
      { title: "Jujutsu Kaisen", type: "Manga", rating: "9.9", color: "pink", imgId: 203 },
      { title: "Cyberpunk: Edgerunners", type: "Anime", rating: "9.8", color: "orange", imgId: 204 },
      { title: "Arcane", type: "Show", rating: "10.0", color: "purple", imgId: 205 },
    ]
  }
];

const TOP_100 = [
  { rank: 1, title: "Fullmetal Alchemist: Brotherhood", views: "2.4M" },
  { rank: 2, title: "Attack on Titan", views: "2.1M" },
  { rank: 3, title: "Breaking Bad", views: "1.9M" },
  { rank: 4, title: "One Piece", views: "1.8M" },
  { rank: 5, title: "Hunter x Hunter", views: "1.6M" },
];

export function Vibrant() {
  return (
    <div className="vibrant-theme min-h-screen overflow-x-hidden flex flex-col relative grid-bg">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-3xl font-bold font-display text-white tracking-wider cursor-pointer">
            OTAKU<span className="text-neon-pink">FIRE</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="text-white hover:text-[#00f3ff] transition-colors">Anime</a>
            <a href="#" className="text-white hover:text-[#ff0055] transition-colors">Manga</a>
            <a href="#" className="text-white hover:text-[#b026ff] transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-[#ff5e00] transition-colors">Shows</a>
            <a href="#" className="flex items-center gap-1 text-[#00f3ff] hover:text-white transition-colors">
              <Star className="w-4 h-4 fill-current" /> Top 100
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff0055] to-[#b026ff] p-[2px] cursor-pointer">
            <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=OtakuUser&backgroundColor=transparent`} alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-end pb-20 pt-32 px-6 md:px-12 lg:px-24">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 z-0">
          <img src={heroImg} alt="Hero Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 hero-gradient z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-4xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-neon-pink text-white text-xs font-bold uppercase tracking-widest rounded-sm">
              Season Premiere
            </span>
            <span className="text-[#00f3ff] font-bold tracking-widest text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
              DROPS TONIGHT
            </span>
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-2xl">
            CHAINSAW <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0055] to-[#ff5e00]">MAN</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl font-light">
            Denji is robbed of a normal teenage life, left with nothing but his deadbeat father's overwhelming debt. His only companion is his pet, the chainsaw devil Pochita.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button className="bg-neon-pink text-white px-8 py-4 font-bold tracking-wider uppercase flex items-center gap-3 hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,0,85,0.6)]">
              <Play className="w-5 h-5 fill-current" />
              Stream Now
            </button>
            <button className="border-neon-blue text-white px-8 py-4 font-bold tracking-wider uppercase flex items-center gap-3 hover:bg-white/5 transition-colors">
              <Info className="w-5 h-5" />
              Watch Trailer
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative z-20 px-6 md:px-12 lg:px-24 py-12 flex flex-col gap-20">
        
        {/* Carousels */}
        {CONTENT_SECTIONS.map((section, idx) => (
          <section key={idx} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl md:text-4xl text-white flex items-center gap-3">
                {section.icon}
                {section.title}
              </h2>
              <button className="text-[#a0a0a0] hover:text-white uppercase font-bold text-sm tracking-wider flex items-center gap-1 group">
                View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
              {section.items.map((item, i) => (
                <div key={i} className="min-w-[280px] w-[280px] flex-shrink-0 snap-start group cursor-pointer relative">
                  <div className="w-full aspect-[2/3] bg-[var(--bg-card)] rounded-md overflow-hidden relative card-hover-glow">
                    {/* Placeholder for Poster Art using CSS gradients to look dynamic */}
                    <div className={`w-full h-full bg-gradient-to-br 
                      ${item.color === 'pink' ? 'from-[#4a0018] to-[#1a0008]' : 
                        item.color === 'blue' ? 'from-[#002a33] to-[#000d11]' : 
                        item.color === 'purple' ? 'from-[#2d004d] to-[#0f001a]' : 
                        'from-[#4d1c00] to-[#1a0900]'} 
                      flex items-center justify-center p-6 relative`}
                    >
                      {/* Decorative abstract shapes */}
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] opacity-40 rounded-full
                        ${item.color === 'pink' ? 'bg-[#ff0055]' : 
                        item.color === 'blue' ? 'bg-[#00f3ff]' : 
                        item.color === 'purple' ? 'bg-[#b026ff]' : 
                        'bg-[#ff5e00]'}`} 
                      />
                      <h3 className="text-3xl text-center text-white/80 font-bold z-10 leading-tight group-hover:text-white transition-colors">{item.title}</h3>
                    </div>
                    
                    {/* Overlay UI */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm text-black
                        ${item.color === 'pink' ? 'bg-[#ff0055]' : 
                        item.color === 'blue' ? 'bg-[#00f3ff]' : 
                        item.color === 'purple' ? 'bg-[#b026ff]' : 
                        'bg-[#ff5e00]'}`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#00ff66] font-bold text-sm">
                        <Star className="w-4 h-4 fill-current" /> {item.rating}
                      </div>
                      <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Heart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Two Column Section: Top 100 & Featured Categories */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Top 100 Leaderboard */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
            <h2 className="text-3xl text-white flex items-center gap-3">
              <Star className="w-6 h-6 text-[#b026ff] fill-current" />
              All-Time Legends
            </h2>
            <div className="flex flex-col gap-4">
              {TOP_100.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-[var(--bg-card)] border border-white/5 hover:border-[#b026ff]/30 transition-colors cursor-pointer group">
                  <div className="text-5xl font-bold rank-number group-hover:-translate-y-1 transition-transform w-12 text-center">
                    {item.rank}
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-[#b026ff] transition-colors line-clamp-1">{item.title}</h4>
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{item.views} Views</span>
                  </div>
                  <button className="text-[#a0a0a0] group-hover:text-white">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-4 border border-white/10 text-white font-bold tracking-wider uppercase hover:bg-white/5 transition-colors mt-2">
              Full Leaderboard
            </button>
          </div>

          {/* Featured Promo Area */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-3xl text-white">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              
              {/* Promo Card 1 */}
              <div className="relative rounded-lg overflow-hidden group cursor-pointer border border-white/10 min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0033] to-[#000000] z-0" />
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity grid-bg z-0" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f3ff] blur-[100px] opacity-20 rounded-full z-0" />
                
                <div className="relative z-10 p-8 flex flex-col justify-end h-full w-full">
                  <h3 className="text-4xl text-white mb-2 group-hover:text-[#00f3ff] transition-colors">CYBERPUNK VISIONS</h3>
                  <p className="text-[var(--text-muted)] mb-6">Explore the neon-drenched futures of the best sci-fi anime and movies.</p>
                  <button className="self-start text-[#00f3ff] uppercase font-bold tracking-widest text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    Explore Collection <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Promo Card 2 */}
              <div className="relative rounded-lg overflow-hidden group cursor-pointer border border-white/10 min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-bl from-[#33001a] to-[#000000] z-0" />
                <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity grid-bg z-0" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff0055] blur-[100px] opacity-20 rounded-full z-0" />
                
                <div className="relative z-10 p-8 flex flex-col justify-end h-full w-full">
                  <h3 className="text-4xl text-white mb-2 group-hover:text-neon-pink transition-colors">SHONEN JUMP</h3>
                  <p className="text-[var(--text-muted)] mb-6">The heavy hitters. Action, friendship, and unyielding spirit.</p>
                  <button className="self-start text-neon-pink uppercase font-bold tracking-widest text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    View Manga <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
          
        </section>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[var(--bg-surface)] py-12 px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold font-display text-white tracking-wider">
            OTAKU<span className="text-neon-pink">FIRE</span>
          </div>
          <div className="flex gap-6 text-[var(--text-muted)] text-sm">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div>
          <div className="text-[var(--text-muted)] text-sm">
            © 2024 OtakuFire. Power Level > 9000.
          </div>
        </div>
      </footer>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
