import React, { useEffect, useState } from 'react';

const accent = '#f04e35';

// Update this version number when you want to show the popup again
const CURRENT_VERSION = 'v1.0.0';

interface Update {
  icon: string;
  title: string;
  description: string;
}

const updates: Update[] = [
  {
    icon: '🚀',
    title: 'Automatic Server Switching',
    description: 'Videos now automatically switch to working servers when one fails. No more interruptions!',
  },
  {
    icon: '🎬',
    title: 'Enhanced Video Player',
    description: 'Smooth HD streaming with quality selection and auto-skip intro/outro features.',
  },
  {
    icon: '💬',
    title: 'Community Feedback',
    description: 'Share your thoughts and see what others are saying about PanelDrop!',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized loading times and seamless navigation across all pages.',
  },
  {
    icon: '🔍',
    title: 'Better Search',
    description: 'Find your favorite anime faster with improved search functionality.',
  },
  {
    icon: '📱',
    title: 'Mobile Optimized',
    description: 'Enjoy a smooth experience on any device - phone, tablet, or desktop.',
  },
];

export default function WhatsNewPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen this version
    const lastSeenVersion = localStorage.getItem('paneldrop_last_seen_version');
    
    if (lastSeenVersion !== CURRENT_VERSION) {
      // Show popup after a short delay for smooth entrance
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    // Save that user has seen this version
    localStorage.setItem('paneldrop_last_seen_version', CURRENT_VERSION);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-300">
      <div
        className="manga-panel w-full max-w-2xl bg-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500"
        style={{
          animation: 'slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))',
        }}
      >
        {/* Header */}
        <div
          className="border-b-4 border-black p-6 relative overflow-hidden"
          style={{ backgroundColor: accent }}
        >
          <div className="manga-speedlines opacity-20 absolute inset-0" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">✨</span>
                <h2 className="font-manga-title text-3xl md:text-4xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                  What's New
                </h2>
              </div>
              <p className="font-manga-body text-sm font-black uppercase tracking-[0.2em] text-white/90">
                {CURRENT_VERSION} Update
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="font-manga-body text-lg mb-6 text-gray-800 leading-relaxed">
            We've been working hard to make PanelDrop even better! Check out what's new:
          </p>

          <div className="space-y-4">
            {updates.map((update, index) => (
              <div
                key={index}
                className="border-2 border-black p-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                style={{
                  animation: `slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-2xl border-2 border-black"
                    style={{ backgroundColor: `${accent}20` }}
                  >
                    {update.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-manga-title text-xl uppercase tracking-wide mb-1">
                      {update.title}
                    </h3>
                    <p className="font-manga-body text-sm text-gray-700 leading-relaxed">
                      {update.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div
            className="mt-6 p-4 border-2 border-black"
            style={{ backgroundColor: `${accent}10` }}
          >
            <p className="font-manga-body text-sm text-center font-bold">
              <span style={{ color: accent }}>🎉</span> Thank you for using PanelDrop!{' '}
              <span style={{ color: accent }}>🎉</span>
            </p>
            <p className="font-manga-body text-xs text-center text-gray-600 mt-1">
              We're constantly improving. Share your feedback below!
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="border-t-4 border-black p-4 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="w-full border-4 border-black px-6 py-3 font-manga-title text-xl uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            Got It! Let's Watch Anime 🚀
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
