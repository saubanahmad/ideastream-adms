/** src/components/UserCard.jsx — User suggestion card — Implementation: Phase 4 */
import FollowButton from './FollowButton';
const UserCard = ({ user }) => (
  <div className="flex items-center justify-between p-3 bg-brand-primary/30 rounded-xl mb-2">
    <div>
      <p className="font-display text-brand-cream">{user?.username}</p>
      <p className="text-brand-cream/60 text-xs">{user?.fullName}</p>
    </div>
    <FollowButton username={user?.username} />
  </div>
);
export default UserCard;
