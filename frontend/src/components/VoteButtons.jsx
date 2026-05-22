/** src/components/VoteButtons.jsx — Upvote/Downvote Buttons — Implementation: Phase 3 */
const VoteButtons = ({ postId, upvoteCount = 0, downvoteCount = 0, userVote = null }) => (
  <div className="flex items-center gap-2">
    <button className="btn-ghost text-sm px-3 py-1">⬆ {upvoteCount}</button>
    <button className="btn-ghost text-sm px-3 py-1">⬇ {downvoteCount}</button>
  </div>
);
export default VoteButtons;
