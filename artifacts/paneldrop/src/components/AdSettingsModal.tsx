import React, { useEffect, useState } from 'react';

const accent = '#f04e35';

interface AdSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdSettingsModal({ isOpen, onClose }: AdSettingsModalProps) {
  const [adsEnabled, setAdsEnabled] = useState(true);

  useEffect(() => {
    // Load ad preference from localStorage
    const saved = localStorage.getItem('paneldrop_ads_enabled');
    if (saved !== null) {
      setAdsEnabled(saved === 'true');
    }
  }, [isOpen]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleToggle = () => {
    const newValue = !adsEnabled;
    setAdsEnabled(newValue);
    localStorage.setItem('paneldrop_ads_enabled', String(newValue));
    
    // Show/hide ad scripts
    if (newValue) {
      // Enable ads - reload page to reinitialize ad scripts
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      // Disable ads - hide ad containers
      const adContainers = document.querySelectorAll('[id*="ad"], [class*="ad-"]');
      adContainers.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-300">
      <div
        className="manga-panel w-full max-w-lg bg-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500"
        style={{
          animation: 'slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div
          className="border-b-4 border-black p-4 relative overflow-hidden"
          style={{ backgroundColor: accent }}
        >
          <div className="manga-speedlines opacity-20 absolute inset-0" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="font-manga-title text-2xl md:text-3xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                Ad Settings
              </h2>
              <p className="font-manga-body text-xs font-black uppercase tracking-[0.2em] text-white/90 mt-1">
                Manage your advertising preferences
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-black bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Toggle Section */}
          <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-manga-title text-lg uppercase tracking-wide mb-1">
                  Display Ads: {adsEnabled ? 'Enabled' : 'Disabled'}
                </h3>
                <p className="font-manga-body text-xs text-gray-700 leading-relaxed">
                  {adsEnabled 
                    ? 'Ads are currently enabled. Thank you for supporting PanelDrop!'
                    : 'Ads are currently disabled. Consider enabling them to support us!'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className={`relative w-14 h-7 rounded-full border-4 border-black transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${
                  adsEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
                aria-label="Toggle ads"
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 border-black transition-transform ${
                    adsEnabled ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div
            className="border-2 border-black p-3 mb-4"
            style={{ backgroundColor: `${accent}10` }}
          >
            <h4 className="font-manga-body text-xs font-black uppercase tracking-[0.2em] mb-2">
              How it Works
            </h4>
            <ul className="space-y-1.5 text-xs font-manga-body text-gray-700">
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span><strong>Ads Enabled:</strong> Small, non-intrusive ads help us cover server costs and keep PanelDrop free.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span><strong>Ads Disabled:</strong> You can disable ads anytime. Your choice is saved locally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span><strong>Support Us:</strong> Keeping ads enabled helps us maintain the platform!</span>
              </li>
            </ul>
          </div>

          {/* Stats/Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border-2 border-black p-3 bg-white text-center">
              <div className="text-2xl mb-1">FREE</div>
              <p className="font-manga-title text-xs uppercase">100% Free</p>
              <p className="text-[10px] text-gray-600">No subs</p>
            </div>
            <div className="border-2 border-black p-3 bg-white text-center">
              <div className="text-2xl mb-1">HD</div>
              <p className="font-manga-title text-xs uppercase">Fast Stream</p>
              <p className="text-[10px] text-gray-600">Quality</p>
            </div>
            <div className="border-2 border-black p-3 bg-white text-center">
              <div className="text-2xl mb-1">FAN</div>
              <p className="font-manga-title text-xs uppercase">Community</p>
              <p className="text-[10px] text-gray-600">Built by fans</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full border-4 border-black px-6 py-2.5 font-manga-title text-lg uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            Close
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
      `}</style>
    </div>
  );
}
