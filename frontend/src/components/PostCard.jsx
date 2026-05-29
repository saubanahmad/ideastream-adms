/** src/components/PostCard.jsx — Individual Post Card — Implementation: Phase 3 */
const PostCard = ({ post }) => (
  <div className="card mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="font-display text-lg font-semibold">{post?.title || 'Post Title'}</span>
      <span className="text-xs bg-brand-surface border border-brand-border text-brand-primary px-3 py-1 rounded-full font-medium">
        {post?.feed || 'IdeaStream'}
      </span>
    </div>
    <p className="text-brand-text text-sm leading-relaxed">{post?.content}</p>
    <div className="mt-4 flex items-center gap-4 text-sm text-brand-muted">
      <span className="font-medium text-brand-text">👤 {post?.authorUsername}</span>
      <span className="hover:text-brand-primary cursor-pointer transition-colors">⬆ {post?.upvoteCount ?? 0}</span>
      <span className="hover:text-red-500 cursor-pointer transition-colors">⬇ {post?.downvoteCount ?? 0}</span>
      <span className="hover:text-brand-primary cursor-pointer transition-colors">💬 {post?.comments?.length ?? 0}</span>
    </div>
  </div>
);
export default PostCard;
