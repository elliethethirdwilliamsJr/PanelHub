import React from "react";
import { ArrowRight, Search, Menu, PlayCircle, Star, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Relative paths to the generated images
import imgFireflies from "../../../assets/fireflies.png";
import imgBr2049 from "../../../assets/br2049.png";
import imgGits from "../../../assets/gits.png";
import imgEva from "../../../assets/eva.png";
import imgParasite from "../../../assets/parasite.png";
import imgShogun from "../../../assets/shogun.png";
import imgBear from "../../../assets/bear.png";

export function Cinematic() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAFAF8] text-[#1c1c1c] font-sans selection:bg-[#E83F28] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap');
        .font-editorial { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'DM Sans', sans-serif; }
        
        /* Subtle noise texture */
        .bg-noise {
          position: relative;
        }
        .bg-noise::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 10;
        }
      `}} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#1c1c1c]/10">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="font-editorial text-2xl font-bold tracking-tight">Criterion<span className="text-[#E83F28]">+</span></div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1c1c1c]/70">
              <a href="#" className="text-[#1c1c1c] transition-colors hover:text-[#E83F28]">Films</a>
              <a href="#" className="transition-colors hover:text-[#E83F28]">Series</a>
              <a href="#" className="transition-colors hover:text-[#E83F28]">Anime</a>
              <a href="#" className="transition-colors hover:text-[#E83F28]">Manga</a>
              <a href="#" className="transition-colors hover:text-[#E83F28]">Reviews</a>
              <a href="#" className="transition-colors hover:text-[#E83F28]">Lists</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#1c1c1c]/70 hover:text-[#1c1c1c] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Button variant="outline" className="hidden md:flex rounded-none border-[#1c1c1c] text-[#1c1c1c] hover:bg-[#1c1c1c] hover:text-white font-medium uppercase tracking-widest text-xs h-10 px-6">
              Subscribe
            </Button>
            <button className="md:hidden text-[#1c1c1c]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="bg-noise pb-24">
        {/* Editorial Hero */}
        <section className="max-w-[1400px] mx-auto px-6 pt-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-5 pb-8">
              <div className="uppercase tracking-widest text-xs font-semibold text-[#E83F28] mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#E83F28]"></span>
                Cover Story
              </div>
              <h1 className="font-editorial text-6xl md:text-8xl font-medium leading-[1.05] tracking-tight mb-8">
                Grave of<br />the Fireflies
              </h1>
              <p className="text-lg text-[#1c1c1c]/70 leading-relaxed mb-10 max-w-md font-light">
                Isao Takahata's masterpiece remains one of the most devastating and vital animated films ever constructed. A meditation on innocence, war, and the ghosts we carry.
              </p>
              <div className="flex items-center gap-6">
                <Button className="rounded-none bg-[#E83F28] hover:bg-[#c9321e] text-white h-14 px-8 text-sm uppercase tracking-widest font-semibold flex items-center gap-3">
                  <PlayCircle className="w-5 h-5" />
                  Watch Now
                </Button>
                <Button variant="ghost" className="rounded-none text-[#1c1c1c] hover:bg-transparent hover:text-[#E83F28] h-14 px-0 flex items-center gap-3 uppercase tracking-widest text-xs font-semibold">
                  <BookmarkPlus className="w-4 h-4" />
                  Save to List
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/3] lg:aspect-[16/10] overflow-hidden relative">
                <img 
                  src={imgFireflies} 
                  alt="Grave of the Fireflies" 
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 border border-[#1c1c1c]/10 pointer-events-none"></div>
              </div>
              <div className="absolute -left-6 bottom-12 bg-white p-6 border border-[#1c1c1c]/10 shadow-2xl max-w-xs hidden md:block">
                <div className="text-xs uppercase tracking-widest text-[#1c1c1c]/50 mb-2">Director</div>
                <div className="font-editorial text-xl">Isao Takahata</div>
                <div className="mt-4 flex gap-2">
                  <div className="px-2 py-1 border border-[#1c1c1c]/20 text-[10px] uppercase tracking-widest">1988</div>
                  <div className="px-2 py-1 border border-[#1c1c1c]/20 text-[10px] uppercase tracking-widest">89 Min</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="max-w-[1400px] mx-auto px-6">
          <hr className="border-[#1c1c1c]/10" />
        </div>

        {/* Editor's Picks & New Releases Split */}
        <section className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Editor's Picks */}
            <div className="lg:col-span-8">
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="font-editorial text-4xl italic">Editor's Picks</h2>
                <a href="#" className="text-sm font-semibold uppercase tracking-widest text-[#1c1c1c]/50 hover:text-[#E83F28] flex items-center gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              <div className="flex flex-col gap-12">
                {[
                  {
                    title: "Blade Runner 2049",
                    year: "2017",
                    director: "Denis Villeneuve",
                    desc: "A sprawling, visually miraculous continuation of the sci-fi hallmark that asks what it means to be human in a world of copies.",
                    img: imgBr2049,
                    aspect: "aspect-[16/9]"
                  },
                  {
                    title: "Neon Genesis Evangelion",
                    year: "1995",
                    director: "Hideaki Anno",
                    desc: "An apocalyptic deconstruction of the mecha genre that spirals into a profound exploration of depression and existential dread.",
                    img: imgEva,
                    aspect: "aspect-[21/9]"
                  }
                ].map((item, i) => (
                  <article key={i} className="group cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                      <div className={`md:col-span-3 overflow-hidden ${item.aspect}`}>
                        <img 
                          src={item.img} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="md:col-span-2 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#1c1c1c]/50 mb-4">
                          <span>{item.year}</span>
                          <span className="w-1 h-1 rounded-full bg-[#1c1c1c]/20"></span>
                          <span>{item.director}</span>
                        </div>
                        <h3 className="font-editorial text-3xl font-medium leading-tight mb-4 group-hover:text-[#E83F28] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[#1c1c1c]/70 text-sm leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* This Week in Film / Sidebar */}
            <div className="lg:col-span-4 border-l border-[#1c1c1c]/10 pl-0 lg:pl-12">
              <h2 className="font-editorial text-2xl mb-12 uppercase tracking-widest">This Week in Film</h2>
              
              <div className="flex flex-col gap-8">
                {[
                  { title: "Perfect Days", type: "Review", author: "Sarah Chen" },
                  { title: "The Aesthetics of Cyberpunk: From Akira to Edgerunners", type: "Essay", author: "James Miller" },
                  { title: "Dune: Part Two", type: "Review", author: "David Thomson" },
                  { title: "In Conversation: Bong Joon Ho", type: "Interview", author: "Criterion Staff" },
                  { title: "The Best Anime of 2024 So Far", type: "List", author: "Editorial Board" }
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer border-b border-[#1c1c1c]/10 pb-8 last:border-0">
                    <div className="text-[10px] uppercase tracking-widest text-[#E83F28] font-bold mb-2">
                      {item.type}
                    </div>
                    <h4 className="font-editorial text-xl font-medium leading-snug mb-3 group-hover:text-[#E83F28] transition-colors">
                      {item.title}
                    </h4>
                    <div className="text-xs text-[#1c1c1c]/50 italic">
                      By {item.author}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-[#1c1c1c] text-white p-10 flex flex-col items-center text-center">
                <div className="font-editorial text-2xl mb-4 italic">The Criterion+ Newsletter</div>
                <p className="text-sm text-white/70 mb-8 font-light">Weekly essays, reviews, and curated recommendations delivered to your inbox.</p>
                <div className="w-full flex">
                  <input type="email" placeholder="Email address" className="bg-transparent border border-white/20 px-4 py-3 text-sm w-full focus:outline-none focus:border-white transition-colors" />
                  <button className="bg-white text-[#1c1c1c] px-6 text-sm uppercase tracking-widest font-bold hover:bg-[#E83F28] hover:text-white transition-colors border border-transparent hover:border-[#E83F28]">
                    Join
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Essential Cinema Grid */}
        <section className="bg-[#1c1c1c] text-white py-32 mt-12">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="uppercase tracking-widest text-xs font-semibold text-[#E83F28] mb-4 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[#E83F28]"></span>
                  Curated Collection
                </div>
                <h2 className="font-editorial text-4xl md:text-5xl">Essential Viewing</h2>
              </div>
              <div className="max-w-md text-white/60 text-sm font-light">
                A foundational curriculum of modern classics, boundary-pushing anime, and prestige television. Selected by our editorial board.
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-16">
              {[
                { title: "Ghost in the Shell", img: imgGits, year: "1995", tag: "Cyberpunk" },
                { title: "Parasite", img: imgParasite, year: "2019", tag: "Thriller" },
                { title: "Shogun", img: imgShogun, year: "2024", tag: "Historical" },
                { title: "The Bear", img: imgBear, year: "2022", tag: "Drama" },
              ].map((film, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[2/3] overflow-hidden mb-6 relative">
                    <img 
                      src={film.img} 
                      alt={film.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="w-10 h-10 rounded-full bg-white text-[#1c1c1c] flex items-center justify-center hover:bg-[#E83F28] hover:text-white transition-colors">
                        <PlayCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-editorial text-xl mb-1 group-hover:text-[#E83F28] transition-colors">{film.title}</h4>
                      <div className="text-white/50 text-xs font-light">{film.year}</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#E83F28] border border-[#E83F28]/30 px-2 py-1 whitespace-nowrap">
                      {film.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#141414] text-white/50 py-16 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-editorial text-2xl font-bold tracking-tight text-white">Criterion<span className="text-[#E83F28]">+</span></div>
          <div className="flex gap-8 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Masthead</a>
            <a href="#" className="hover:text-white transition-colors">Submit</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <div className="text-sm font-light">
            © {new Date().getFullYear()} Criterion Plus Editorial.
          </div>
        </div>
      </footer>
    </div>
  );
}
