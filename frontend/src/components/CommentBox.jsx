import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CommentBox = ({ postId, initialComments = [], onCommentChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const { data } = await api.post(`/posts/${postId}/comments`, {
        content: newComment
      });
      
      setComments((prev) => [...prev, data.data]);
      setNewComment('');
      if (onCommentChange) onCommentChange(1);
    } catch (err) {
      console.error('Failed to post comment:', err);
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await api.delete(`/posts/${postId}/comments/${commentId}`);
      setComments((prev) => prev.filter(c => c._id !== commentId));
      if (onCommentChange) onCommentChange(-1);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className="mt-4 border-t border-brand-border pt-4">
      {/* Comments List */}
      <div className="space-y-4 mb-4">
        {comments.length === 0 ? (
          <p className="text-brand-muted text-sm italic">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment, index) => (
            <div key={comment._id || index} className="flex gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center shrink-0 text-brand-primary font-display font-bold">
                {comment.authorUsername?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/user/${comment.authorUsername}`}
                      className="font-semibold text-brand-text hover:text-brand-primary transition-colors"
                    >
                      {comment.authorUsername}
                    </Link>
                    <span className="text-xs text-brand-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {(user?.id === comment.authorId || user?.username === comment.authorUsername) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-brand-muted hover:text-red-500 transition-colors p-1"
                      title="Delete Comment"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-brand-text/90">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input */}
      {error && <p className="text-red-500 text-xs mb-2">❌ {error}</p>}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment..." : "Log in to comment"}
          disabled={isLoading || !user}
          className="flex-1 input-field py-2 px-4 rounded-full text-sm disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={isLoading || !user || !newComment.trim()}
          className="btn-primary rounded-full px-5 py-2 text-sm disabled:opacity-50"
        >
          {isLoading ? '...' : 'Reply'}
        </button>
      </form>
    </div>
  );
};
export default CommentBox;
