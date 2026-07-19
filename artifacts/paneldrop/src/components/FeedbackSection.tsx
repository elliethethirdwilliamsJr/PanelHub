import React, { useState } from 'react';

interface Feedback {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  avatar?: string;
}

// Mock feedback data - replace with real API data later
const mockFeedback: Feedback[] = [
  {
    id: '1',
    username: 'AnimeFreak99',
    comment: 'This site is amazing! Finally found a place to watch all my favorite anime in HD. Keep up the great work! 🔥',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    username: 'OtakuMaster',
    comment: 'Love the interface and the quality of streams. The automatic server switching is a lifesaver when one server goes down.',
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    username: 'SakuraFan',
    comment: 'Best anime streaming site I\'ve used! No annoying registration required and the site loads super fast.',
    timestamp: '1 day ago',
  },
  {
    id: '4',
    username: 'NarutoLover',
    comment: 'The player is smooth and I love that you can skip intros automatically. More anime sites should be like this!',
    timestamp: '2 days ago',
  },
  {
    id: '5',
    username: 'AttackOnFan',
    comment: 'Great selection of anime! Been binge watching here all week. Thank you for this free service! 💯',
    timestamp: '3 days ago',
  },
];

const accent = '#f04e35';

export default function FeedbackSection() {
  const [feedbackList] = useState<Feedback[]>(mockFeedback);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // TODO: Add API call to submit feedback
    const feedbackData = {
      comment: newComment,
      username: username.trim() || 'Anonymous',
    };
    console.log('Submitting feedback:', feedbackData);
    setNewComment('');
    setUsername('');
  };

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="manga-panel p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-2 h-12 md:h-16"
              style={{ backgroundColor: accent }}
            />
            <h2 className="font-manga-title text-4xl md:text-5xl uppercase tracking-wider">
              Community Feedback
            </h2>
          </div>
          <p className="font-manga-body text-base md:text-lg text-gray-700 ml-6">
            See what others are saying about PanelDrop
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Feedback List - Show only 3 with scrollbar */}
          <div className="space-y-4">
            <div className="manga-panel p-4 md:p-6">
              <h3 className="font-manga-title text-2xl uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                User Feedback
              </h3>
              
              {feedbackList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-manga-body text-gray-500 text-sm uppercase tracking-[0.2em]">
                    No feedback yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 manga-scrollbar-thin" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {feedbackList.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border-2 border-black p-4 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                          style={{ backgroundColor: accent }}
                        >
                          {feedback.username.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-manga-body font-black text-sm uppercase tracking-[0.1em]">
                              {feedback.username}
                            </h4>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                              {feedback.timestamp}
                            </span>
                          </div>
                          <p className="font-manga-body text-sm leading-relaxed text-gray-800">
                            {feedback.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Feedback Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="manga-panel p-6">
              <h3 className="font-manga-title text-2xl uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Share Your Thoughts
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-manga-body text-xs font-black uppercase tracking-[0.2em] mb-2">
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name or leave blank for Anonymous"
                    className="w-full border-4 border-black bg-white px-4 py-3 font-manga-body text-sm outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow"
                    maxLength={30}
                  />
                  <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-wider">
                    Leave blank to post as "Anonymous"
                  </p>
                </div>

                <div>
                  <label className="block font-manga-body text-xs font-black uppercase tracking-[0.2em] mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tell us what you think about PanelDrop..."
                    className="w-full h-32 border-4 border-black bg-white px-4 py-3 font-manga-body text-sm resize-none outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {newComment.length}/500 characters
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="w-full border-4 border-black px-6 py-3 font-manga-title text-xl uppercase tracking-wide text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  style={{ backgroundColor: accent }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13"/>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    Post Comment
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
