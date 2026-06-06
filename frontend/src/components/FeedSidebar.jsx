/**
 * src/components/FeedSidebar.jsx — Left Feed Navigation Sidebar
 *
 * Displays all 9 IdeaStream communities as clickable icon buttons.
 * Fixed on the left side of the screen.
 *
 * Clicking a feed navigates to /feed/:feedId which shows posts
 * filtered by that platform (implemented in Phase 3).
 */

import { useNavigate, useParams } from 'react-router-dom';
import { FEEDS } from '../utils/feedList';

import ideaStreamShortIcon from "../assets/icons/is-short.svg";
import cultivateShortIcon from "../assets/icons/C-short.svg";
import digitalFrontierShortIcon from "../assets/icons/DF-short.svg";
import fastLaneShortIcon from "../assets/icons/FL-short.svg";
import launchPadShortIcon from "../assets/icons/LP-short.svg";
import lifeScienceShortIcon from "../assets/icons/LS-short.svg";
import playLabShortIcon from "../assets/icons/PL-short.svg";
import tangibleTechShortIcon from "../assets/icons/TT-short.svg";
import urbanCoreShortIcon from "../assets/icons/UC-short.svg";

const ICONS = {
  'ideastream': ideaStreamShortIcon,
  'cultivate': cultivateShortIcon,
  'digitalfrontier': digitalFrontierShortIcon,
  'fastlane': fastLaneShortIcon,
  'launchpad': launchPadShortIcon,
  'lifescience': lifeScienceShortIcon,
  'playlab': playLabShortIcon,
  'tangibletech': tangibleTechShortIcon,
  'urbancore': urbanCoreShortIcon,
};

const FeedSidebar = () => {
  const navigate = useNavigate();
  const { feedId } = useParams(); // Currently active feed from URL

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-brand-surface border-r border-brand-border
                      flex flex-col items-center pt-4 pb-4 gap-2
                      shadow-sm z-40 overflow-y-auto">

      {FEEDS.map((feed) => {
        const isActive = feedId === feed.id || (!feedId && feed.id === 'ideastream');

        return (
          <button
            key={feed.id}
            onClick={() => navigate(feed.id === 'ideastream' ? '/home' : `/feed/${feed.id}`)}
            title={`${feed.label} — ${feed.description}`}
            className={`sidebar-icon w-12 h-12 rounded-xl flex items-center justify-center
                        text-2xl transition-all duration-200 border border-transparent
                        ${isActive
                          ? 'bg-brand-surface shadow-sm scale-110 border-brand-surfaceText'
                          : 'bg-brand-surface/50 hover:bg-brand-surface hover:scale-110 hover:border-brand-border'
                        }
                        active:scale-95 cursor-pointer outline-none`}
          >
            <span role="img" aria-label={feed.label} className="flex items-center justify-center">
              <img src={ICONS[feed.id]} alt={feed.label} className="h-10 w-10 object-contain" />
            </span>
          </button>
        );
      })}
    </aside>
  );
};

export default FeedSidebar;
