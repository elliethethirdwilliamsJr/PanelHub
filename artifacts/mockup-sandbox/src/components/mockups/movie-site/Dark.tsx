import React from "react";
import "./_group.css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Info, Star, ChevronRight, Search, Bell, User } from "lucide-react";

export function Dark() {
  return (
    <div className="min-h-screen overflow-x-hidden cinema-bg font-outfit text-white selection:bg-red-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-8">
          <div className="font-cinzel text-2xl font-bold tracking-widest text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
            NIGHTWATCH
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <a href="#" className="text-white hover:text-red-500 transition-colors">Home</a>
            <a href="#" className="hover:text-red-500 transition-colors">Anime</a>
            <a href="#" className="hover:text-red-500 transition-colors">Manga</a>
            <a href="#" className="hover:text-red-500 transition-colors">Movies</a>
            <a href="#" className="hover:text-red-500 transition-colors">Shows</a>
          </div>
        </div>
        <div className="flex items-center gap-6 text-gray-300">
          <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <Bell className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors">
            <User className="w-4 h-4" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] w-full flex items-center">
        {/* Background - using a dark gradient placeholder to simulate an epic cinematic poster */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=2000&auto=format&fit=crop')",
            filter: "brightness(0.6) contrast(1.2)"
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-gradient-side w-1/2" />
        
        <div className="relative z-10 px-12 md:px-24 max-w-4xl pt-20">
          <Badge className="bg-red-600/20 text-red-500 hover:bg-red-600/30 border-red-900/50 mb-4 px-3 py-1 rounded-sm tracking-wider text-xs">
            NEW EPISODE
          </Badge>
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold leading-tight mb-4 drop-shadow-2xl">
            ATTACK ON TITAN<br />
            <span className="text-gray-300 text-4xl md:text-5xl">FINAL SEASON</span>
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 font-medium">
            <span className="text-green-500 flex items-center gap-1"><Star className="w-4 h-4 fill-current" /> 9.8</span>
            <span>2023</span>
            <span className="border border-gray-700 px-1.5 py-0.5 rounded text-xs">TV-MA</span>
            <span>4 Seasons</span>
            <span>Dark Fantasy, Action</span>
          </div>
          
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl text-shadow-sm font-light">
            The truth outside the walls and the identity of the Titans are finally revealed. 
            To secure their freedom, the Survey Corps prepares for the ultimate battle against the world.
          </p>
          
          <div className="flex items-center gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded text-lg font-semibold tracking-wide transition-all hover:scale-105 group border-none shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <Play className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" /> Watch Now
            </Button>
            <Button variant="outline" className="bg-gray-900/40 hover:bg-gray-800/60 border-gray-600 text-white px-6 py-6 rounded text-lg font-medium backdrop-blur-sm transition-all hover:border-gray-400">
              <Plus className="w-5 h-5 mr-2" /> My List
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-8 md:px-12 py-12 space-y-16 -mt-16 relative z-20">
        
        <Section title="Trending Now" items={trendingItems} />
        <Section title="Acclaimed Anime" items={animeItems} />
        <Section title="Epic Cinema" items={movieItems} />
        
      </div>
      
      {/* Footer */}
      <footer className="border-t border-gray-900 mt-20 bg-black py-12 px-12 text-center text-gray-600">
        <div className="font-cinzel text-xl font-bold tracking-widest text-gray-800 mb-6">NIGHTWATCH</div>
        <p className="text-sm">© 2024 NightWatch Entertainment. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Section({ title, items }: { title: string, items: Array<any> }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white tracking-wide border-l-4 border-red-600 pl-3">
          {title}
        </h2>
        <a href="#" className="text-sm text-gray-400 hover:text-white flex items-center group transition-colors">
          Explore all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-8 pt-4 hide-scrollbar snap-x">
        {items.map((item, i) => (
          <div key={i} className="flex-none w-[200px] md:w-[240px] group cursor-pointer snap-start card-hover relative rounded-md overflow-hidden bg-[#111]">
            <div className="aspect-[2/3] relative">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')`, filter: "brightness(0.8)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 text-red-500 fill-current" /> {item.rating}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  <Play className="w-5 h-5 text-white fill-current ml-1" />
                </div>
              </div>
              
              <div className="absolute bottom-0 p-4 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md text-white group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span>{item.year}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{item.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const trendingItems = [
  { title: "Dune: Part Two", rating: "9.2", year: "2024", type: "Movie", image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=600&auto=format&fit=crop" },
  { title: "Jujutsu Kaisen", rating: "9.4", year: "2023", type: "Anime", image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=600&auto=format&fit=crop" },
  { title: "The Last of Us", rating: "9.5", year: "2023", type: "Show", image: "https://images.unsplash.com/photo-1601314167099-232775b4bfcc?q=80&w=600&auto=format&fit=crop" },
  { title: "Demon Slayer: Swordsmith Village", rating: "9.0", year: "2023", type: "Anime", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop" },
  { title: "Oppenheimer", rating: "9.3", year: "2023", type: "Movie", image: "https://images.unsplash.com/photo-1440407876336-62333a6f010f?q=80&w=600&auto=format&fit=crop" },
  { title: "Chainsaw Man", rating: "8.9", year: "2022", type: "Anime", image: "https://images.unsplash.com/photo-1542317148-8b4bdccb33ea?q=80&w=600&auto=format&fit=crop" },
];

const animeItems = [
  { title: "One Piece", rating: "9.8", year: "1999", type: "Anime", image: "https://images.unsplash.com/photo-1580130601254-05fa235abeab?q=80&w=600&auto=format&fit=crop" },
  { title: "Death Note", rating: "9.6", year: "2006", type: "Anime", image: "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=600&auto=format&fit=crop" },
  { title: "Fullmetal Alchemist: Brotherhood", rating: "9.9", year: "2009", type: "Anime", image: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=600&auto=format&fit=crop" },
  { title: "Hunter x Hunter", rating: "9.5", year: "2011", type: "Anime", image: "https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?q=80&w=600&auto=format&fit=crop" },
  { title: "Steins;Gate", rating: "9.3", year: "2011", type: "Anime", image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=600&auto=format&fit=crop" },
  { title: "Cowboy Bebop", rating: "9.4", year: "1998", type: "Anime", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop" },
];

const movieItems = [
  { title: "Blade Runner 2049", rating: "8.9", year: "2017", type: "Movie", image: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=600&auto=format&fit=crop" },
  { title: "Interstellar", rating: "9.1", year: "2014", type: "Movie", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=600&auto=format&fit=crop" },
  { title: "The Dark Knight", rating: "9.5", year: "2008", type: "Movie", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop" },
  { title: "Inception", rating: "9.2", year: "2010", type: "Movie", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop" },
  { title: "Mad Max: Fury Road", rating: "8.8", year: "2015", type: "Movie", image: "https://images.unsplash.com/photo-1517424177726-2244f2fb9f6c?q=80&w=600&auto=format&fit=crop" },
  { title: "The Matrix", rating: "9.3", year: "1999", type: "Movie", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop" },
];
