import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

import upIcon from '../assets/icons/up.svg';
import downIcon from '../assets/icons/down.svg';
import upGreenIcon from '../assets/icons/up-green.svg';
import downRedIcon from '../assets/icons/down-red.svg';

const VoteButtons = ({ post }) => {
  const { user } = useAuth();
  const userId = user?.id;
  
  const initialUserVote = post?.votes?.find((v) => v.userId === String(userId))?.type || null;

  const [score, setScore] = useState(post?.score ?? 0);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (type) => {
    if (!user) {
      alert('Please log in to vote.');
      return;
    }
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      let newScore = score;
      let newUserVote = userVote;

      if (userVote === type) {
        newUserVote = null;
        newScore = type === 'upvote' ? score - 1 : score + 1;
      } else {
        if (userVote === 'upvote' && type === 'downvote') {
          newScore = score - 2;
        } else if (userVote === 'downvote' && type === 'upvote') {
          newScore = score + 2;
        } else {
          newScore = type === 'upvote' ? score + 1 : score - 1;
        }
        newUserVote = type;
      }

      setScore(newScore);
      setUserVote(newUserVote);

      const { data } = await api.post(`/posts/${post._id}/vote`, { type });
      
      setScore(data.data.score);
      setUserVote(data.data.userVote);
      
    } catch (err) {
      console.error('Failed to vote:', err);
      setScore(post?.score ?? 0);
      setUserVote(initialUserVote);
      alert(err.response?.data?.message || 'Failed to vote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-full px-2 py-0.5">
      <button 
        onClick={() => handleVote('upvote')}
        disabled={isLoading}
        className="hover:bg-brand-border rounded-full p-1 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Upvote"
      >
        <img 
          src={userVote === 'upvote' ? upGreenIcon : upIcon} 
          alt="Upvote" 
          className="w-4 h-4" 
        />
      </button>
      
      <span className={`text-xs font-semibold min-w-[1ch] text-center ${userVote === 'upvote' ? 'text-green-500' : userVote === 'downvote' ? 'text-red-500' : 'text-brand-text'}`}>
        {score}
      </span>
      
      <button 
        onClick={() => handleVote('downvote')}
        disabled={isLoading}
        className="hover:bg-brand-border rounded-full p-1 transition-colors flex items-center justify-center cursor-pointer"
        aria-label="Downvote"
      >
        <img 
          src={userVote === 'downvote' ? downRedIcon : downIcon} 
          alt="Downvote" 
          className="w-4 h-4" 
        />
      </button>
    </div>
  );
};
export default VoteButtons;
