/**
 * src/utils/feedList.js — Feed/Platform Definitions
 *
 * This is the frontend equivalent of the backend's constants.js FEEDS object.
 * It defines all 9 IdeaStream communities with metadata needed for the UI:
 *   - id: URL-safe identifier (used in route params and API calls)
 *   - label: Display name shown in the sidebar
 *   - description: Short tagline shown on the feed page
 *   - emoji: Visual icon shown in the sidebar
 *   - color: Accent color for feed-specific styling
 *
 * Usage:
 *   import { FEEDS, getFeedBySlug } from '../utils/feedList'
 */

export const FEEDS = [
  {
    id: 'ideastream',
    label: 'IdeaStream',
    apiValue: 'IdeaStream',        // Must match backend constants.js FEEDS values
    description: 'All ideas, one stream',
    emoji: '💡',
    color: '#914F1E',
  },
  {
    id: 'cultivate',
    label: 'Cultivate',
    apiValue: 'Cultivate',
    description: 'Agricultural & farming innovation',
    emoji: '🌱',
    color: '#4A7C59',
  },
  {
    id: 'digital-frontier',
    label: 'Digital Frontier',
    apiValue: 'Digital Frontier',
    description: 'Coding, software & tech ideas',
    emoji: '💻',
    color: '#1E6091',
  },
  {
    id: 'fastlane',
    label: 'FastLane',
    apiValue: 'FastLane',
    description: 'Automotive & motorsport ideas',
    emoji: '🚗',
    color: '#7D3C98',
  },
  {
    id: 'launchpad',
    label: 'Launchpad',
    apiValue: 'Launchpad',
    description: 'Startup & entrepreneurship',
    emoji: '🚀',
    color: '#E67E22',
  },
  {
    id: 'lifescience',
    label: 'LifeScience',
    apiValue: 'LifeScience',
    description: 'Biology, medicine & health',
    emoji: '🧬',
    color: '#1ABC9C',
  },
  {
    id: 'playlab',
    label: 'PlayLab',
    apiValue: 'PlayLab',
    description: 'Game design & development',
    emoji: '🎮',
    color: '#E74C3C',
  },
  {
    id: 'tangible-tech',
    label: 'Tangible Tech',
    apiValue: 'Tangible Tech',
    description: 'Robotics, hardware & IoT',
    emoji: '🤖',
    color: '#2C3E50',
  },
  {
    id: 'urban-core',
    label: 'Urban Core',
    apiValue: 'Urban Core',
    description: 'Architecture & civil engineering',
    emoji: '🏙️',
    color: '#7F8C8D',
  },
];

/**
 * getFeedBySlug — Find a feed by its URL slug (id field)
 * @param {string} slug - e.g. "cultivate", "digital-frontier"
 * @returns {Object|undefined} - The matching feed object
 */
export const getFeedBySlug = (slug) =>
  FEEDS.find((f) => f.id === slug);

/**
 * getFeedByApiValue — Find a feed by its API value
 * @param {string} apiValue - e.g. "Cultivate", "Digital Frontier"
 * @returns {Object|undefined}
 */
export const getFeedByApiValue = (apiValue) =>
  FEEDS.find((f) => f.apiValue === apiValue);

export default FEEDS;
