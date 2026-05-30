import { useState } from 'react';
import { Link } from 'react-router-dom';
import VoteButtons from './VoteButtons';
import CommentBox from './CommentBox';
import commentIcon from '../assets/icons/comment.svg';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="card mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-lg font-semibold">{post?.title || 'Post Title'}</span>
        <span className="text-xs bg-brand-primary border border-brand-border text-brand-surfaceText px-3 py-1 rounded-full font-medium">
          {post?.feed || 'IdeaStream'}
        </span>
      </div>
      <p className="text-brand-text text-sm leading-relaxed">{post?.content}</p>
      
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
          <span className="font-medium">{post?.comments?.length ?? 0}</span>
        </button>
      </div>

      {showComments && (
        <CommentBox postId={post?._id} initialComments={post?.comments} />
      )}
    </div>
  );
};
export default PostCard;
