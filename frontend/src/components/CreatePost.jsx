import { useState } from 'react';
import api from '../api/axios';
import { FEEDS } from '../utils/feedList';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [feed, setFeed] = useState('IdeaStream');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('feed', feed);
      if (image) {
        formData.append('image', image);
      }
      
      const { data } = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Clear form
      setTitle('');
      setContent('');
      setFeed('IdeaStream');
      setImage(null);
      setPreview(null);
      
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

        {preview && (
          <div className="mb-4 relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-48 rounded-xl border border-brand-border object-cover" 
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
              className="absolute -top-2 -right-2 bg-brand-surface border border-brand-border rounded-full p-1 text-brand-text hover:text-red-500 transition-colors"
              title="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

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
            
            <label className="cursor-pointer flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary transition-colors ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/jpg, image/webp"
                disabled={isLoading}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      setError('File size must be less than 5MB');
                      return;
                    }
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                    setError('');
                  }
                }}
              />
            </label>
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
