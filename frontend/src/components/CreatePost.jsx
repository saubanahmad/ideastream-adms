import { useState } from 'react';
import api from '../api/axios';
import { FEEDS } from '../utils/feedList';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feed, setFeed] = useState('IdeaStream');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      
      const { data } = await api.post('/posts', { title, content, feed });
      
      // Clear form
      setTitle('');
      setContent('');
      setFeed('IdeaStream');
      
      // Notify parent component to add new post to the top of the feed
      if (onPostCreated) {
        onPostCreated(data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Give your idea a catchy title..."
            className="w-full bg-brand-surface text-brand-text placeholder:text-brand-muted
                       border border-brand-border rounded-xl px-4 py-3 font-sans focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
            maxLength={150}
          />
        </div>
        
        <div className="mb-4">
          <textarea
            placeholder="Share the details of your idea..."
            className="w-full bg-brand-surface text-brand-text placeholder:text-brand-muted
                       border border-brand-border rounded-xl px-4 py-3 font-sans h-28 resize-none focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            required
            maxLength={5000}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 font-sans">{error}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-brand-muted text-sm font-sans">Community:</span>
            <select
              className="bg-brand-surface border border-brand-border text-brand-text 
                         text-sm rounded-lg px-3 py-1.5 font-sans focus:outline-none focus:border-brand-primary cursor-pointer transition-colors"
              value={feed}
              onChange={(e) => setFeed(e.target.value)}
              disabled={isLoading}
            >
              {FEEDS.map(f => (
                <option key={f.apiValue} value={f.apiValue}>{f.label}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary text-sm px-6 py-2"
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            {isLoading ? 'Posting...' : 'Share Idea'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
