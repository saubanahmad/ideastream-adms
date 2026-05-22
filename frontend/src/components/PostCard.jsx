/** src/components/PostCard.jsx — Individual Post Card — Implementation: Phase 3 */
const PostCard = ({ post }) => (
  <div className="card mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-display text-lg">{post?.title || 'Post Title'}</span>
      <span className="text-xs bg-brand-primary px-3 py-1 rounded-full">
        {post?.feed || 'IdeaStream'}
      </span>
    </div>
    <p className="text-brand-cream/80 text-sm">{post?.content}</p>
    <div className="mt-3 flex items-center gap-3 text-sm text-brand-cream/60">
      <span>👤 {post?.authorUsername}</span>
      <span>⬆ {post?.upvoteCount ?? 0}</span>
      <span>⬇ {post?.downvoteCount ?? 0}</span>
      <span>💬 {post?.comments?.length ?? 0}</span>
    </div>
  </div>
);
export default PostCard;
