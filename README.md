markdown# PanelDrop

PanelDrop is a lightweight, high-performance open-source streaming dashboard designed to aggregate and stream movies, TV shows, and anime. By decoupling content discovery from media delivery, the application leverages public metadata APIs for cataloging and dynamically routes traffic to third-party embed engines and video scraper layers.

## Features

- Unified Dashboard: A single interface managing movies, television series, and episodic anime.
- Dynamic Metadata Integration: Seamless connection to The Movie Database (TMDb) API for real-time synopses, posters, casting, and trending tracking.
- Modular Embed Architecture: Implements structural player iframe logic supporting networks like Vidking, alongside fallback video scraper engines.
- Optimized Build System: Powered by pnpm for ultra-fast, disk-space-efficient dependency management and fast compilation times.
- Fully Open Source: Designed for easy modification, self-hosting, and community-driven provider updates.

## Architecture & How It Works

The platform operates using a two-tier handshake architecture to eliminate the need for heavy local database storage:

1. Metadata Layer: The front-end queries free public registries (TMDb for western cinema/shows, Consumet/Anilist for anime) to handle search queries and populate details.
2. Injection Layer: The unique identification keys (TMDb IDs or IMDb IDs) returned from the metadata layer are instantly passed into programmatic iframe layouts to initialize video playback dynamically.

## Prerequisites

Before deploying PanelDrop, ensure you have Node.js and pnpm installed globally on your system. You will also need to acquire the following access tokens:

- A TMDb API Key (v3 Auth) from The Movie Database.
- Optional: A Consumet API instance URL or tracker key for enhanced anime stream resolving.

## Installation & Setup

1. Clone the repository:
   git clone https://github.com
   cd paneldrop

2. Configure environment variables:
   Create a `.env` file in the root directory and append your access credentials:
   TMDB_API_KEY=your_api_key_here
   PORT=3000

3. Install dependencies using pnpm:
   pnpm install

4. Run the development server:
   pnpm dev

## Contributing

This is a community-driven project. Contributions, bug fixes, and additions for alternative streaming providers or styling engines are welcome. Please open an issue or submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

PanelDrop is an open-source indexer and dashboard framework. It does not host, store, or distribute any media files or copyright-protected material. It simply references publicly available web links and structural embedded players. The developers are not liable for how this framework is hosted or utilized by third parties.
