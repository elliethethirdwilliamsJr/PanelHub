import React from 'react';

const accent = '#f04e35';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function AlertModal({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) {
  if (!isOpen) return null;

  const colors = {
    success: accent,
    error: '#dc2626',
    info: '#000000',
  };

  const bgColor = colors[type];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-200">
      <div
        className="manga-panel w-full max-w-md bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300"
        style={{
          animation: 'slideInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div
          className="border-b-4 border-black p-4 relative overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          <h2 className="font-manga-title text-xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="font-manga-body text-base text-gray-800 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer Button */}
        <div className="border-t-4 border-black p-4 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full border-4 border-black px-6 py-3 font-manga-title text-lg uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5"
            style={{ backgroundColor: bgColor }}
          >
            OK
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
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
