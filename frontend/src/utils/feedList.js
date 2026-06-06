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
    color: '#4A7C59',
  },
  {
    id: 'digitalfrontier',
    label: 'Digital Frontier',
    apiValue: 'Digital Frontier',
    description: 'Coding, software & tech ideas',
    color: '#0118d8',
  },
  {
    id: 'fastlane',
    label: 'FastLane',
    apiValue: 'FastLane',
    description: 'Automotive & motorsport ideas',
    color: '#8e1616',
  },
  {
    id: 'launchpad',
    label: 'Launchpad',
    apiValue: 'Launchpad',
    description: 'Startup & entrepreneurship',
    color: '#e6521f',
  },
  {
    id: 'lifescience',
    label: 'LifeScience',
    apiValue: 'LifeScience',
    description: 'Biology, medicine & health',
    color: '#b31312',
  },
  {
    id: 'playlab',
    label: 'PlayLab',
    apiValue: 'PlayLab',
    description: 'Game design & development',
    color: '#450492',
  },
  {
    id: 'tangibletech',
    label: 'Tangible Tech',
    apiValue: 'Tangible Tech',
    description: 'Robotics, hardware & IoT',
    color: '#34a7b2',
  },
  {
    id: 'urbancore',
    label: 'Urban Core',
    apiValue: 'Urban Core',
    description: 'Architecture & civil engineering',
    color: '#0d7377',
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
