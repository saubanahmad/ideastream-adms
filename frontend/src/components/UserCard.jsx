/** src/components/UserCard.jsx — User suggestion card — Implementation: Phase 4 */
import FollowButton from './FollowButton';
const UserCard = ({ user }) => (
  <div className="flex items-center justify-between p-3 bg-brand-surface border border-brand-border rounded-xl mb-2 hover:bg-brand-surface/80 transition-colors">
    <div>
      <p className="font-display text-brand-text font-semibold">{user?.username}</p>
      <p className="text-brand-muted text-xs">{user?.fullName}</p>
    </div>
    <FollowButton username={user?.username} />
  </div>
);
export default UserCard;
