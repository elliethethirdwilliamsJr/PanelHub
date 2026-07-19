import React, { useEffect, useState } from 'react';

const accent = '#f04e35';

export default function OfflineModal() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    // Check initial connection status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOffline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOffline]);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOffline(false);
      window.location.reload();
    } else {
      alert('Still no internet connection. Please check your network and try again.');
    }
  };

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300">
      <div
        className="manga-panel w-full max-w-md bg-white shadow-[10px_10px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500"
        style={{
          animation: 'slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div
          className="border-b-4 border-black p-6 relative overflow-hidden"
          style={{ backgroundColor: accent }}
        >
          <div className="manga-speedlines opacity-20 absolute inset-0" />
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 border-4 border-black bg-white flex items-center justify-center">
              <div className="text-4xl" style={{ color: accent }}>
                ⚠
              </div>
            </div>
            <h2 className="font-manga-title text-2xl md:text-3xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] mb-2">
              No Internet Connection
            </h2>
            <p className="font-manga-body text-sm font-black uppercase tracking-[0.2em] text-white/90">
              Connection Lost
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="border-4 border-black p-4 bg-white mb-4">
            <p className="font-manga-body text-sm text-gray-700 leading-relaxed text-center">
              <strong>Your internet connection appears to be offline.</strong>
              <br />
              Please check your network settings and try again.
            </p>
          </div>

          {/* Troubleshooting */}
          <div
            className="border-2 border-black p-4 mb-4"
            style={{ backgroundColor: `${accent}10` }}
          >
            <h4 className="font-manga-body text-xs font-black uppercase tracking-[0.2em] mb-2 text-center">
              Troubleshooting Steps
            </h4>
            <ul className="space-y-1.5 text-xs font-manga-body text-gray-700">
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span>Check if your WiFi or mobile data is enabled</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span>Try turning airplane mode off</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: accent }}>•</span>
                <span>Restart your router or modem</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleRetry}
            className="w-full border-4 border-black px-6 py-3 font-manga-title text-lg uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5"
            style={{ backgroundColor: accent }}
          >
            Retry Connection
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
