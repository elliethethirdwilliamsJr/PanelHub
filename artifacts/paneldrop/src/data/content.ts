export type Category = 'Anime';

export const CATEGORIES: Category[] = ['Anime'];

export interface HeroData {
  id?: number;
  title: string;
  subtitle: string;
  tag: string;
  synopsis: string;
  image: string;
}

export interface Top10Data {
  id?: number;
  title: string;
  views: string;
}

export interface BannerData {
  text: string;
  cta: string;
}

export interface FeaturedData {
  title: string;
  sub: string;
  image: string;
}

export interface GridData {
  title: string;
  badge: string;
  image: string;
}

export interface CategoryContent {
  accent: string;
  hero: HeroData;
  top10: Top10Data[];
  banner: BannerData;
  featured: FeaturedData[];
  grid: GridData[];
}

export const CATEGORY_DATA: Record<Category, CategoryContent> = {
  Anime: {
    accent: '#E63946',
    hero: {
      title: 'JUJUTSU KAISEN',
      subtitle: 'SEASON 3',
      tag: 'STREAMING NOW',
      synopsis: 'The Culling Game begins. Yuji and Megumi enter the barrier to save Tsumiki.',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&h=700&fit=crop'
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
      { title: 'Demon Slayer', sub: 'Swordsmith Village Arc', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=900&fit=crop' },
      { title: 'Vinland Saga', sub: 'Season 2 Complete', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop' },
      { title: 'Spy x Family', sub: 'Code: White Movie', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop' },
    ],
    grid: [
      { title: 'Blue Lock', badge: 'NEW', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=900&fit=crop' },
      { title: 'Akira', badge: '4K', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Cowboy Bebop', badge: 'HD', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
      { title: 'Fullmetal Alchemist', badge: 'HD', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Neon Genesis Evangelion', badge: 'HD', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Hunter x Hunter', badge: 'HD', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Steins;Gate', badge: 'HD', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'Mob Psycho 100', badge: 'NEW', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
    ],
  },
  Manga: {
    accent: '#1D3557',
    hero: {
      title: 'BERSERK',
      subtitle: 'DELUXE EDITION',
      tag: 'CHAPTER 374 OUT NOW',
      synopsis: 'Guts and the Band of the Hawk face their ultimate fate in the Eclipse. Kentaro Miura\'s masterpiece.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop'
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
      { title: 'Solo Leveling', sub: 'Season 2: Arise from the Shadow', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Dungeon Meshi', sub: 'Delicious in Dungeon Vol. 14', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
      { title: 'Vagabond', sub: 'Inoue\'s Samurai Epic', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop' },
    ],
    grid: [
      { title: 'Berserk', badge: 'CLASSIC', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop' },
      { title: 'Goodnight Punpun', badge: 'MATURE', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop' },
      { title: 'Blue Period', badge: 'ART', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=900&fit=crop' },
      { title: 'Oyasumi Punpun', badge: 'MATURE', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
      { title: 'I Am a Hero', badge: 'HORROR', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'Golden Kamuy', badge: 'HD', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Dorohedoro', badge: 'DARK', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'Pluto', badge: 'SCI-FI', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
    ],
  },
  Movies: {
    accent: '#2d2d2d',
    hero: {
      title: 'OPPENHEIMER',
      subtitle: '2023',
      tag: 'AWARD WINNER',
      synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop'
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
      { title: 'Grave of the Fireflies', sub: 'Studio Ghibli · 1988', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
      { title: 'Parasite', sub: 'Bong Joon-ho · Palme d\'Or', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'Perfect Blue', sub: 'Satoshi Kon · Thriller', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
    ],
    grid: [
      { title: 'Interstellar', badge: '4K', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Ghost in the Shell', badge: 'CLASSIC', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=900&fit=crop' },
      { title: 'The Matrix', badge: '4K', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Princess Mononoke', badge: 'GHIBLI', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Your Name', badge: 'ANIME', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&h=900&fit=crop' },
      { title: 'Blade Runner 2049', badge: '4K', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Akira', badge: 'CLASSIC', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=900&fit=crop' },
      { title: 'Spirited Away', badge: 'GHIBLI', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
    ],
  },
  Shows: {
    accent: '#6a0572',
    hero: {
      title: 'THE LAST OF US',
      subtitle: 'SEASON 2',
      tag: 'SERIES PREMIERE',
      synopsis: 'Five years after the events of the first season, Joel and Ellie are drawn into conflict with each other.',
      image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=700&fit=crop'
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
      { title: 'Severance', sub: 'Season 2 · Apple TV+', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Shogun', sub: 'FX · Historical Drama', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop' },
      { title: 'Dark', sub: 'Netflix · Sci-Fi Thriller', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
    ],
    grid: [
      { title: 'The Bear', badge: 'NEW', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop' },
      { title: 'Succession', badge: 'COMPLETE', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop' },
      { title: 'Breaking Bad', badge: 'CLASSIC', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=900&fit=crop' },
      { title: 'Dark', badge: 'SCI-FI', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
      { title: 'Arcane', badge: 'ANIMATED', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop' },
      { title: 'Chernobyl', badge: 'MINISERIES', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'True Detective', badge: 'CRIME', image: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&h=900&fit=crop' },
      { title: 'Andor', badge: 'SCI-FI', image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=600&h=900&fit=crop' },
    ],
  },
};
