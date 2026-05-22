/** src/components/FollowButton.jsx — Follow/Unfollow Button — Implementation: Phase 4 */
const FollowButton = ({ username, isFollowing = false }) => (
  <button className={isFollowing ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
    {isFollowing ? 'Following' : 'Follow'}
  </button>
);
export default FollowButton;
