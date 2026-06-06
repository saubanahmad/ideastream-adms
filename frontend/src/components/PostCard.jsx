import { useState } from 'react';
import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import CommentBox from './CommentBox';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import commentIcon from '../assets/icons/comment.svg';

const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
    : 'http://localhost:5000';
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post?.comments?.length ?? 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && (user.id === post?.authorId || user.username === post?.authorUsername);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      setIsDeleting(true);
      await api.delete(`/posts/${post._id}`);
      if (onDelete) {
        onDelete(post._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-lg font-semibold">{post?.title || 'Post Title'}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-brand-primary border border-brand-border text-brand-surfaceText px-3 py-1 rounded-full font-medium">
            {post?.feed || 'IdeaStream'}
          </span>
          {isOwner && (
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-brand-muted hover:text-red-500 transition-colors p-1"
              title="Delete Post"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="text-brand-text text-sm leading-relaxed whitespace-pre-wrap">{post?.content}</p>
      
      {post?.imageUrl && (
        <div className="mt-4">
          <img 
            src={getImageUrl(post.imageUrl)} 
            alt="Post attachment" 
            className="w-full max-h-[350px] object-cover rounded-xl border border-brand-border"
          />
        </div>
      )}
      
      <div className="mt-4 flex items-center gap-4 text-sm text-brand-muted">
        <Link 
          to={`/user/${post?.authorUsername}`} 
          className="font-medium text-brand-text hover:text-brand-primary transition-colors"
        >
          {post?.authorUsername}
        </Link>
        
        <VoteButtons post={post} />
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-brand-primary transition-colors cursor-pointer text-brand-text"
        >
          <img src={commentIcon} alt="Comments" className="w-4 h-4" />
          <span className="font-medium">{commentCount}</span>
        </button>
      </div>

      {showComments && (
        <CommentBox 
          postId={post?._id} 
          initialComments={post?.comments} 
          onCommentChange={(diff) => setCommentCount(prev => prev + diff)} 
        />
      )}
    </div>
  );
};
export default PostCard;
