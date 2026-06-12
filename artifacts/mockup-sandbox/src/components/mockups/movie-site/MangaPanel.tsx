import React from 'react';
import './_manga-styles.css';

const RED_ACCENT = "#E63946";
const INK_BLUE = "#1D3557";

export function MangaPanel() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-manga-body text-black selection:bg-[#E63946] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=DM+Sans:opsz,wght@9..40,400;500;700;900&display=swap');
      `}} />

      {/* Navigation - Top Panel Row */}
      <nav className="flex w-full manga-border-bottom bg-white relative z-10">
        <div className="flex-none p-4 manga-border-right flex items-center justify-center bg-black text-white">
          <span className="font-manga-title text-3xl tracking-widest uppercase">PanelDrop</span>
        </div>
        <div className="flex-1 flex">
          {['Anime', 'Manga', 'Movies', 'Shows'].map((tab, i) => (
            <button 
              key={tab} 
              className={`flex-1 p-4 font-manga-title text-2xl uppercase hover:bg-gray-100 transition-colors ${i !== 3 ? 'manga-border-right' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-none p-4 manga-border-left flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-4 flex flex-col gap-4">
        
        {/* Row 1: Hero & Top 10 */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
          
          {/* Hero Panel */}
          <div className="manga-panel flex-[2] group cursor-pointer h-[400px] lg:h-full flex flex-col justify-end p-8 relative">
            <div className="manga-speedlines opacity-40 group-hover:opacity-60 transition-opacity"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop" 
              alt="Hero anime character" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply grayscale contrast-125 opacity-80"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-start gap-2">
              <div className="manga-speech-bubble bg-white px-4 py-2 mb-2 rotate-[-5deg]">
                <span className="font-manga-title text-xl text-[#E63946]">SEASON 3 STREAMING NOW!</span>
              </div>
              <h1 className="font-manga-title text-6xl md:text-8xl leading-none text-black drop-shadow-[4px_4px_0_#fff,-1px_-1px_0_#fff,1px_-1px_0_#fff,-1px_1px_0_#fff,1px_1px_0_#fff]">
                JUJUTSU KAISEN
              </h1>
              <p className="font-manga-body font-bold text-lg md:text-xl max-w-lg bg-black text-white p-2 mt-2">
                The Culling Game begins. Yuji and Megumi enter the barrier to save Tsumiki.
              </p>
            </div>
          </div>

          {/* Top 10 Panel */}
          <div className="manga-panel flex-1 h-auto lg:h-full flex flex-col">
            <div className="manga-halftone"></div>
            <div className="manga-border-bottom p-4 bg-black text-white relative z-10">
              <h2 className="font-manga-title text-3xl">TOP 10 THIS WEEK</h2>
            </div>
            <div className="flex-1 overflow-y-auto relative z-10 p-0 flex flex-col">
              {[
                { rank: 1, title: "Solo Leveling", views: "2.4M Views" },
                { rank: 2, title: "Frieren: Beyond Journey's End", views: "1.8M Views" },
                { rank: 3, title: "One Piece", views: "1.5M Views" },
                { rank: 4, title: "Attack on Titan", views: "1.2M Views" },
                { rank: 5, title: "Chainsaw Man", views: "980K Views" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center p-3 hover:bg-[#E63946] hover:text-white transition-colors cursor-pointer ${i !== 4 ? 'manga-border-bottom' : ''}`}>
                  <div className="font-manga-title text-4xl w-12 text-center opacity-80">{item.rank}</div>
                  <div className="flex-1 pl-2">
                    <div className="font-bold text-lg leading-tight uppercase">{item.title}</div>
                    <div className="text-sm opacity-80">{item.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagonal Accent Panel */}
        <div className="manga-panel w-full bg-[#E63946] text-white p-6 relative overflow-hidden my-4 transform -skew-x-6 scale-x-105">
          <div className="manga-shading absolute inset-0 opacity-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between transform skew-x-6">
            <h2 className="font-manga-title text-4xl md:text-5xl italic tracking-wider">⚡ NEW RELEASES JUST DROPPED!</h2>
            <button className="mt-4 md:mt-0 border-4 border-black bg-white text-black font-manga-title text-2xl px-6 py-2 hover:bg-black hover:text-white transition-colors uppercase">
              Read Chapter 124
            </button>
          </div>
        </div>

        {/* Row 2: Medium Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Demon Slayer", sub: "Swordsmith Village Arc", img: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=600&auto=format&fit=crop" },
            { title: "Vinland Saga", sub: "Season 2 Complete", img: "https://images.unsplash.com/photo-1606567595334-d39972c85dbe?q=80&w=600&auto=format&fit=crop" },
            { title: "Spy x Family", sub: "Code: White Movie", img: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=600&auto=format&fit=crop" }
          ].map((item, i) => (
            <div key={i} className="manga-panel h-[250px] group cursor-pointer relative flex items-end p-4">
              <img 
                src={item.img} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
              <div className="manga-halftone opacity-20"></div>
              
              <div className="relative z-10 bg-white border-4 border-black p-3 translate-y-2 group-hover:-translate-y-1 transition-transform">
                <h3 className="font-manga-title text-3xl uppercase leading-none">{item.title}</h3>
                <p className="font-manga-body font-bold text-sm mt-1 bg-[#1D3557] text-white inline-block px-2 py-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            "Oppenheimer", "Ghost in the Shell", "The Last of Us", "Parasite",
            "Blue Lock", "Dune: Part Two", "Cyberpunk", "Akira"
          ].map((title, i) => (
            <div key={i} className="manga-panel aspect-[3/4] group cursor-pointer relative">
              <div className="absolute inset-0 manga-shading opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-black bg-white z-10">
                <h4 className="font-manga-title text-2xl uppercase leading-none truncate">{title}</h4>
              </div>
              <div className="absolute top-2 right-2 z-10 bg-white border-2 border-black font-manga-body text-xs font-bold px-2 py-1">
                HD
              </div>
            </div>
          ))}
        </div>

      </main>
      
      {/* Footer */}
      <footer className="manga-border-top bg-black text-white p-8 mt-12 text-center relative overflow-hidden">
         <div className="manga-speedlines opacity-20"></div>
         <div className="relative z-10 flex flex-col items-center justify-center">
            <h2 className="font-manga-title text-6xl tracking-widest">PANELDROP</h2>
            <p className="font-manga-body font-bold text-sm uppercase mt-4 tracking-widest text-gray-400">Read. Watch. Experience.</p>
         </div>
      </footer>
    </div>
  );
}
